import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { View, Text, Clipboard, ActivityIndicator, TouchableHighlight, Image, Alert, NativeModules, ScrollView } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
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
import * as currencyActions from 'actions/currency'
import {
  identityWalletSelector,
  importedWalletSelector,
  activeWalletSelector
} from 'selectors/wallet'
import { activeWalletBalanceSelector, activeWalletAssetsBalanceSelector } from 'selectors/balance'
import { activeWalletSelectedAssetsSelector } from 'selectors/asset'
import { activeWalletTickerSelector } from 'selectors/ticker'
import { accountResourcesByIdSelector } from 'selectors/account'
import { currencySelector } from 'selectors/currency'
import { managingWalletChildAddressSelector } from 'selectors/address'
import { getNameBySymbol } from 'utils'
import { formatCycleTime, formatMemorySize } from 'utils/format'
import Sound from 'react-native-sound'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import * as api from 'utils/api'
import Profile from 'screens/Profile'

import styles from './styles'
const { Section, Item, CollectionView, CollectionViewItem } = TableView

const SPAlert = NativeModules.SPAlert

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
    selectedAsset: activeWalletSelectedAssetsSelector(state),
    currency: currencySelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...identityActions,
      ...walletActions,
      ...balanceActions,
      ...accountActions,
      ...tickerActions,
      ...contactActions,
      ...assetActions,
      ...currencyActions
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

  subscription = Navigation.events().bindComponent(this)

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
              name: 'BitPortal.WalletList',
              passProps: {
                showType:'modal',
              }
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
    this.props.actions.scanIdentity.requested()
    this.props.actions.getTicker.requested()
    SplashScreen.hide()
    KeyboardManager.setEnable(true)
    KeyboardManager.setPreventShowingBottomBlankSpace(true)
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

  }

  componentDidAppear() {
    this.setState({ switching: false })

    const { activeWallet } = this.props

    if (this.props.activeWalletId) {
      this.scrollToItem(this.state.activeWalletId)
      this.props.actions.getBalance.requested(activeWallet)

      if (activeWallet && activeWallet.address) {
        if (activeWallet.chain === 'EOS') {
          this.props.actions.scanEOSAsset.requested(activeWallet)
          this.props.actions.getAccount.requested(activeWallet)
        } else if (activeWallet.chain === 'ETHEREUM') {
          this.props.actions.scanETHAsset.requested(activeWallet)
          this.props.actions.getETHTokenBalanceList.requested(activeWallet)
        } else if (activeWallet.chain === 'CHAINX') {
          this.props.actions.getChainXTokenBalanceList.requested(activeWallet)
        }
      }
    }

    this.props.actions.getCurrencyRates.requested()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeWalletId !== this.state.activeWalletId) {
      this.scrollToItem(this.state.activeWalletId)
    }
  }

  scrollToItem = (walletId) => {
    const { identityWallets, importedWallets } = this.props
    const index = identityWallets.filter(wallet => !!wallet.address).concat(importedWallets).findIndex(wallet => wallet.id === walletId)
    if (index !== -1 && this.tableView) {
      this.tableView.scrollCollectonViewToItem({ itemIndex: index })
    }
  }

  toManage = () => {
    /* Navigation.showModal({
     *   stack: {
     *     children: [{
     *       component: {
     *         name: 'BitPortal.WalletList'
     *       }
     *     }]
     *   }
     * }) */
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WalletList',
        passProps: {
          showType:'push',
        }
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

  toAsset = async (symbol, asset) => {
    const constants = await Navigation.constants()
    const name = getNameBySymbol(symbol)

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
          passProps: { ...walletInfo, fromCard: true }
        }
      })
    } else if (action === 'copy') {
      Clipboard.setString(data.text)
      copySound.play((success) => {
        if (success) {
          console.log('successfully finished playing')
        } else {
          copySound.reset()
        }
      })

      SPAlert.presentMessage('已复制')
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
    if (this.props.activeWallet && this.props.activeWallet.chain === 'EOS') {
      this.props.actions.getAccount.refresh(this.props.activeWallet)
    }
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
      this.props.actions.setActiveAsset(assetId)
    } else {
      const assetId = `${data.chain}/${data.symbol}`
      this.props.actions.setActiveAsset(assetId)
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

  onAddAssetsPress = (data) => {
    const { chain } = data

    if (chain === 'ETHEREUM' || chain === 'EOS' || chain === 'CHAINX') {
      let symbol

      if (chain === 'ETHEREUM') {
        symbol = 'ETH'
      } else if (chain === 'EOS') {
        symbol = 'EOS'
      } else if (chain === 'CHAINX') {
        symbol = 'PCX'
      }

      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.AddAssets',
          options: {
            topBar: {
              title: {
                text: `添加${symbol}资产`
              }
            }
          }
        }
      })
    }
  }

  onMoreAccessoryPress = (data) => {
    if (data && data.uid) {
      this.props.actions.setManagingWallet(data.uid)

      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.ManageWallet',
          passProps: { fromCard: true }
        }
      })
    }
  }

  render() {
    const { identity, identityWallets, importedWallets, scanIdentity, balance, getBalance, ticker, activeWallet, portfolio, resources, intl, selectedAsset, assetById, currency } = this.props
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
            <Text style={{ marginTop: 10, color: '#666666' }}>{intl.formatMessage({ id: 'wallet_text_loading_wallet' })}</Text>
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
          balance={intl.formatNumber(balance.balance, { minimumFractionDigits: 0, maximumFractionDigits: balance.precision })}
          amount={(ticker && ticker[`${activeWallet.chain}/${activeWallet.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${activeWallet.symbol}`] * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          currency={currency.sign}
          symbol={balance.symbol}
          name={balance.symbol === chain ? chain : (!!chain && chain.charAt(0) + chain.slice(1).toLowerCase())}
          componentId={this.props.componentId}
          switching={this.state.switching}
          selectionStyle={this.state.switching ? TableView.Consts.CellSelectionStyle.None : TableView.Consts.CellSelectionStyle.Default}
          chain={chain}
          showSeparator={selectedAsset && selectedAsset.length}
          swipeable={true}
          trailingTitle={intl.formatMessage({ id: 'transfer_button_receive' })}
          leadingTitle={intl.formatMessage({ id: 'transfer_button_send' })}
        />
      )
      const assetsBalance = this.props.assetsBalance

      if (selectedAsset && selectedAsset.length) {
        for (let i = 0; i < selectedAsset.length; i++) {
          const assetBalance = assetsBalance && assetsBalance[`${selectedAsset[i].contract}/${selectedAsset[i].symbol}`]

          assetItems.push(
            <Item
              key={selectedAsset[i].contract}
              isToken={true}
              contract={selectedAsset[i].contract}
              onPress={!this.state.switching ? this.toAsset.bind(this, balance.symbol, selectedAsset[i]) : () => {}}
              reactModuleForCell="AssetBalanceTableViewCell"
              height={60}
              balance={intl.formatNumber(assetBalance ? assetBalance.balance : 0, { minimumFractionDigits: 0, maximumFractionDigits: assetBalance ? assetBalance.precision : balance.precision })}
              amount={(ticker && ticker[`${activeWallet.chain}/${selectedAsset[i].symbol}`]) ? intl.formatNumber(0 * +ticker[`${activeWallet.chain}/${selectedAsset[i].symbol}`] * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              currency={currency.sign}
              symbol={selectedAsset[i].symbol}
              name={selectedAsset[i].name || selectedAsset[i].symbol}
              componentId={this.props.componentId}
              switching={this.state.switching}
              selectionStyle={this.state.switching ? TableView.Consts.CellSelectionStyle.None : TableView.Consts.CellSelectionStyle.Default}
              chain={chain}
              icon_url={selectedAsset[i].icon_url}
              swipeable={true}
              showSeparator={selectedAsset.length - 1 !== i}
              trailingTitle={intl.formatMessage({ id: 'transfer_button_receive' })}
              leadingTitle={intl.formatMessage({ id: 'transfer_button_send' })}
            />
          )
        }
      }
    }

    return (
      <TableView
        style={{ flex: 1 }}
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
        onMoreAccessoryPress={this.onMoreAccessoryPress}
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
                  currency={currency.sign}
                  totalAsset={(portfolio && portfolio[`${wallet.chain}/${wallet.address}`]) ? intl.formatNumber(portfolio[`${wallet.chain}/${wallet.address}`].totalAsset * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  componentId={this.props.componentId}
                  separatorStyle={TableView.Consts.SeparatorStyle.None}
                  accessoryType={1}
                  moreButtonImage={require('resources/images/circle_more.png')}
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
                  currency={currency.sign}
                  totalAsset={(portfolio && portfolio[`${wallet.chain}/${wallet.address}`]) ? intl.formatNumber(portfolio[`${wallet.chain}/${wallet.address}`].totalAsset * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  componentId={this.props.componentId}
                  separatorStyle={TableView.Consts.SeparatorStyle.None}
                  accessoryType={1}
                  moreButtonImage={require('resources/images/circle_more.png')}
                />
              )}
            </CollectionView>
          </Item>
        </Section>
        <Section uid="HeaderTableViewCell">
          <Item
            reactModuleForCell="HeaderTableViewCell"
            title={intl.formatMessage({ id: 'wallet_header_title_asset' })}
            height={48}
            componentId={this.props.componentId}
            selectionStyle={TableView.Consts.CellSelectionStyle.None}
            chain={chain}
            accessoryType={(chain === 'ETHEREUM' || chain === 'EOS' || chain === 'CHAINX') ? 7 : TableView.Consts.AccessoryType.None}
            onAddAccessoryPress={!this.state.switching ? this.onAddAssetsPress : () => {}}
          />
        </Section>
        {!!balance && (<Section headerHeight={0} uid="AssetBalanceTableViewCell" canEdit={!this.state.switching}>{assetItems}</Section>)}
      </TableView>
    )
  }
}
