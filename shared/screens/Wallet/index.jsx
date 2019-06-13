import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { View, Text, Clipboard, ActivityIndicator, TouchableHighlight } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
// import FastImage from 'react-native-fast-image'
import SplashScreen from 'react-native-splash-screen'
import Modal from 'react-native-modal'
import KeyboardManager from 'react-native-keyboard-manager'
import * as walletActions from 'actions/wallet'
import * as identityActions from 'actions/identity'
import * as balanceActions from 'actions/balance'
import * as accountActions from 'actions/account'
import * as tickerActions from 'actions/ticker'
import * as contactActions from 'actions/contact'
import * as assetActions from 'actions/asset'
import {
  identityWalletSelector,
  importedWalletSelector,
  activeWalletSelector
} from 'selectors/wallet'
import { activeWalletBalanceSelector, activeWalletAssetsBalanceSelector } from 'selectors/balance'
import { activeWalletSelectedAssetsSelector } from 'selectors/asset'
import { activeWalletTickerSelector } from 'selectors/ticker'
import { accountResourcesByIdSelector } from 'selectors/account'
import { managingWalletChildAddressSelector } from 'selectors/address'
import { formatCycleTime, formatMemorySize } from 'utils/format'
import Sound from 'react-native-sound'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import * as api from 'utils/api'

import styles from './styles'
const { Section, Item, CollectionView, CollectionViewItem } = TableView

Sound.setCategory('Playback')
const copySound = new Sound('copy.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error)
    return
  }

  console.log(`duration in seconds: ${copySound.getDuration()}number of channels: ${copySound.getNumberOfChannels()}`)
})

@injectIntl

@connect(
  state => ({
    identity: state.identity,
    scanIdentity: state.scanIdentity,
    getBalance: state.getBalance,
    identityWallets: identityWalletSelector(state),
    importedWallets: importedWalletSelector(state),
    activeWalletId: state.wallet.activeWalletId,
    activeWallet: activeWalletSelector(state),
    balance: activeWalletBalanceSelector(state),
    assetsBalance: activeWalletAssetsBalanceSelector(state),
    ticker: activeWalletTickerSelector(state),
    portfolio: state.portfolio.byId,
    resources: accountResourcesByIdSelector(state),
    childAddress: managingWalletChildAddressSelector(state),
    selectedAsset: activeWalletSelectedAssetsSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...identityActions,
      ...walletActions,
      ...balanceActions,
      ...accountActions,
      ...tickerActions,
      ...contactActions,
      ...assetActions
    }, dispatch)
  })
)

