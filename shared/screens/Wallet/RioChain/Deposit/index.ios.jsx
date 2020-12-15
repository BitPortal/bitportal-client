import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Clipboard,
  ActionSheetIOS,
  Image,
  SafeAreaView, TouchableHighlight, ActivityIndicator
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { activeWalletSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector,activeAssetBalanceSelector } from 'selectors/balance'
import {activeAssetSelector} from 'selectors/asset'
import { activeDepositSelector } from 'selectors/deposit'
import { Navigation } from 'components/Navigation'
import QRCode from 'react-native-qrcode-svg'
import EStyleSheet from 'react-native-extended-stylesheet'
import Sound from 'react-native-sound'
import Modal from 'react-native-modal'
import { DarkModeContext } from 'utils/darkMode'
import * as pepositActions from 'actions/deposit'
import { getChain,getExternalChainSymbol,getRioWithdrawChain } from 'utils/riochain'


Sound.setCategory('Playback')
const copySound = new Sound('copy.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error)
    return
  }

  console.log(`duration in seconds: ${copySound.getDuration()}number of channels: ${copySound.getNumberOfChannels()}`)
})

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
    applyIdOnChain: state.applyIdOnChain,
    activeWallet: activeWalletSelector(state),
    walletBalance: activeWalletBalanceSelector(state),
    assetBalance: activeAssetBalanceSelector(state),
    activeDeposit: activeDepositSelector(state),
    activeAsset: activeAssetSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...pepositActions,
    }, dispatch)
  })
)

