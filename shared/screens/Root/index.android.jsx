import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { View, Text, Clipboard, ActivityIndicator, TouchableHighlight, Dimensions, Image } from 'react-native'
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
import WalletScreen from 'screens/Wallet'
import MarketScreen from 'screens/Market'
import * as api from 'utils/api'
import FastImage from 'react-native-fast-image'

export const SecondTabScreen = () => (
  <View style={[{ flex: 1 }, { backgroundColor: '#EEEEEE' }]} />
)

export const ThirdTabScreen = () => (
  <View style={[{ flex: 1 }, { backgroundColor: '#EEEEEE' }]} />
)

const icons = {
  wallet: require('resources/images/wallet_android.png'),
  market: require('resources/images/market_android.png'),
  profile: require('resources/images/profile_android.png')
}

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

export default class Root extends Component {
  static get options() {
    return {
      topBar: {
        leftButtons: [
          {
            id: 'sideMenu',
            icon: require('resources/images/menu_android_small.png'),
            color: 'white'
          }
        ],
        rightButtons: [
          {
            id: 'scan',
            icon: require('resources/images/scan_android.png')
          },
          {
            id: 'list',
            icon: require('resources/images/list_android.png')
          },
          /* {
           *   id: 'search',
           *   icon: require('resources/images/search_android.png')
           * }*/
        ]
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    index: 1,
    routes: [
      { key: 'wallet', icon: 'wallet' },
      { key: 'market', icon: 'market' },
      { key: 'profile', icon: 'profile' },
    ]
  }

  navigationButtonPressed({ buttonId }) {
    switch (buttonId) {
      case 'sideMenu':
        this.toggleSideMenu()
        break
      default:
    }
  }

  toggleSideMenu() {
    Navigation.mergeOptions(this.props.componentId, {
      sideMenu: {
        left: {
          visible: true
        }
      }
    })
  }

  async componentDidMount() {
    SplashScreen.hide()
  }

  onIndexChange = (index) => {
    this.setState({ index })
    const { intl } = this.props
    const titles = [intl.formatMessage({ id: 'top_bar_title_wallet' }), intl.formatMessage({ id: 'top_bar_title_market' }), intl.formatMessage({ id: 'top_bar_title_profile' })]

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: titles[index]
        }
      }
    })
  }

  render() {
    return (
      <TabView
        swipeEnabled={false}
        scrollEnabled={false}
        navigationState={this.state}
        renderScene={SceneMap({ wallet: WalletScreen, market: MarketScreen, profile: ThirdTabScreen })}
        renderTabBar={props => <TabBar {...props} style={{ backgroundColor: '#673AB7' }} indicatorStyle={{ backgroundColor: 'white', color: 'white' }} renderIcon={({ route, focused }) => <Image source={icons[route.icon]} style={{ width: 18, height: 18, opacity: focused ? 1 : 0.7 }} />} />}
        onIndexChange={this.onIndexChange}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    )
  }
}
