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
import { injectIntl } from "react-intl";
const { Section, Item, CollectionView, CollectionViewItem } = TableView

@injectIntl
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
          // text: '浏览器',
          height: 0
        },
        largeTitle: {
          visible: true
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: false,
        // searchBarPlaceholder: '搜索或输入url'
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  searchBarUpdated({ text, isFocused, isSubmitting }) {
    if (isSubmitting) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          title: {
            text: t(this,'浏览器')
          },
          largeTitle: {
            visible: true
          },
          searchBar: true,
          searchBarHiddenWhenScrolling: false,
          searchBarPlaceholder: t(this,'搜索或输入url')
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
          t(this,'暂无EOS钱包'),
          '',
          [
            { text: t(this,'确定'), onPress: () => {} }
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
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: t(this,'浏览器'),
        },
      },
      searchBarPlaceholder: t(this,'搜索或输入url'),
    })
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
            title={t(this,'热门推荐')}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
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
          <Item
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
          />
        </Section>
      </TableView>
    )

    return (
      <TableView
        style={{ flex: 1, backgroundColor: 'white' }}
        headerBackgroundColor="white"
        headerTextColor="black"
        separatorStyle={TableView.Consts.SeparatorStyle.None}
        onItemNotification={this.onItemNotification}
        onCollectionViewDidSelectItem={this.onCollectionViewDidSelectItem}
      >
        <Section>
          <Item
            height={318}
            containCollectionView
            collectionViewInsideTableViewCell="FeaturedDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="FeaturedDappCollectionViewCell"
          >
            <CollectionView>
              {featured.map(item =>
                <CollectionViewItem
                  reactModuleForCollectionViewCell="FeaturedDappCollectionViewCell"
                  height="315"
                  title={item.title}
                  description={item.title}
                  img={item.img_url}
                  url={item.jump_url}
                  key={item.id}
                  uid={item.id}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        {bookmarked && !!bookmarked.length && <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title={t(this,'我的收藏')}
            buttonText={t(this,'更多')}
            category="bookmarked"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>}
        {bookmarked && !!bookmarked.length && <Section>
          <Item
            height={bookmarked.length >= 3 ? 234 : bookmarked.length * 78}
            containCollectionView
            collectionViewInsideTableViewCell="SmallDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="SmallDappCollectionViewCellNew"
          >
            <CollectionView>
              {bookmarked.map((item, index) =>
                <CollectionViewItem
                  key={item.id}
                  uid={item.id}
                  reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                  reactModuleForCollectionViewCellKey="SmallDappCollectionViewCellNew"
                  height="78"
                  description={item.description.zh}
                  name={item.display_name.zh}
                  icon={item.icon_url}
                  url={item.url}
                  showSeparator={index % (bookmarked.length >= 3 ? 3 : bookmarked.length) !== ((bookmarked.length >= 3 ? 3 : bookmarked.length) - 1)}
                />
               )}
            </CollectionView>
          </Item>
        </Section>}
        {bookmarked && !!bookmarked.length && <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>}
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title={t(this,'最新上架')}
            buttonText={t(this,'更多')}
            category="new"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>
        <Section>
          <Item
            height={234}
            containCollectionView
            collectionViewInsideTableViewCell="SmallDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="SmallDappCollectionViewCellNew"
          >
            <CollectionView>
              {newDapp.map((item, index) =>
                <CollectionViewItem
                  key={item.id}
                  uid={item.id}
                  reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                  reactModuleForCollectionViewCellKey="SmallDappCollectionViewCellNew"
                  height="78"
                  description={item.description.zh}
                  name={item.display_name.zh}
                  icon={item.icon_url}
                  url={item.url}
                  showSeparator={index % 3 !== 2}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title={t(this,'热门应用')}
            buttonText={t(this,'更多')}
            category="hot"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>
        <Section>
          <Item
            height={234}
            containCollectionView
            collectionViewInsideTableViewCell="LargeDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="LargeDappCollectionViewCellHot"
          >
            <CollectionView>
              {hotDapp.map((item, index) =>
                <CollectionViewItem
                  key={item.id}
                  uid={item.id}
                  reactModuleForCollectionViewCell="LargeDappCollectionViewCell"
                  reactModuleForCollectionViewCellKey="LargeDappCollectionViewCellNew"
                  height="117"
                  description={item.description.zh}
                  name={item.display_name.zh}
                  icon={item.icon_url}
                  url={item.url}
                  showSeparator={index % 2 !== 1}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title={t(this,'游戏')}
            buttonText={t(this,'更多')}
            category="game"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>
        <Section>
          <Item
            height={234}
            containCollectionView
            collectionViewInsideTableViewCell="SmallDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="SmallDappCollectionViewCellGame"
          >
            <CollectionView>
              {gameDapp.map((item, index) =>
                <CollectionViewItem
                  key={item.id}
                  uid={item.id}
                  reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                  reactModuleForCollectionViewCellKey="SmallDappCollectionViewCellGame"
                  height="78"
                  description={item.description.zh}
                  name={item.display_name.zh}
                  icon={item.icon_url}
                  url={item.url}
                  showSeparator={index % 3 !== 2}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title={t(this,'工具')}
            buttonText={t(this,'更多')}
            category="tool"
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>
        <Section>
          <Item
            height={234}
            containCollectionView
            collectionViewInsideTableViewCell="SmallDappCollectionViewCell"
            collectionViewInsideTableViewCellKey="SmallDappCollectionViewCellTool"
          >
            <CollectionView>
              {toolDapp.map((item, index) =>
                <CollectionViewItem
                  key={item.id}
                  uid={item.id}
                  reactModuleForCollectionViewCell="SmallDappCollectionViewCell"
                  reactModuleForCollectionViewCellKey="SmallDappCollectionViewCellTool"
                  height="78"
                  description={item.description.zh}
                  name={item.display_name.zh}
                  icon={item.icon_url}
                  url={item.url}
                  showSeparator={index % 3 !== 2}
                />
               )}
            </CollectionView>
          </Item>
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappHeaderTableViewCell"
            height={44}
            title={t(this,'所有分类')}
            buttonText={t(this,'更多')}
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            showSeparator
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="system"
            name={t(this,'系统')}
            onPress={this.toDappList.bind(this, t(this,'系统'), 'system')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="game"
            name={t(this,'游戏')}
            onPress={this.toDappList.bind(this, t(this,'游戏'), 'game')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="exchange"
            name={t(this,'去中心交易平台')}
            onPress={this.toDappList.bind(this, t(this,'去中心交易平台'), 'exchange')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="marketplace"
            name={t(this,'市场')}
            onPress={this.toDappList.bind(this, t(this,'市场'), 'marketplace')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="tool"
            name={t(this,'工具')}
            onPress={this.toDappList.bind(this, t(this,'工具'), 'tool')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="explorer"
            name={t(this,'区块链浏览器')}
            onPress={this.toDappList.bind(this, t(this,'区块链浏览器'), 'explorer')}
            showSeparator
          />
          <Item
            reactModuleForCell="DappCategoryTableViewCell"
            height={44}
            category="news"
            name={t(this,'资讯')}
            onPress={this.toDappList.bind(this, t(this,'资讯'), 'news')}
          />
        </Section>
        <Section>
          <Item
            reactModuleForCell="DappFooterTableViewCell"
            height={16}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
          />
        </Section>
      </TableView>
    )
  }
}
