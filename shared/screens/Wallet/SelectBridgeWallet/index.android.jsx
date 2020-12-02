import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ActionSheetIOS, requireNativeComponent, Text, Dimensions, TouchableNativeFeedback } from 'react-native'
import { Navigation } from 'components/Navigation'
import { identityWalletSelector, importedWalletSelector, hasIdentityEOSWalletSelector, bridgeWalletListSelector } from 'selectors/wallet'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import WalletTableViewCell from 'components/TableViewCell/WalletTableViewCell'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as keyAccountActions from 'actions/keyAccount'
import styles from './styles'

const dataProvider = new DataProvider((r1, r2) => r1.id !== r2.id || r1.name !== r2.name || r1.chain !== r2.chain || r1.address !== r2.address)

@injectIntl

@connect(
  state => ({
    identity: state.identity,
    syncingEOSAccount: state.getKeyAccount.loading,
    identityWallets: identityWalletSelector(state),
    importedWallets: importedWalletSelector(state),
    hasIdentityEOSWallet: hasIdentityEOSWalletSelector(state),
    bridgeWalletList: bridgeWalletListSelector(state),
    activeWalletId: state.wallet.bridgeWalletId
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
      ...keyAccountActions
    }, dispatch)
  })
)

export default class SelectBridgeWallet extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('wallet_switch')
        },
        leftButtons: [
          {
            id: 'cancel',
            icon: require('resources/images/cancel_android.png'),
            text: gt('button_cancel')
          }
        ]
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  layoutProvider = new LayoutProvider(
    index => {
      return 0
    },
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 60
    }
  )

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      (nextProps.bridgeWalletList && nextProps.bridgeWalletList.length) !== prevState.bridgeWalletListCount
    ) {
      return {
        tickerCount: (nextProps.bridgeWalletList && nextProps.bridgeWalletList.length),
        dataProvider: nextProps.bridgeWalletList.length ? dataProvider.cloneWithRows(nextProps.bridgeWalletList) : dataProvider
      }
    } else {
      return null
    }
  }

  state = {
    scrollToDismissEnabled: false,
    dataProvider: this.props.bridgeWalletList.length ? dataProvider.cloneWithRows(this.props.bridgeWalletList) : dataProvider,
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    }
  }

  switchWallet = (walletId, chain) => {
    this.props.actions.setBridgeChain(chain)
    this.props.actions.setBridgeWallet(walletId)
    Navigation.dismissModal(this.props.componentId)
  }

  rowRenderer = (type, data) => {
    return (
      <WalletTableViewCell data={{ ...data, isActive: data.id === this.props.activeWalletId }} onPress={this.switchWallet.bind(this, data.id, data.chain)} />
    )
  }

  componentDidMount() {
    if (!this.props.hasIdentityEOSWallet) {
      const { identityWallets } = this.props
      const index = identityWallets.findIndex((wallet: any) => wallet.chain === 'EOS')
      const wallet = identityWallets[index]
      this.props.actions.getKeyAccount.requested(wallet)
    }
  }

  componentDidAppear() {
    this.setState({ scrollToDismissEnabled: true })
  }

  onLeftButtonClicked = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  render() {
    const { identityWallets, importedWallets, activeWalletId, intl, syncingEOSAccount, eosWallets, ethWallets, bridgeWalletList } = this.props
    const bridgeWalletListCount = bridgeWalletList.length
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    if (!bridgeWalletListCount) {
      return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#666666', fontSize: 17 }}>
              {t(this,'wallet_null')}
            </Text>
          </View>
          {/*<NavBar title={t(this,'wallet_select')} leftButtonTitle={t(this,'button_cancel')} onLeftButtonClicked={this.onLeftButtonClicked} />*/}
        </View>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <RecyclerListView
          style={{ flex: 1, backgroundColor: 'white' }}
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.rowRenderer}
        />
      </View>
    )
  }
}
