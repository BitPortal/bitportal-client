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
import * as api from 'utils/api'
import { assetIcons } from 'resources/images'
import FastImage from 'react-native-fast-image'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import RecyclerviewList, { DataSource } from 'react-native-recyclerview-list-android'
import ViewPager from '@react-native-community/viewpager'
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

const dataProvider = new DataProvider((r1, r2) => r1.id !== r2.id)

const balances = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 }
]

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

  layoutProvider2 = new LayoutProvider(
    index => {
      return 0
    },
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 200
    }
  )

  state = {
    refreshing: false,
    dataProvider: dataProvider.cloneWithRows(balances)
  }

  componentDidMount() {

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

  onRefresh = () => {

  }

  rowRenderer = (type, data) => {
    return (
      <TouchableHighlight underlayColor="rgba(0,0,0,0)" activeOpacity={1} style={{ width: '100%', height: 60, paddingLeft: 16, paddingRight: 16 }} onPress={this.onPress}>
        <View style={{ width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <FastImage source={assetIcons.bitcoin} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', marginRight: 16, borderWidth: 0.5, borderColor: '#D1D3D4' }} />
            <View>
              <Text style={{ color: 'black', fontWeight: '500', fontSize: 17 }}>BTC</Text>
              <Text style={{ fontSize: 15 }}>Bitcoin</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end'}}>
            <Text style={{ color: '#673AB7', fontSize: 15 }}>0.00000000</Text>
            <Text style={{ fontSize: 15 }}>≈ $0.00</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  rowRenderer2 = (type, data) => {
    return (
      <View style={{ backgroundColor: 'white', width: '100%', height: 176, borderRadius: 2, elevation: 3 }}>
        <Text>{data.id}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 222, width: '100%', justifyContent: 'center' }}>
          <ViewPager
            style={{ height: 190, width: '100%', overflow: 'visible' }}
            initialPage={0}
            pageMargin={16}
          >
            <View key="1" style={{ backgroundColor: 'white', width: '100%', height: 176, borderRadius: 2, elevation: 3 }}>
              <Text>First page</Text>
            </View>
            <View key="2" style={{ backgroundColor: 'white', width: '100%', height: 176, borderRadius: 2, elevation: 3 }}>
              <Text>Second page</Text>
            </View>
            <View key="3" style={{ backgroundColor: 'white', width: '100%', height: 176, borderRadius: 2, elevation: 3 }}>
              <Text>Third page</Text>
            </View>
          </ViewPager>
        </View>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ paddingLeft: 16, width: '100%', height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 15, fontWeight: '500' }}>资产</Text>
            <TouchableNativeFeedback onPress={this.addAssets} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.4)', true)}>
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
