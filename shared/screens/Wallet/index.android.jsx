import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { View, Text, Clipboard, ActivityIndicator, TouchableHighlight, Dimensions, Image, ScrollView, RefreshControl, TouchableNativeFeedback } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
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
import { identityWalletSelector, importedWalletSelector, activeWalletSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector, activeWalletAssetsBalanceSelector } from 'selectors/balance'
import { activeWalletSelectedAssetsSelector } from 'selectors/asset'
import { activeWalletTickerSelector } from 'selectors/ticker'
import { accountResourcesByIdSelector } from 'selectors/account'
import { currencySelector } from 'selectors/currency'
import { managingWalletChildAddressSelector } from 'selectors/address'
import { formatCycleTime, formatMemorySize } from 'utils/format'
import { getNameBySymbol } from 'utils'
import * as api from 'utils/api'
import { assetIcons } from 'resources/images'
import FastImage from 'react-native-fast-image'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
// import RecyclerviewList, { DataSource } from 'react-native-recyclerview-list-android'
import ViewPager from '@react-native-community/viewpager'
import Loading from 'components/Loading'
import { walletIcons } from 'resources/images'
import styles from './styles'

const PreloadedImages = () => (
  <View style={{ position: 'absolute', left: -30, bottom: -30, width: 30, height: 30 }}>
    <Image
      source={require('resources/images/home_tab.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
    <Image
      source={require('resources/images/home_tab_active.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
    <Image
      source={require('resources/images/contact_tab.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
    <Image
      source={require('resources/images/contact_tab_active.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
    <Image
      source={require('resources/images/settings_tab.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
    <Image
      source={require('resources/images/settings_tab_active.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
    <Image
      source={require('resources/images/help_tab.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
    <Image
      source={require('resources/images/help_tab_active.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
    <Image
      source={require('resources/images/aboutus_tab.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
    <Image
      source={require('resources/images/aboutus_tab_active.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
    <Image
      source={require('resources/images/profile_placeholder_android.png')}
      style={{ width: 29, height: 29, position: 'absolute', left: 0, top: 0 }}
    />
  </View>
)

const dataProvider = new DataProvider((r1, r2) => r1.key !== r2.key)

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
  layoutProvider = new LayoutProvider(
    index => {
      return 0
    },
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 60
    }
  )

  state = {
    refreshing: false,
    dataProvider: dataProvider.cloneWithRows([]),
    activeWalletId: null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { balance, ticker, activeWallet, intl, selectedAsset, currency, assetsBalance } = nextProps
    const chain = activeWallet ? activeWallet.chain : ''

    const assetItems = []

    if (balance) {
      assetItems.push({
        key: activeWallet.address,
        balance: intl.formatNumber(balance.balance, { minimumFractionDigits: balance.precision, maximumFractionDigits: balance.precision }),
        amount: (ticker && ticker[`${activeWallet.chain}/${activeWallet.symbol}`]) ? intl.formatNumber(+balance.balance * +ticker[`${activeWallet.chain}/${activeWallet.symbol}`] * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00',
        currency: currency.sign,
        symbol: balance.symbol,
        name: balance.symbol === chain ? chain : (!!chain && chain.charAt(0) + chain.slice(1).toLowerCase()),
        chain: chain
      })

      if (selectedAsset && selectedAsset.length) {
        for (let i = 0; i < selectedAsset.length; i++) {
          const assetBalance = assetsBalance && assetsBalance[`${selectedAsset[i].contract}/${selectedAsset[i].symbol}`]

          assetItems.push({
            key: selectedAsset[i].contract,
            isToken: true,
            contract: selectedAsset[i].contract,
            balance: intl.formatNumber(assetBalance ? assetBalance.balance : 0, { minimumFractionDigits: assetBalance ? assetBalance.precision : balance.precision, maximumFractionDigits: assetBalance ? assetBalance.precision : balance.precision }),
            amount: (ticker && ticker[`${activeWallet.chain}/${selectedAsset[i].symbol}`]) ? intl.formatNumber(0 * +ticker[`${activeWallet.chain}/${selectedAsset[i].symbol}`] * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00',
            currency: currency.sign,
            symbol: selectedAsset[i].symbol,
            name: selectedAsset[i].name || selectedAsset[i].symbol,
            chain: chain,
            icon_url: selectedAsset[i].icon_url
          })
        }
      }
    }

    return { dataProvider: dataProvider.cloneWithRows(assetItems), activeWalletId: activeWallet && activeWallet.id }
  }

  componentDidMount() {
    this.props.actions.scanIdentity.requested()
    this.props.actions.getTicker.requested()
    this.props.actions.setSelectedContact(null)
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
      this.viewPager.setPageWithoutAnimation(index)
    }
  }

  addAssets = () => {
    Navigation.push('BitPortal.Root', {
      component: {
        name: 'BitPortal.Market'
      }
    })
  }

  onPress = () => {
    console.log('onPress')
  }

  toManage = () => {
    Navigation.push('BitPortal.Root', {
      component: {
        name: 'BitPortal.WalletList'
      }
    })
  }

  toManageWallet = (walletId) => {
    this.props.actions.setManagingWallet(walletId)

    Navigation.push('BitPortal.Root', {
      component: {
        name: 'BitPortal.ManageWallet'
      }
    })
  }

  onRefresh = () => {

  }

  rowRenderer = (type, data) => {
    return (
      <TouchableNativeFeedback onPress={this.toAsset.bind(this, data.symbol, data.isToken ? { symbol: data.symbol, contract: data.contract, name: data.name } : null)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', true)} useForeground={true}>
        <View style={{ width: '100%', height: 60, paddingLeft: 16, paddingRight: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            {!!data.chain && !data.isToken && <FastImage source={assetIcons[data.chain.toLowerCase()]} style={{ width: 40, height: 40, marginRight: 16, borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}/>}
            {!!data.isToken && <View style={{
              width: 40,
              height: 40,
              marginRight: 16,
              borderWidth: 0,
              borderColor: 'rgba(0,0,0,0.2)',
              backgroundColor: 'white',
              borderRadius: 20
            }}>
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#B9C1CF'
              }}>
                <Text style={{
                  fontWeight: '500',
                  fontSize: 20,
                  color: 'white',
                  paddingLeft: 1.6
                }}>{data.symbol.slice(0, 1)}</Text>
              </View>
              <FastImage
                source={{ uri: data.icon_url }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: data.icon_url ? 'white' : 'rgba(0,0,0,0)',
                  borderWidth: 0.5,
                  borderColor: 'rgba(0,0,0,0.2)'
                }}
              />
            </View>}
            <View>
              <Text style={{ color: 'rgba(0,0,0,0.84)', fontSize: 17 }}>{data.symbol}</Text>
              <Text style={{ fontSize: 15 }}>{data.name}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end'}}>
            <Text style={{ color: '#673AB7', fontSize: 15 }}>{data.balance}</Text>
            <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.84)' }}>≈ {data.currency}{data.amount}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  onPageSelected = (e) => {
    const { identityWallets, importedWallets } = this.props
    const page = e.nativeEvent.position

    const wallet = identityWallets.filter(wallet => !!wallet.address).concat(importedWallets)[page]
    if (wallet) this.props.actions.setActiveWallet(wallet.id)
  }

  toAsset = (symbol, asset) => {
    const name = getNameBySymbol(symbol)

    if (!asset) {
      const assetId = `${this.props.activeWallet.chain}/${symbol}`
      this.props.actions.setActiveAsset(assetId)

      Navigation.push('BitPortal.Root', {
        component: {
          name: 'BitPortal.Asset',
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

      Navigation.push('BitPortal.Root', {
        component: {
          name: 'BitPortal.Asset',
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
        <Loading
          text={intl.formatMessage({ id: 'wallet_text_loading_wallet'})}
          extraModule={<PreloadedImages />}
        />
      )
    }

    if ((!!loaded || !!error) && !identityWalletsCount && !importedWalletsCount) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'rgba(0,0,0,0.54)', fontSize: 14, marginBottom: 4 }}>
                <FormattedMessage id="no_wallet_yet" />
              </Text>
              <TouchableNativeFeedback onPress={this.toManage} background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={{ padding: 4, paddingRight: 8, paddingLeft: 8, borderRadius: 4, backgroundColor: '#673AB7', elevation: 3 }}>
                    <Text style={{ color: 'white', fontSize: 14 }}>开始添加</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
          </View>
          <PreloadedImages />
        </View>
      )
    }

    const getBalanceRefreshing = getBalance.refreshing
    const collectionViewInitialIndex = activeWallet && activeWallet.id && identityWallets.filter(wallet => !!wallet.address).concat(importedWallets).findIndex(wallet => wallet.id === activeWallet.id)

    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 222, width: '100%', justifyContent: 'center' }}>
          <ViewPager
            style={{ height: 190, width: '100%', overflow: 'visible' }}
            initialPage={collectionViewInitialIndex}
            pageMargin={16}
            ref={(ref) => { this.viewPager = ref }}
            onPageSelected={this.onPageSelected}
          >
            {identityWallets.filter(wallet => !!wallet.address).concat(importedWallets).map((wallet) => {
               const totalAsset = (portfolio && portfolio[`${wallet.chain}/${wallet.address}`]) ? intl.formatNumber(portfolio[`${wallet.chain}/${wallet.address}`].totalAsset * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'

               return (
                 <View key={wallet.id} style={{ backgroundColor: 'white', width: '100%', height: 176, borderRadius: 4, elevation: 3, overflow: 'hidden' }}>
                   <Image
                     source={require('resources/images/card_bg_android.png')}
                     style={{
                       width: '100%',
                       height: '100%'
                     }}
                   />
                   <View style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                     <View style={{ position: 'absolute', top: 12, left: 12, right: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                         <Image
                           source={walletIcons[wallet.chain.toLowerCase()]}
                           style={{
                             width: 40,
                             height: 40,
                             borderRadius: 4,
                             borderWidth: 0,
                             borderColor: 'rgba(0,0,0,0.2)',
                             backgroundColor: 'white',
                             marginRight: 10
                           }}
                         />
                         <View>
                           <Text style={{ fontSize: 17, color: 'white' }}>{wallet.name}</Text>
                           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                             <Text style={{ fontSize: 14, lineHeight: 15, color: 'white', opacity: 0.9, marginRight: 4 }}>{this.formatAddress(wallet.address)}</Text>
                             <Image
                               source={require('resources/images/copy_white_android.png')}
                               style={{ width: 14, height: 14, marginTop: 0 }}
                             />
                           </View>
                         </View>
                       </View>
                       <TouchableNativeFeedback onPress={this.toManageWallet.bind(this, wallet.id)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
                         <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                           <Image
                             source={require('resources/images/more_white_android.png')}
                             style={{
                               width: 24,
                               height: 24
                             }}
                           />
                         </View>
                       </TouchableNativeFeedback>
                     </View>
                     <View style={{ position: 'absolute', right: 44, left: 12, bottom: 12, flex: 1, alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
                       <View style={{ flex: 1, alignItems: 'flex-end' }}>
                         <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                           <Text style={{ color: 'white', fontSize: 20, marginRight: 2, marginBottom: 1, marginTop: 2 }}>{currency.sign}</Text>
                           <Text style={{ color: 'white', fontSize: 26 }}>{`${totalAsset.split('.')[0]}.`}</Text>
                           <Text style={{ color: 'white', fontSize: 22, marginBottom: 1, marginTop: 1 }}>{totalAsset.split('.')[1]}</Text>
                         </View>
                         <Text style={{ color: 'white', fontSize: 15, marginTop: 4 }}>总资产</Text>
                       </View>
                     </View>
                   </View>
                 </View>
               )
             })}
          </ViewPager>
        </View>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ paddingLeft: 16, width: '100%', height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 15, fontWeight: '500' }}>资产</Text>
            <TouchableNativeFeedback onPress={this.addAssets} background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.4)', false)}>
              <View style={{ height: 48, width: 56, alignItems: 'center', justifyContent: 'center', paddingRight: 16, paddingLeft: 16 }}>
                <Image source={require('resources/images/add_android.png')} style={{ width: 24, height: 24 }} />
              </View>
            </TouchableNativeFeedback>
          </View>
          <RecyclerListView
            style={{ flex: 1, backgroundColor: 'white' }}
            layoutProvider={this.layoutProvider}
            dataProvider={this.state.dataProvider}
            rowRenderer={this.rowRenderer}
            renderAheadOffset={60 * 10}
            scrollViewProps={{ refreshControl: <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} /> }}
          />
        </View>
        <PreloadedImages />
      </View>
    )
  }
}
