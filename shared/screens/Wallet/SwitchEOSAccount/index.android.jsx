import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator, Alert, Dimensions, TouchableNativeFeedback, Image } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import Modal from 'react-native-modal'
import { identityEOSWalletSelector, managingWalletSelector } from 'selectors/wallet'
import { managingWalletKeyAccountSelector } from 'selectors/keyAccount'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as keyAccountActions from 'actions/keyAccount'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'

const dataProvider = new DataProvider((r1, r2) => r1.key !== r2.key)

@connect(
  state => ({
    wallet: managingWalletSelector(state),
    keyAccounts: managingWalletKeyAccountSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
      ...keyAccountActions
    }, dispatch)
  })
)

export default class SwitchEOSAccount extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '切换EOS帐户'
        },
        backButton: {
          title: '返回'
        },
        largeTitle: {
          visible: false
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  static getDerivedStateFromProps(nextProps, prevState) {
    const { wallet, keyAccounts } = nextProps
    const address = wallet && wallet.address


    const accounts = keyAccounts.map(account => ({
      key: account.accountName,
      accountName: account.accountName,
      permissions: account.permissions.join(' • ')
    }))

    if (accounts) {
      return { dataProvider: dataProvider.cloneWithRows(accounts), extendedState: { address } }
    } else {
      return { extendedState: { address } }
    }
  }

  state = {
    dataProvider: dataProvider.cloneWithRows([]),
    extendedState: { address: null }
  }

  layoutProvider = new LayoutProvider(
    index => {
      return 0
    },
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 60
    }
  )

  selectEOSAccount = (accountName) => {
    const { wallet } = this.props
    const address = wallet && wallet.address
    const id = wallet && wallet.id

    if (accountName !== address && id) {
      this.props.actions.setEOSWalletAddress.requested({ address: accountName, id, oldAddress: address })
    }
  }

  componentDidMount() {
    this.props.actions.getKeyAccount.requested(this.props.wallet)
  }

  renderItem = (type, data) => {
    return (
      <TouchableNativeFeedback onPress={this.selectEOSAccount.bind(this, data.accountName)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, width: '100%' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{data.accountName}</Text>
              <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.54)' }}>{data.permissions}</Text>
            </View>
          </View>
          {this.state.extendedState.address && this.state.extendedState.address === data.accountName && <Image source={require('resources/images/circle_check_android.png')} style={{ height: 24, width: 24, position: 'absolute', right: 16 }} />}
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <RecyclerListView
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.renderItem}
          renderAheadOffset={60 * 10}
          extendedState={this.state.extendedState}
        />
      </View>
    )
  }
}