export default class Wallet extends Component {
  static get options() {
    return {
      topBar: {
        leftButtons: [
          {
            id: 'manage',
            icon: require('resources/images/List.png')
          }
        ],
        rightButtons: [
          {
            id: 'scan',
            icon: require('resources/images/scan2_right.png')
          }
        ]
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.activeWalletId !== prevState.activeWalletId) {
      return { activeWalletId: nextProps.activeWalletId }
    } else {
      return null
    }
  }

  state = {
    showModal: false,
    showModalContent: false,
    activeWalletId: null,
    switching: false
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'manage') {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.WalletList'
            }
          }]
        }
      })
    } else if (buttonId === 'scan') {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.Camera',
              passProps: { from: 'wallet' }
            }
          }]
        }
      })
    }
  }

  async componentDidMount() {
    console.log('walletcomponentDidMount')
    this.navigationEventListener = Navigation.events().bindComponent(this)

    this.props.actions.scanIdentity.requested()
    this.props.actions.getTicker.requested()
    SplashScreen.hide()
    KeyboardManager.setToolbarDoneBarButtonItemText('完成')
    KeyboardManager.setToolbarPreviousNextButtonEnable(true)
    this.props.actions.setSelectedContact(null)

    /* for (let i = 0; i < 200; i++) {
     *   // Replace me with a link to a large file
     *   // http://ipv4.download.thinkbroadband.com/5MB.zip
     *   const res = await fetch('https://market.bitportal.io/api/v2/t
       ickers', { mode: 'no-cors' })
     *   const result = await api.getTicker()
     *   console.log('fetched', result.length)
     * }*/
  }

  componentWillUnmount() {
    if (this.navigationEventListener) {
      console.log('walletcomponentWillUnmount')
      this.navigationEventListener.remove()
    }
  }

  async componentDidAppear() {
    this.setState({ switching: false })

    const { activeWallet, selectedAsset } = this.props

    if (this.props.activeWalletId) {
      this.scrollToItem(this.state.activeWalletId)


      this.props.actions.getBalance.requested(activeWallet)

      if (activeWallet && (activeWallet.chain === 'EOS') && activeWallet.address) {
        this.props.actions.scanEOSAsset.requested(activeWallet)
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeWalletId !== this.state.activeWalletId) {
      this.scrollToItem(this.state.activeWalletId)
    }
  }

  scrollToItem = (walletId) => {
    const { identityWallets, importedWallets } = this.props
    const index = identityWallets.filter(wallet => !!wallet.address).concat(importedWallets).findIndex(wallet => wallet.id === walletId)
    if (index !== -1) {
      this.tableView.scrollCollectonViewToItem({ itemIndex: index })
    }
  }

  toManage = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WalletList'
          }
        }]
      }
    })
  }

  addAssets = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AddAssets'
      }
    })
  }

  getNameBySymbol = (symbol) => {
    if (symbol === 'BTC') {
      return 'Bitcoin'
    } else if (symbol === 'ETH') {
      return 'Etheruem'
    } else if (symbol === 'PCX') {
      return 'ChainX'
    } else {
      return symbol
    }
  }

  toAsset = async (symbol, asset) => {
    const constants = await Navigation.constants()
    const name = this.getNameBySymbol(symbol)

    if (!asset) {
      const assetId = `${this.props.activeWallet.chain}/${symbol}`
      this.props.actions.setActiveAsset(assetId)

      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.Asset',
          passProps: {
            statusBarHeight: constants.statusBarHeight
          },
          options: {
            topBar: {
              title: {
                text: `${name} (${this.props.balance.symbol})`
              }
            }
          }
        }
      })
    } else {
      const assetId = `${asset.chain}/${asset.contract}/${asset.symbol}`
      this.props.actions.setActiveAsset(assetId)

      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.Asset',
          passProps: {
            statusBarHeight: constants.statusBarHeight
          },
          options: {
            topBar: {
              title: {
                text: `${asset.name || asset.symbol} (${asset.symbol})`
              }
            }
          }
        }
      })
    }
  }

  vote = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Voting'
          },
          options: {
            topBar: {
              searchBar: true,
              searchBarHiddenWhenScrolling: false,
              searchBarPlaceholder: 'Search'
            }
          }
        }]
      }
    })
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'toManageWallet') {
      const { walletInfo } = data
      this.props.actions.setManagingWallet(walletInfo.id)

      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.ManageWallet',
          passProps: { ...walletInfo, fromCard: true  }
        }
      })
    } else if (action === 'copy') {
      this.setState({ showModal: true, showModalContent: true }, () => {
        Clipboard.setString(data.text)
        copySound.play((success) => {
          if (success) {
            console.log('successfully finished playing')
          } else {
            console.log('playback failed due to audio decoding errors')
            copySound.reset()
          }
        })

        setTimeout(() => {
          this.setState({ showModal: false }, () => {
            this.setState({ showModalContent: false })
          })
        }, 1000)
      })
    }
  }

  onScrollViewDidEndDecelerating = (data) => {
    const action = data.action
    this.setState({ switching: action === 'start' })

    if (action === 'end') {
      ReactNativeHapticFeedback.trigger('selection', true)

      const { identityWallets, importedWallets } = this.props
      const page = data.page
      const wallet = identityWallets.filter(wallet => !!wallet.address).concat(importedWallets)[page]
      if (wallet) this.props.actions.setActiveWallet(wallet.id)
    }
  }

  onRefresh = () => {
    this.props.actions.getBalance.refresh(this.props.activeWallet)
  }

  onLeadingSwipe = (data) => {
    this.props.actions.setTransferWallet(this.props.activeWallet.id)

    if (data.isToken) {
      const assetId = `${data.chain}/${data.contract}/${data.symbol}`
      this.props.actions.setTransferAsset(assetId)
    } else {
      const assetId = `${data.chain}/${data.symbol}`
      this.props.actions.setTransferAsset(assetId)
    }

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.TransferAsset',
            options: {
              topBar: {
                title: {
                  text: `发送${data.symbol}到`
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    text: '取消'
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  onTrailingSwipe = async (data) => {
    const constants = await Navigation.constants()

    if (data.isToken) {
      const assetId = `${data.chain}/${data.contract}/${data.symbol}`
      this.props.actions.setTransferAsset(assetId)
    } else {
      const assetId = `${data.chain}/${data.symbol}`
      this.props.actions.setTransferAsset(assetId)
    }

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.ReceiveAsset',
            passProps: {
              statusBarHeight: constants.statusBarHeight
            },
            options: {
              topBar: {
                title: {
                  text: `接收 ${data.symbol}`
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    text: '取消'
                  }
                ],
                noBorder: data.chain === 'BITCOIN' && this.props.childAddress && this.props.activeWallet.address !== this.props.childAddress
              }
            }
          }
        }]
      }
    })
  }

  render() {
    const { identity, identityWallets, importedWallets, scanIdentity, balance, getBalance, ticker, activeWallet, portfolio, resources, intl, selectedAsset, assetById } = this.props
    const loading = scanIdentity.loading
    const loaded = scanIdentity.loaded
    const error = scanIdentity.error
    const identityWalletsCount = identityWallets.length
    const importedWalletsCount = importedWallets.length
    const chain = activeWallet ? activeWallet.chain : ''

    if (loading && !identityWalletsCount && !importedWalletsCount) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginTop: 80 }}>
            <ActivityIndicator size="small" color="#666666" />
            <Text style={{ marginTop: 10, color: '#666666' }}>加载钱包</Text>
          </View>
        </View>
      )
    }

    if ((!!loaded || !!error) && !identityWalletsCount && !importedWalletsCount) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginTop: 80 }}>
            <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.7} onPress={this.toManage}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#666666', fontSize: 17 }}>
                  <FormattedMessage id="no_wallet_yet" />
                </Text>
                <Text style={{ marginTop: 10, color: '#666666', borderWidth: 1, borderColor: '#666666', padding: 4, paddingRight: 8, paddingLeft: 8, borderRadius: 4 }}>开始添加</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      )
    }

    const getBalanceRefreshing = getBalance.refreshing
    const collectionViewInitialIndex = activeWallet && activeWallet.id && identityWallets.filter(wallet => !!wallet.address).concat(importedWallets).findIndex(wallet => wallet.id === activeWallet.id)

    const assetItems = []
    if (balance) {
      assetItems.push(
        <Item
          key={activeWallet.address}
          onPress={!this.state.switching ? this.toAsset.bind(this, balance.symbol, null) : () => {}}
          reactModuleForCell="AssetBalanceTableViewCell"
          height={60}
          balance={intl.formatNumber(balance.balance, { minimumFractionDigits: balance.precision, maximumFractionDigits: balance.precision })}
          amount={(ticker && ticker[`${activeWallet.chain}/${activeWallet.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${activeWallet.symbol}`], { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          currency="$"
          symbol={balance.symbol}
          name={balance.symbol === chain ? chain : (!!chain && chain.charAt(0) + chain.slice(1).toLowerCase())}
          componentId={this.props.componentId}
          switching={this.state.switching}
          selectionStyle={this.state.switching ? TableView.Consts.CellSelectionStyle.None : TableView.Consts.CellSelectionStyle.Default}
          chain={chain}
          showSeparator={selectedAsset && selectedAsset.length}
          swipeable={true}
          trailingTitle="收款"
          leadingTitle="转账"
        />
      )
      const assetsBalance = this.props.assetsBalance

      if (selectedAsset && selectedAsset.length) {
        for (let i = 0; i < selectedAsset.length; i++) {
          const assetBalance = assetsBalance[`${selectedAsset[i].contract}/${selectedAsset[i].symbol}`]

          assetItems.push(
            <Item
              key={selectedAsset[i].contract}
              isToken={true}
              contract={selectedAsset[i].contract}
              onPress={!this.state.switching ? this.toAsset.bind(this, balance.symbol, selectedAsset[i]) : () => {}}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance={intl.formatNumber(assetBalance ? assetBalance.balance : 0, { minimumFractionDigits: assetBalance ? assetBalance.precision : balance.precision, maximumFractionDigits: assetBalance ? assetBalance.precision : balance.precision })}
              amount={(ticker && ticker[`${activeWallet.chain}/${selectedAsset[i].symbol}`]) ? intl.formatNumber(0 * +ticker[`${activeWallet.chain}/${selectedAsset[i].symbol}`], { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              currency="$"
              symbol={selectedAsset[i].symbol}
              name={selectedAsset[i].name || selectedAsset[i].symbol}
              componentId={this.props.componentId}
              switching={this.state.switching}
              selectionStyle={this.state.switching ? TableView.Consts.CellSelectionStyle.None : TableView.Consts.CellSelectionStyle.Default}
              chain={chain}
              icon_url={selectedAsset[i].icon_url}
              swipeable={true}
              showSeparator={selectedAsset.length - 1 !== i}
              trailingTitle="收款"
              leadingTitle="转账"
            />
          )
        }
      }
    }

    return (
      <View style={styles.container}>
        <TableView
          style={{ flex: 1, height: 44 * 20 + 22 }}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          canRefresh
          refreshing={getBalanceRefreshing}
          onRefresh={this.onRefresh}
          headerBackgroundColor="white"
          headerTextColor="black"
          headerFontSize={22}
          cellSeparatorInset={{ left: 66, right: 16 }}
          separatorStyle={TableView.Consts.SeparatorStyle.None}
          onItemNotification={this.onItemNotification}
          onScrollViewDidEndDecelerating={this.onScrollViewDidEndDecelerating}
          onCollectionViewDidSelectItem={() => {}}
          ref={(ref) => { this.tableView = ref }}
          onLeadingSwipe={this.onLeadingSwipe}
          onTrailingSwipe={this.onTrailingSwipe}
        >
          <Section uid="WalletCardCollectionViewCell">
            <Item
              height="205"
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              containCollectionView
              collectionViewInitialIndex={collectionViewInitialIndex}
              cellCount={identityWalletsCount}
              collectionViewInsideTableViewCell="WalletCardCollectionViewCell"
              collectionViewInsideTableViewCellKey="WalletCardCollectionViewCell"
              disablePress
            >
              <CollectionView>
                {identityWallets.filter(wallet => !!wallet.address).map(wallet =>
                  <CollectionViewItem
                    key={wallet.id}
                    uid={wallet.id}
                    type="identity"
                    height="190"
                    reactModuleForCollectionViewCell="WalletCardCollectionViewCell"
                    reactModuleForCollectionViewCellKey="WalletCardCollectionViewCell"
                    address={wallet.address}
                    name={wallet.name}
                    chain={wallet.chain}
                    symbol={wallet.symbol}
                    segWit={wallet.segWit}
                    source={wallet.source}
                    cpu={(wallet.chain === 'EOS' && resources && resources[`${wallet.chain}/${wallet.address}`]) ? formatCycleTime(resources[`${wallet.chain}/${wallet.address}`].CPU) : '--'}
                    net={(wallet.chain === 'EOS' && resources && resources[`${wallet.chain}/${wallet.address}`]) ? formatMemorySize(resources[`${wallet.chain}/${wallet.address}`].NET) : '--'}
                    ram={(wallet.chain === 'EOS' && resources && resources[`${wallet.chain}/${wallet.address}`]) ? formatMemorySize(resources[`${wallet.chain}/${wallet.address}`].RAM) : '--'}
                    currency="$"
                    totalAsset={(portfolio && portfolio[`${wallet.chain}/${wallet.address}`]) ? intl.formatNumber(portfolio[`${wallet.chain}/${wallet.address}`].totalAsset, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    componentId={this.props.componentId}
                    separatorStyle={TableView.Consts.SeparatorStyle.None}
                  />
                 )}
                 {importedWallets.map(wallet =>
                   <CollectionViewItem
                     key={wallet.id}
                     uid={wallet.id}
                     type="imported"
                     height="190"
                     reactModuleForCollectionViewCell="WalletCardCollectionViewCell"
                     reactModuleForCollectionViewCellKey="WalletCardCollectionViewCell"
                     address={wallet.address}
                     name={wallet.name}
                     chain={wallet.chain}
                     symbol={wallet.symbol}
                     segWit={wallet.segWit}
                     source={wallet.source}
                     cpu={(wallet.chain === 'EOS' && resources && resources[`${wallet.chain}/${wallet.address}`]) ? formatCycleTime(resources[`${wallet.chain}/${wallet.address}`].CPU) : '--'}
                     net={(wallet.chain === 'EOS' && resources && resources[`${wallet.chain}/${wallet.address}`]) ? formatMemorySize(resources[`${wallet.chain}/${wallet.address}`].NET) : '--'}
                     ram={(wallet.chain === 'EOS' && resources && resources[`${wallet.chain}/${wallet.address}`]) ? formatMemorySize(resources[`${wallet.chain}/${wallet.address}`].RAM) : '--'}
                     currency="$"
                     totalAsset={(portfolio && portfolio[`${wallet.chain}/${wallet.address}`]) ? intl.formatNumber(portfolio[`${wallet.chain}/${wallet.address}`].totalAsset, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                     componentId={this.props.componentId}
                     separatorStyle={TableView.Consts.SeparatorStyle.None}
                   />
                 )}
              </CollectionView>
            </Item>
          </Section>
          <Section uid="HeaderTableViewCell">
            <Item
              reactModuleForCell="HeaderTableViewCell"
              title="资产"
              height={48}
              componentId={this.props.componentId}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              switching={this.state.switching}
              chain={chain}
              hasRightButton={chain === 'ETHEREUM' || chain === 'EOS'}
            />
          </Section>
          {!!balance && (<Section headerHeight={0} uid="AssetBalanceTableViewCell" canEdit={!this.state.switching}>{assetItems}</Section>)}
        </TableView>
        <Modal
          isVisible={this.state.showModal}
          backdropOpacity={0}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
        >
          {this.state.showModalContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>已复制</Text>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
