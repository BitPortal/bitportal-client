import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  Clipboard,
  ActionSheetIOS,
  TouchableNativeFeedback,
  Share
} from 'react-native'
import { activeWalletSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector } from 'selectors/balance'
import { managingWalletChildAddressSelector } from 'selectors/address'
import { activeAssetSelector } from 'selectors/asset'
import { Navigation } from 'react-native-navigation'
import QRCode from 'react-native-qrcode-svg'
import EStyleSheet from 'react-native-extended-stylesheet'
import * as transactionActions from 'actions/transaction'
// import RNShare from 'react-native-share'
import Modal from 'react-native-modal'

const styles = EStyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17
  }
})

@injectIntl

@connect(
  state => ({
    activeWallet: activeWalletSelector(state),
    activeAsset: activeAssetSelector(state),
    balance: activeWalletBalanceSelector(state),
    childAddress: managingWalletChildAddressSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
    }, dispatch)
  })
)

export default class ReceiveAsset extends Component {
  static get options() {
    return {
      topBar: {},
      sideMenu: {
        left: {
          enabled: false
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    showModal: false,
    amount: 0,
    selectedIndex: 0,
    promptAmount: '',
    showAmountPrompt: false
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'share') {
      const { activeWallet, activeAsset } = this.props
      const chain = activeWallet.chain
      const address = activeWallet.address
      const contract = activeAsset.contract
      const symbol = activeAsset.symbol

      Share.share({
        message: this.getAddressUri(!this.state.selectedIndex ? address : childAddress, this.state.amount, chain, contract, symbol)
      }).then(result => {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      });
      /* ActionSheetIOS.showShareActionSheetWithOptions({
       *   message: this.getAddressUri(address, this.state.amount, chain, contract, symbol)
       * }, () => {}, () => {})*/
    } else if (buttonId === 'cancel') {
      Navigation.dismissAllModals()
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  componentDidAppear() {
    const { activeWallet, childAddress } = this.props
    const chain = activeWallet.chain
    const address = activeWallet.address
    const hasChildAddress = childAddress && childAddress !== address

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        elevation: hasChildAddress && chain === 'BITCOIN' ? 0 : 4,
        rightButtons: [
          {
            id: 'share',
            icon: require('resources/images/share_android.png')
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

  copy = (address) => {
    this.setState({ showModal: true }, () => {
      Clipboard.setString(address)

      setTimeout(() => {
        this.setState({ showModal: false })
      }, 1000)
    })
  }

  setAmount = () => {
    this.requestAmount()
  }

  getAddressFontSize = (address) => {
    if (address.length > 40) {
      return 13
    } else if (address.length < 20) {
      return 17
    } else {
      return 15
    }
  }

  getAddressUri = (address, amount, chain, contract, symbol) => {
    const params = {}
    if (amount) params.amount = amount
    if (contract) params.contract = contract
    if (symbol) params.symbol = symbol
    const queryString = Object.keys(params).map(k => [k, params[k]].join('=')).join('&')

    if (!!queryString) {
      return `${chain.toLowerCase()}:${address}?${queryString}`
    }

    return address
  }

  changeSelectedIndex = (index) => {
    this.setState({ selectedIndex: index })
  }

  requestAmount = () => {
    this.setState({ showAmountPrompt: true, promptAmount: '' })
  }

  changeAmount = (text) => {
    this.setState({ promptAmount: text })
  }

  cancelChangeAmount = () => {
    this.setState({ showAmountPrompt: false })
  }

  submitAmount = () => {
    this.setState({ showAmountPrompt: false, amount: !!+this.state.promptAmount ? +this.state.promptAmount : 0 })
  }

  render() {
    const { intl, activeWallet, activeAsset, balance, childAddress, statusBarHeight } = this.props
    const symbol = activeAsset.symbol
    const chain = activeWallet.chain
    const available = balance && intl.formatNumber(balance.balance, { minimumFractionDigits: balance.precision, maximumFractionDigits: balance.precision })
    const address = activeWallet.address
    const hasChildAddress = childAddress && childAddress !== address
    const contract = activeAsset.contract
    const addressUri = this.getAddressUri(!this.state.selectedIndex ? address : childAddress, this.state.amount, chain, contract, symbol)
    const value1 = intl.formatMessage({ id: 'receive_btc_text_main_address' })
    const value2 = intl.formatMessage({ id: 'receive_btc_text_second_address' })

    return (
      <View style={[styles.container, { backgroundColor: 'white' }]}>
        {hasChildAddress && chain === 'BITCOIN' && <View style={{ height: 48, width: '100%', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#673AB7', elevation: 4 }}>
          <TouchableNativeFeedback onPress={this.changeSelectedIndex.bind(this, 0)} background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.3)', true)}>
            <View style={{ width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, color: 'white' }}>主地址</Text>
              {!this.state.selectedIndex && <View style={{ width: '100%', height: 2, backgroundColor: 'white', position: 'absolute', bottom: 0, left: 0 }} />}
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.changeSelectedIndex.bind(this, 1)} background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.3)', true)}>
            <View style={{ width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, color: 'white' }}>子地址</Text>
              {this.state.selectedIndex === 1 && <View style={{ width: '100%', height: 2, backgroundColor: 'white', position: 'absolute', bottom: 0, left: 0 }} />}
            </View>
          </TouchableNativeFeedback>
        </View>}
        <ScrollView
          showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, width: '100%', alignItems: 'center', padding: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 16, color: 'rgba(0,0,0,0.87)' }}>{intl.formatMessage({ id: 'receive_hint_above_qr_code' })}{+this.state.amount > 0 ? this.state.amount : ''} {symbol}</Text>
          <QRCode
            value={addressUri}
            size={200}
          />
          <Text style={{ fontSize: this.getAddressFontSize(!this.state.selectedIndex ? address : childAddress), marginTop: 16, marginBottom: 16, textAlign: 'center', color: 'rgba(0,0,0,0.87)' }}>
            {!this.state.selectedIndex ? address : childAddress}
          </Text>
          <TouchableNativeFeedback onPress={this.copy.bind(this, !this.state.selectedIndex ? address : childAddress)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)}>
            <View
              style={{
                width: '100%',
                height: 50,
                backgroundColor: '#673AB7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                elevation: 2
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 17
                }}
              >
                {intl.formatMessage({ id: 'receive_button_copy_address' })}
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.setAmount} background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10 }}>
              <Image
                source={require('resources/images/amount_android.png')}
                style={{ width: 28, height: 28, marginRight: 4 }}
              />
              <Text style={{ textAlign: 'center', color: '#673AB7', fontSize: 17 }}>{intl.formatMessage({ id: 'receive_button_setting_amount' })}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </ScrollView>
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
        onModalHide={this.onModalHide}
      >
        {this.state.showModal && <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.87)', padding: 16, borderRadius: 4, height: 48, elevation: 1, justifyContent: 'center', width: '100%' }}>
            <Text style={{ fontSize: 14, color: 'white' }}>已复制</Text>
          </View>
        </View>}
      </Modal>
      <Modal
        isVisible={this.state.showAmountPrompt}
        backdropOpacity={0.6}
        useNativeDriver
        animationIn="fadeIn"
        animationInTiming={500}
        backdropTransitionInTiming={500}
        animationOut="fadeOut"
        animationOutTiming={500}
        backdropTransitionOutTiming={500}
      >
        {(this.state.showAmountPrompt) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
          <View style={{ backgroundColor: 'white', paddingTop: 14, paddingBottom: 11, paddingHorizontal: 24, borderRadius: 2, alignItem: 'center', justifyContent: 'space-between', elevation: 14, width: '100%' }}>
            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontSize: 20, color: 'black', marginBottom: 12 }}>设置金额</Text>
              <TextInput
                style={{
                  fontSize: 16,
                  padding: 0,
                  width: '100%',
                  borderBottomWidth: 2,
                  borderColor: '#169689'
                }}
                autoFocus={true}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="numeric"
                onChangeText={this.changeAmount}
                onSubmitEditing={this.submitAmount}
              />
            </View>
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <TouchableNativeFeedback onPress={this.cancelChangeAmount} background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={{ padding: 10, borderRadius: 2, marginRight: 8 }}>
                  <Text style={{ color: '#169689', fontSize: 14 }}>取消</Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={this.submitAmount} background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={{ padding: 10, borderRadius: 2 }}>
                  <Text style={{ color: '#169689', fontSize: 14 }}>确定</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>}
      </Modal>
      </View>
    )
  }
}
