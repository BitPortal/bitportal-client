import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { View, Text, Clipboard, ActivityIndicator, TouchableHighlight, Dimensions, Image } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import SplashScreen from 'react-native-splash-screen'
import KeyboardManager from 'react-native-keyboard-manager'
import * as walletActions from 'actions/wallet'
import * as identityActions from 'actions/identity'
import * as balanceActions from 'actions/balance'
import * as accountActions from 'actions/account'
import * as tickerActions from 'actions/ticker'
import * as contactActions from 'actions/contact'
import * as assetActions from 'actions/asset'
import * as currencyActions from 'actions/currency'
import * as uiActions from 'actions/ui'
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
      ...currencyActions,
      ...uiActions
    }, dispatch)
  })
)

export default class Root extends Component {
  static get options() {
    return {
      topBar: {
        elevation: 0,
        title: {
          text: '钱包'
        },
        leftButtons: [
          {
            id: 'sideMenu',
            icon: require('resources/images/menu_android_small.png'),
            color: 'white'
          }
        ]
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    index: 0,
    routes: [
      { key: 'wallet', icon: 'wallet' },
      { key: 'market', icon: 'market' }
    ]
  }

  navigationButtonPressed({ buttonId }) {
    switch (buttonId) {
      case 'sideMenu':
        this.toggleSideMenu()
        break
      case 'list':
        this.toManage()
        break
      case 'scan':
        this.toCamera()
        break
      case 'search':
        this.toSearch()
        break
      default:
    }
  }

  toSearch = () => {
    this.props.actions.showSearchBar()
    // this.setState({ searchBarEnabled: true })
    /* Navigation.showModal({
     *   stack: {
     *     children: [{
     *       component: {
     *         name: 'BitPortal.SearchMarket'
     *       }
     *     }]
     *   }
     * })*/
    /* Navigation.push('BitPortal.Root', {
     *   component: {
     *     name: 'BitPortal.SearchMarket'
     *   }
     * })*/
  }

  toCamera = () => {
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

  toggleSideMenu() {
    Navigation.mergeOptions(this.props.componentId, {
      sideMenu: {
        left: {
          visible: true
        }
      }
    })
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

  componentDidMount() {
    SplashScreen.hide()
  }

  componentDidAppear() {
    this.setNavBar(this.state.index)

    if (!this.state.index) {
      const { activeWalletId, activeWallet } = this.props

      if (activeWalletId) {
        this.props.actions.getBalance.requested(activeWallet)

        if (activeWallet && activeWallet.address) {
          if (activeWallet.chain === 'EOS') {
            this.props.actions.scanEOSAsset.requested(activeWallet)
            this.props.actions.getAccount.requested(activeWallet)
          } else if (activeWallet.chain === 'ETHEREUM') {
            this.props.actions.getETHTokenBalanceList.requested(activeWallet)
          } else if (activeWallet.chain === 'CHAINX') {
            this.props.actions.getChainXTokenBalanceList.requested(activeWallet)
          }
        }
      }

      this.props.actions.getCurrencyRates.requested()
    } else if (this.state.index === 1) {
      this.props.actions.getTicker.requested()
    }
  }

  setNavBar = (index) => {
    const { intl } = this.props
    const titles = [intl.formatMessage({ id: 'top_bar_title_wallet' }), intl.formatMessage({ id: 'top_bar_title_market' }), intl.formatMessage({ id: 'top_bar_title_profile' })]

    let rightButtons = []

    if (!index) {
      rightButtons = [
        {
          id: 'scan',
          icon: require('resources/images/scan_android.png')
        },
        {
          id: 'list',
          icon: require('resources/images/list_android.png')
        }
      ]
    } else if (index == 1) {
      rightButtons = [
        {
          id: 'search',
          icon: require('resources/images/search_android.png')
        }
      ]
    } else if (index == 2) {

    }

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: titles[index]
        },
        rightButtons,
        leftButtons: [
          {
            id: 'sideMenu',
            icon: require('resources/images/menu_android_small.png'),
            color: 'white'
          }
        ]
      }
    })
  }

  componentDidDisappear() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: []
      }
    })
  }

  onIndexChange = (index) => {
    this.setState({ index })
    this.setNavBar(index)

    if (!index) {
      if (this.props.activeWallet) {
        this.props.actions.getBalance.requested(this.props.activeWallet)
      }
    } else if (index === 1) {
      this.props.actions.getTicker.requested()
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TabView
          swipeEnabled={false}
          scrollEnabled={false}
          navigationState={this.state}
          renderScene={SceneMap({ wallet: WalletScreen, market: MarketScreen, profile: ThirdTabScreen })}
          renderTabBar={props => <TabBar {...props} style={{ backgroundColor: '#673AB7' }} indicatorStyle={{ backgroundColor: 'white', color: 'white' }} renderIcon={({ route, focused }) => <Image source={icons[route.icon]} style={{ width: 18, height: 18, opacity: focused ? 1 : 0.7 }} />} />}
          onIndexChange={this.onIndexChange}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
      </View>
    )
  }
}
