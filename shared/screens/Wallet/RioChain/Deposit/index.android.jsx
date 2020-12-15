import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  Clipboard,
  TouchableNativeFeedback,
  Share, Alert, TouchableHighlight, ActivityIndicator
} from 'react-native'

import { activeWalletSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector,activeAssetBalanceSelector } from 'selectors/balance'
import {activeAssetSelector} from 'selectors/asset'
import { activeDepositSelector } from 'selectors/deposit'
import { Navigation } from 'components/Navigation'
import QRCode from 'react-native-qrcode-svg'
import EStyleSheet from 'react-native-extended-stylesheet'
import Modal from 'react-native-modal'
import * as pepositActions from 'actions/deposit'
import { getChain,getExternalChainSymbol,getRioWithdrawChain } from 'utils/riochain'

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
    walletBalance: activeWalletBalanceSelector(state),
    assetBalance: activeAssetBalanceSelector(state),
    activeDeposit: activeDepositSelector(state),
    balance: activeWalletBalanceSelector(state),
    applyIdOnChain: state.applyIdOnChain,
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...pepositActions,
    }, dispatch)
  })
)

export default class DepositAsset extends Component {
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
    password: '',
    showPasswordPrompt: false,
  }

  onRightButton = () => {
    const hasIdOnChain = this.hasIdOnChain()
    let rightButtons = [];
    if (hasIdOnChain) {
      rightButtons = [
        {
          id: 'share',
          icon: require('resources/images/share_android.png'),
        }
      ]
    }
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons
      }
    })
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'share') {
      const { activeWallet, activeAsset } = this.props
      const chain = activeWallet.chain
      const symbol = activeAsset.symbol

      Share.share({
        message: this.getAddressUri(chain, symbol)
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
      })
    } else if (buttonId === 'cancel') {
      Navigation.dismissAllModals()
    }
  }

  startPassword = () => {
    this.setState({ showPasswordPrompt: true, password: '' })
  }

  changePassword = (text) => {
    this.setState({ password: text })
  }

  cancelChangePassword = () => {
    this.setState({ showPasswordPrompt: false })
  }

  submitPassword = () => {
    this.setState({ showPasswordPrompt: false })
    this.toApplyDepositAsset()
  }

  componentDidMount() {
    this.fetchIdOnChain()
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.applyIdOnChain.error) {
      this.onShowError()
    }
    this.onRightButton();
  }

  componentDidDisappear() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: []
      }
    })
  }
  onShowError = () => {
    const error = this.props.applyIdOnChain.error
    if (error) {
      setTimeout(() => {
        Alert.alert(
          error,
          '',
          [
            { text: t(this,'button_ok'), onPress: () =>this.props.actions.applyIdOnChain.clearError() }
          ]
        )
      }, 20)
    }
  }

  copy = (address) => {
    this.setState({ showModal: true }, () => {
      Clipboard.setString(address)

      setTimeout(() => {
        this.setState({ showModal: false })
      }, 1000)
    })
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

  getAddressUri = (chain, symbol) => {
    const chainType = getChain(symbol.toUpperCase())
    const chain_new = getRioWithdrawChain(chainType) || ''
    const { activeDeposit, } = this.props
    const {depositAddress = {}} =  activeDeposit || {}
    const address = depositAddress[symbol]
    const params = {}
    params.contract = this.getContract()
    if (symbol) params.symbol = symbol
    const queryString = Object.keys(params).map(k => [k, params[k]].join('=')).join('&')

    if (!!queryString) {
      return `${chain_new.toLowerCase()}:${address}?${queryString}`
    }

    return address
  }
  toApplyDepositAsset = () => {
    const { intl, activeWallet, assetBalance} = this.props
    const {password} = this.state
    const {source, address,id} = activeWallet || {}
    const {symbol} = assetBalance
    const assetId = this.getContract();
    const chainType = getChain(symbol.toUpperCase())
    const params = {
      assetId,
      source,
      address,
      id,
      symbol,
      chainType,
    }
    this.props.actions.applyIdOnChain.requested({...params,password})
  }

  fetchIdOnChain = () => {

    const { idOnChain } = this.props.activeDeposit
    if (typeof  idOnChain !== 'number') {
      return
    }
    const { id, address } = this.props.activeWallet
    const assetId = this.getContract();
    const {symbol} = this.props.assetBalance
    const chainType = getChain(symbol.toUpperCase())
    this.props.actions.getDepositAddressOnChain.requested({ id, address,chainType, assetId, symbol })

  }

  showTip = () => {
    Alert.alert(
      t(this,'hint'),
      t(this,'asset_deposit_message_4'),
      [
        { text:  t(this,'button_ok'), onPress: () => console.log('OK Pressed') }
      ]
    )
  }

  getContract = () => {
    const {assetBalance,walletBalance } = this.props
    const wContract = walletBalance ? walletBalance.contract : undefined;
    const aContract = assetBalance ? assetBalance.contract : undefined;
    const assetId = typeof aContract === 'number' ? aContract : wContract;
    return assetId;
  }
  hasIdOnChain = () => {
    const { activeDeposit,assetBalance } = this.props
    const {depositAddress = {},idOnChain} =  activeDeposit || {}
    const symbol = assetBalance.symbol
    const hasIdOnChain = typeof idOnChain === 'number' && depositAddress[symbol]
    return hasIdOnChain;
  }


  render() {
    const { intl,assetBalance,activeDeposit, activeWallet } = this.props
    const {depositAddress = {}} =  activeDeposit || {}
    const symbol = assetBalance.symbol
    const chainType = getChain(symbol.toUpperCase())
    const chain = activeWallet.chain
    const addressUri = this.getAddressUri(chain, symbol)
    const address = depositAddress[symbol] || ''
    const hasIdOnChain = this.hasIdOnChain()
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)
    const externalSymbel = getExternalChainSymbol(symbol)


    return (
      <View style={[styles.container, { backgroundColor: 'white' }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View style={{ flex: 1, width: '100%', alignItems: 'center', padding: 16 }}>
            {
              hasIdOnChain ?
                [
                  <Text style={{
                    fontSize: 16,
                    marginBottom: 16,
                    color: 'rgba(0,0,0,0.87)'
                  }}>{intl.formatMessage({ id: 'receive_hint_above_qr_code' })}{+this.state.amount > 0 ? this.state.amount : ''} {externalSymbel}</Text>,
                  <QRCode
                    value={addressUri}
                    size={200}
                  />,
                  <Text style={{
                    fontSize: this.getAddressFontSize(address),
                    marginTop: 16,
                    marginBottom: 16,
                    textAlign: 'center',
                    color: 'rgba(0,0,0,0.87)'
                  }}>
                    {address}
                  </Text>,
                  <TouchableNativeFeedback onPress={this.copy.bind(this, address)}
                                           background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)}>
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
                ]: undefined
            }

            <Text style={{alignSelf:'flex-start', color:isDarkMode ? 'white':'black',marginTop:20}}>·{t(this,'asset_deposit_message_1',{symbol:chainType})}</Text>
            <View style={{flexGrow:1,alignSelf:'flex-start', flexDirection:'row',alignItems:'center',marginRight:16,marginBottom:10}}>
              <Text style={{color:isDarkMode ? 'white':'black'}}>·{t(this,'asset_deposit_message_2',{symbol:chainType})}</Text>
              <TouchableNativeFeedback onPress={this.showTip}>
                <Image
                  source={require('resources/images/Info.png')}
                  style={{ width: 28, height: 28, marginRight: 4 }}
                />
              </TouchableNativeFeedback>
            </View>
            <ApplyButton onPress={this.startPassword.bind(this)}
                         applyIdOnChainLoading={this.props.applyIdOnChain.loading}
                         hasIdOnChain={hasIdOnChain}/>
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
              <Text style={{ fontSize: 14, color: 'white' }}>{t(this,'copied')}</Text>
            </View>
          </View>}
        </Modal>
        <Modal
          isVisible={this.state.showPasswordPrompt}
          backdropOpacity={0.6}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={500}
          backdropTransitionInTiming={500}
          animationOut="fadeOut"
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
        >
          {(this.state.showPasswordPrompt) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
            <View style={{ backgroundColor: 'white', paddingTop: 14, paddingBottom: 11, paddingHorizontal: 24, borderRadius: 2, alignItem: 'center', justifyContent: 'space-between', elevation: 14, width: '100%' }}>
              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20, color: 'black', marginBottom: 12 }}>{intl.formatMessage({ id: 'alert_input_wallet_password' })}</Text>
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
                  onChangeText={this.changePassword}
                  onSubmitEditing={this.submitPassword}
                />
              </View>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TouchableNativeFeedback onPress={this.cancelChangePassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2, marginRight: 8 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>{t(this,'button_cancel')}</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.submitPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>{t(this,'button_ok')}</Text>
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

const AcIndicator = ({show}) => show ?  <ActivityIndicator size="small" color="#FFFFFF" style={{marginLeft:5}}/> : null
const Button = ({onPress,children,disabled}) => {
  return (
    <TouchableNativeFeedback
      onPress={onPress}
    >
      <View style={{
        width: '100%',
        height: 50,
        backgroundColor: '#673AB7',
        alignItems: 'center',
        flexDirection:'row',
        justifyContent: 'center',
        borderRadius: 10
      }}>
        {children}
      </View>
    </TouchableNativeFeedback>
  )
}

const  ApplyButton = ({hasIdOnChain,applyIdOnChainLoading,onPress}) => {
  if (!hasIdOnChain) {
    return  (
      <Button onPress={!applyIdOnChainLoading&&onPress}
              disabled={!applyIdOnChainLoading}>
        <Text style={{textAlign: 'center', color: 'white', fontSize: 17 }}>{t(this,'asset_deposit_apply_address')}</Text>
        {
          applyIdOnChainLoading&& <AcIndicator show={applyIdOnChainLoading}/>
        }
      </Button>
    )
  }
  return  null
}

