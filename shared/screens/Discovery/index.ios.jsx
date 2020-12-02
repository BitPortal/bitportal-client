import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'utils/redux'
import TableView from 'components/TableView'
import { Navigation } from 'components/Navigation'
import { Alert, View, Text, ScrollView } from 'react-native'
import * as dappActions from 'actions/dapp'
import * as walletActions from 'actions/wallet'
import {
  dappSelector,
  newDappSelector,
  hotDappSelector,
  gameDappSelector,
  toolDappSelector,
  dappRecommendSelector,
  dappBookmarkSelector
} from 'selectors/dapp'
import { loadScatter, loadScatterSync, loadMetaMask, loadMetaMaskSync } from 'utils/inject'
import { activeWalletSelector, bridgeWalletSelector, identityWalletSelector, importedWalletSelector } from 'selectors/wallet'
import { transfromUrlText } from 'utils'
import { DarkModeContext } from 'utils/darkMode'

const { Section, Item, CollectionView, CollectionViewItem } = TableView

@connect(
  state => ({
    dapp: dappSelector(state),
    newDapp: newDappSelector(state),
    hotDapp: hotDappSelector(state),
    gameDapp: gameDappSelector(state),
    toolDapp: toolDappSelector(state),
    featured: dappRecommendSelector(state),
    bookmarked: dappBookmarkSelector(state),
    wallet: activeWalletSelector(state),
    bridgeWallet: bridgeWalletSelector(state),
    identityWallet: identityWalletSelector(state),
    importedWallet: importedWalletSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...dappActions,
      ...walletActions
    }, dispatch)
  })
)

export default class Discovery extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('browser'),
          height: 0
        },
        largeTitle: {
          visible: true
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: false,
        searchBarPlaceholder: gt('input_search_url')
      }
    }
  }
  static contextType = DarkModeContext
  subscription = Navigation.events().bindComponent(this)

  searchBarUpdated({ text, isFocused, isSubmitting }) {
    if (isSubmitting) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          title: {
            text: t(this,'browser')
          },
          largeTitle: {
            visible: true
          },
          searchBar: true,
          searchBarHiddenWhenScrolling: false,
          searchBarPlaceholder: t(this,'input_search_url')
        }
      })

      const url = transfromUrlText(text)

      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          searchBar: true,
          searchBarHiddenWhenScrolling: false,
          searchBarDeactive: true
        }
      })

      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.WebView',
              passProps: { url, hasAddressBar: true },
              options: {
                topBar: {
                  visible: false
                }
              }
            }
          }]
        }
      })
    }
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'toDappList') {
      const { categoryTitle, category } = data

      this.toDappList(categoryTitle, category)
    } else if (action === 'toDapp') {
      const { url, title, id } = data
      const { wallet } = this.props
      if (!wallet) {
        Alert.alert(
          '暂无EOS钱包',
          '',
          [
            { text: t(this,'button_ok'), onPress: () => {} }
          ]
        )
      } else {
        Navigation.showModal({
          stack: {
            children: [{
              component: {
                name: 'BitPortal.WebView',
                passProps: { url, hasAddressBar: true },
                options: {
                  topBar: {
                    visible: false
                  }
                }
              }
            }]
          }
        })
      }
    }
  }

  onCollectionViewDidSelectItem = (data) => {
    const { url, title, uid } = data

    if (title) {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.WebView',
          passProps: { url, hasAddressBar: true },
          options: {
            topBar: {
              visible: false
            }
          }
        }
      })
    }
  }

  toDappList = (title, category) => {
    this.props.actions.setDappFilter(category)
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappList',
        options: {
          topBar: {
            title: {
              text: title
            }
          }
        }
      }
    })
  }

  async componentDidMount() {
    // this.props.actions.getDapp.requested()
    // this.props.actions.getDappRecommend.requested()
    await loadScatter()
    await loadMetaMask()
  }

  componentDidAppear() {
    // this.props.actions.getDapp.requested()
    // this.props.actions.getDappRecommend.requested()
  }

  openDapp = (url, chain) => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        searchBar: true,
        searchBarHiddenWhenScrolling: false,
        searchBarDeactive: true
      }
    })

    if (!this.props.bridgeWallet || this.props.bridgeWallet.chain !== chain) {
      const selectedWallet = this.selectWallet(chain)
      if (selectedWallet) {
        this.props.actions.setBridgeWallet(selectedWallet.id)
        this.props.actions.setBridgeChain(selectedWallet.chain)
      }
    }

    console.log('url:',url)
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WebView',
            passProps: { url, hasAddressBar: true },
            options: {
              topBar: {
                visible: false
              }
            }
          }
        }]
      }
    })
  }

  selectWallet = (chain) => {
    const selectedIdentityWallet = this.props.identityWallet.filter(wallet => wallet.address && wallet.chain === chain)
    const selectedImportedWallet = this.props.importedWallet.filter(wallet => wallet.address && wallet.chain === chain)
    return selectedIdentityWallet[0] || selectedImportedWallet[0]
  }

  render() {
    const { dapp, newDapp, hotDapp, gameDapp, toolDapp, featured, bookmarked } = this.props

    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <TableView
        style={{ flex: 1 }}
        headerBackgroundColor="white"
        headerTextColor="black"
        separatorStyle={TableView.Consts.SeparatorStyle.None}
        onItemNotification={this.onItemNotification}
        onCollectionViewDidSelectItem={this.onCollectionViewDidSelectItem}
      >
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title={t(this,'menu_tops')}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            isDarkMode={isDarkMode}
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="Oasis Apps(MakerDAO)"
            onPress={this.openDapp.bind(this, 'https://oasis.app/', 'ETHEREUM')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="Compound"
            onPress={this.openDapp.bind(this, 'https://app.compound.finance/', 'ETHEREUM')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="DDEX Margin"
            onPress={this.openDapp.bind(this, 'https://ddex.io/margin/', 'ETHEREUM')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="Uniswap"
            onPress={this.openDapp.bind(this, 'https://uniswap.exchange/', 'ETHEREUM')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="DYDX"
            onPress={this.openDapp.bind(this, 'https://trade.dydx.exchange/', 'ETHEREUM')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="DeBank"
            onPress={this.openDapp.bind(this, 'https://debank.com/?atm=bitportal', 'ETHEREUM')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="0x Protocol"
            onPress={this.openDapp.bind(this, 'https://0x.org/portal/account', 'ETHEREUM')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="KyberSwap"
            onPress={this.openDapp.bind(this, 'https://kyberswap.com/swap/eth_knc', 'ETHEREUM')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="Crypto Kitties"
            onPress={this.openDapp.bind(this, 'http://www.cryptokitties.co', 'ETHEREUM')}
            showSeparator
          />
          {/* <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="PRA Candy Box"
            onPress={this.openDapp.bind(this, 'https://chain.pro/candybox', 'EOS')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="Newdex"
            onPress={this.openDapp.bind(this, 'https://newdex.340wan.com', 'EOS')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="WhaleEx"
            onPress={this.openDapp.bind(this, 'https://w.whaleex.com.cn/wallet', 'EOS')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappTrendingTableViewCell"
            height={44}
            title="EOSX"
            onPress={this.openDapp.bind(this, 'https://www.myeoskit.com', 'EOS')}
          /> */}
        </Section>
      </TableView>
    )
  }
}
