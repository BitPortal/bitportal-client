import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator, Alert, TouchableNativeFeedback, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import Modal from 'react-native-modal'
import { managingWalletSelector } from 'selectors/wallet'
import { managingWalletAddressSelector, managingWalletChildAddressSelector } from 'selectors/address'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import FastImage from 'react-native-fast-image'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as addressActions from 'actions/address'

const dataProvider = new DataProvider((r1, r2) => r1.address !== r2.address)

@connect(
  state => ({
    scanHDAddresses: state.scanHDAddresses,
    wallet: managingWalletSelector(state),
    addresses: managingWalletAddressSelector(state),
    childAddress: managingWalletChildAddressSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
      ...addressActions
    }, dispatch)
  })
)

export default class SwitchBTCAddress extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'BTC钱包地址'
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

  static getDerivedStateFromProps(nextProps, prevState) {
    const { wallet, addresses, childAddress } = nextProps
    const address = childAddress || (wallet && wallet.address)

    if (addresses) {
      return { dataProvider: dataProvider.cloneWithRows(addresses), extendedState: { address } }
    } else {
      return { extendedState: { address } }
    }
  }

  subscription = Navigation.events().bindComponent(this)

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
      dim.height = 72
    }
  )

  selectBTCAddress = (address) => {
    const { wallet } = this.props

    if (wallet) {
      this.props.actions.updateChildAddress({ id: `${wallet.chain}/${wallet.address}`, address })
    }
  }

  componentDidMount() {
    const { wallet, addresses } = this.props

    if (!addresses && wallet) {
      this.props.actions.scanHDAddresses.requested(wallet)
    }
  }

  renderItem = (type, data) => {
    return (
      <TouchableNativeFeedback onPress={this.selectBTCAddress.bind(this, data.address)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
        <View style={{ paddingHorizontal: 16, height: 72, alignItems: 'center', flexDirection: 'row', borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
          <View>
            <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{data.address}</Text>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>{`xpub ${data.change}/${data.index}`}</Text>
          </View>
          {this.state.extendedState.address && this.state.extendedState.address === data.address && <FastImage source={require('resources/images/circle_check_android.png')} style={{ height: 24, width: 24, position: 'absolute', right: 16 }} />}
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const { wallet, addresses, childAddress } = this.props
    const address = childAddress || (wallet && wallet.address)

    if (!addresses) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator size="small" color="#000000" />
            <Text style={{ fontSize: 17, marginLeft: 5 }}>扫描地址中...</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ width: '100%', padding: 16, backgroundColor: '#EEEEEE', height: 72, borderBottomWidth: 0, borderColor: 'rgba(0,0,0,0.12)' }}>
          <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.54)' }}>你可以使用不同的子地址用于收款，以保护你的隐私。选中的子地址将会显示在收款界面。</Text>
        </View>
        <RecyclerListView
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.renderItem}
          renderAheadOffset={48 * 10}
          extendedState={this.state.extendedState}
        />
      </View>
    )
  }
}