export default class Deposit extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        },
        backButton: {
          title: gt('button_back')
        },
        rightButtons: [
          {
            id: 'share',
            icon: require('resources/images/share.png')
          }
        ]
      },
      bottomTabs: {
        visible: false
      }
    }
  }
  static contextType = DarkModeContext
  subscription = Navigation.events().bindComponent(this)

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.applyIdOnChain.loading !== prevState.applyIdOnChainLoading
      || nextProps.applyIdOnChain.error !== prevState.applyIdOnChainError
    ) {
      return {
        applyIdOnChainLoading: nextProps.applyIdOnChain.loading,
        applyIdOnChainError: nextProps.applyIdOnChain.error
      }
    } else {
      return null
    }
  }

  state = {
    showModal: false,
    showModalContent: false,
    applyIdOnChainLoading: false,
    applyIdOnChainError: null
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'share') {
      const { activeWallet, assetBalance } = this.props
      const chain = activeWallet.chain
      const symbol = assetBalance.symbol

      ActionSheetIOS.showShareActionSheetWithOptions({
        message: this.getAddressUri(chain, symbol)
      }, () => {}, () => {})
    } else if (buttonId === 'cancel') {
      Navigation.dismissAllModals()
    }
  }

  componentDidMount() {
    this.fetchIdOnChain()
    this.props.actions.applyIdOnChain.succeeded()
    this.onRightButton()
  }

  componentWillUnmount() {

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.applyIdOnChainError) {
      this.onShowError()
    }
    this.onRightButton();
  }

  onRightButton = () => {
    const hasIdOnChain = this.hasIdOnChain()
    let rightButtons = [];
    if (hasIdOnChain) {
      rightButtons = [
        {
          id: 'share',
          icon: require('resources/images/share.png'),
        }
      ]
    }
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons
      }
    })
  }

  getContract = () => {
    const {assetBalance,walletBalance } = this.props
    const wContract = walletBalance ? walletBalance.contract : undefined;
    const aContract = assetBalance ? assetBalance.contract : undefined;
    const assetId = typeof aContract === 'number' ? aContract : wContract;
    return assetId;
  }

  toApplyDepositAsset = () => {
    const { intl, activeWallet, assetBalance} = this.props
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
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: t(this,'button_cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
          onPress: password => this.props.actions.applyIdOnChain.requested({...params,password})
        }
      ],
      'secure-text'
    )
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


  copy = (address) => {
    this.setState({ showModal: true, showModalContent: true }, () => {
      Clipboard.setString(address)
      copySound.play((success) => {
        if (success) {
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
          copySound.reset()
        }
      })

      setTimeout(() => {
        this.setState({ showModal: false }, () => {
          this.setState({ showModalContent: false })
        })
      }, 1000)
    })
  }

  getAddressFontSize = (address) => {
    if (typeof address !== 'string') {
      return  15
    }
    if (address.length > 40) {
      return 13
    } else if (address.length < 20) {
      return 17
    } else {
      return 15
    }
  }

  getAddressUri = (chain, symbol) => {
    const params = {}
    const chainType = getChain(symbol.toUpperCase())
    const chain_new = getRioWithdrawChain(chainType) || ''
    const { activeDeposit, } = this.props
    const {depositAddress = {}} =  activeDeposit || {}
    const address = depositAddress[symbol]
    params.contract = this.getContract()
    if (symbol) params.symbol = getChain(symbol.toUpperCase())
    const queryString = Object.keys(params).map(k => [k, params[k]].join('=')).join('&')

    if (!!queryString) {
      return `${chain_new.toLowerCase()}:${address}?${queryString}`
    }
    return `${chain_new.toLowerCase()}:${address}`
  }

  onShowError = () => {
    const error = this.state.applyIdOnChainError
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
  hasIdOnChain = () => {
    const { activeDeposit,assetBalance } = this.props
    const {depositAddress = {},idOnChain} =  activeDeposit || {}
    const symbol = assetBalance.symbol
    const hasIdOnChain = typeof idOnChain === 'number' && depositAddress[symbol]
    return hasIdOnChain;
  }

  render() {
    const { intl, activeDeposit,assetBalance,activeWallet } = this.props
    const {depositAddress = {}} =  activeDeposit || {}
    const symbol = assetBalance.symbol
    const hasIdOnChain = this.hasIdOnChain()
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)
    const externalSymbel = getExternalChainSymbol(symbol)
    const chainType = getChain(symbol.toUpperCase())
    const chain = activeWallet.chain
    const addressUri = this.getAddressUri(chain, symbol)

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : 'white' }}>
        <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, width: '100%', alignItems: 'center', padding: 16 }}>
              {
                hasIdOnChain && [
                  <Text style={{ fontSize: 17, marginBottom: 16, color: isDarkMode ? 'white' : 'black' }}>{t(this,'asset_deposit_address',{symbol:externalSymbel})}</Text>,
                  <View style={{width:'100%',height:200,alignItems:'center'}}>
                    <QRCode
                      value={addressUri}
                      size={200}
                      color={isDarkMode ? 'white' : 'black'}
                      backgroundColor={isDarkMode ? 'black' : 'white'}
                    />
                  </View>,
                  <Text style={{ fontSize: this.getAddressFontSize(depositAddress[symbol]), marginTop: 16, marginBottom: 16, textAlign: 'center', color: isDarkMode ? 'white' : 'black' }}>
                    {depositAddress[symbol]}
                  </Text>,
                  <TouchableOpacity
                    underlayColor="#007AFF"
                    activeOpacity={0.8}
                    style={{
                      width: '100%',
                      height: 50,
                      backgroundColor: '#007AFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10
                    }}
                    onPress={this.copy.bind(this, depositAddress[symbol])}
                  >
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 17 }}>{intl.formatMessage({ id: 'asset_deposit_copy' })}</Text>
                  </TouchableOpacity>
                ]
              }
              <Text style={{alignSelf:'flex-start', color:isDarkMode ? 'white':'black',marginTop:20}}>·{t(this,'asset_deposit_message_1',{symbol:chainType})}</Text>
              <View style={{flexGrow:1,alignSelf:'flex-start', flexDirection:'row',alignItems:'center'}}>
                <Text style={{color:isDarkMode ? 'white':'black'}}>·{t(this,'asset_deposit_message_2',{symbol:chainType})}</Text>
                <TouchableHighlight
                  underlayColor={isDarkMode ? 'black' : 'white'}
                  activeOpacity={0.42}
                  onPress={this.showTip}
                  style={{ width: 28, height: 28 }}
                >
                  <FastImage
                    source={require('resources/images/Info.png')}
                    style={{ width: 28, height: 28, marginLeft: 4 }}
                  />
                </TouchableHighlight>
              </View>
              <ApplyButton onPress={this.toApplyDepositAsset.bind(this)}
                           disabled={this.state.applyIdOnChainLoading}
                           applyIdOnChainLoading={this.state.applyIdOnChainLoading}
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
          >
            {this.state.showModalContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{intl.formatMessage({ id: 'general_toast_text_copied' })}</Text>
              </View>
            </View>}
          </Modal>
        </View>
      </SafeAreaView>
    )
  }
}

const AcIndicator = ({show}) => show ?  <ActivityIndicator size="small" color="#FFFFFF" style={{marginLeft:5}}/> : null
const Button = ({onPress,children,disabled}) => {
  return (
    <TouchableHighlight
      underlayColor="#007AFF"
      activeOpacity={0.8}
      disabled={!disabled}
      style={{
        marginTop:15,
        width: '100%',
        height: 50,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        flexDirection:'row',
        justifyContent: 'center',
        borderRadius: 10
      }}
      onPress={onPress}
    >
      <View style={{flexDirection:'row'}}>
        {children}
      </View>
    </TouchableHighlight>
  )
}

const  ApplyButton = ({hasIdOnChain,applyIdOnChainLoading,onPress}) => {
  if (!hasIdOnChain) {
    return  (
      <Button onPress={onPress}
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
