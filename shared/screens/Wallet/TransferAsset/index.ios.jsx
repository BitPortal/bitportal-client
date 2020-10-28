import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  LayoutAnimation,
  ActionSheetIOS,
  Switch,
  Animated,
  Easing,
  SafeAreaView,
  Platform
} from 'react-native'
import FastImage from 'react-native-fast-image'
import TableView from 'components/TableView'
import { transferWalletSelector } from 'selectors/wallet'
import { transferWalletFeeSelector } from 'selectors/fee'
import { transferWalletsContactsSelector, selectedContactSelector } from 'selectors/contact'
import { transferWalletBalanceSelector, transferAssetBalanceSelector } from 'selectors/balance'
import { transferAssetSelector } from 'selectors/asset'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import * as transactionActions from 'actions/transaction'
import * as balanceActions from 'actions/balance'
import * as contactActions from 'actions/contact'
import * as feeActions from 'actions/fee'
import * as walletActions from 'actions/wallet'
import Modal from 'react-native-modal'
import Slider from '@react-native-community/slider'
import { assetIcons, walletIcons } from 'resources/images'
import { DarkModeContext } from 'utils/darkMode'

const { Section, Item } = TableView

const tabHeight = (() => {
  const isIphoneX = () => {
    let dimensions
    if (Platform.OS !== 'ios') {
      return false
    }
    if (Platform.isPad || Platform.isTVOS) {
      return false
    }
    dimensions = Dimensions.get('window')
    if (dimensions.height === 812 || dimensions.width === 812) { // Checks for iPhone X in portrait or landscape
      return true
    }
    if (dimensions.height === 896 || dimensions.width === 896) {
      return true
    }
    return false
  }

  if (isIphoneX()) {
    return 32 // iPhone X
  } else {
    return 16 // Other iPhones
  }
})()

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
  },
  textFiled: {
    height: '100%',
    fontSize: 20,
    width: '100% - 80'
  },
  messageFiled: {
    borderRadius: 17,
    borderWidth: 0.5,
    fontSize: 17,
    borderColor: '#F3F3F3',
    width: '100%',
    height: 72,
    paddingLeft: 14,
    paddingRight: 20
  },
  amountFiled: {
    height: '100%',
    fontSize: 50,
    fontWeight: '500',
    width: '100% - 52'
  },
  smTextFiled: {
    height: '100%',
    fontSize: 20,
    width: '100% - 52'
  },
})

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return '密码错误'
    case 'Amount less than minimum':
      return '金额小于最低转账额度'
    case 'Select utxo failed':
    case 'You don\'t have enough balance':
      return '余额不足'
    case 'Returned error: insufficient funds for gas * price + value':
      return '余额不足以支付手续费'
    case 'EOS System Error':
      return 'EOS系统错误'
    case 'request timeout':
      return '请求超时，请检查区块链浏览器以确定交易是否发出！'
    default:
      return `转账失败 ${message.toString()}`
  }
}

export const errorDetail = (error) => {
  if (!error) { return null }

  const detail = typeof error === 'object' ? error.detail : ''

  return detail
}

formatAddress = (address) => {
  if (address && address.length > 20) {
    return `${address.slice(0, 10)}....${address.slice(-10)}`
  } else {
    return address
  }
}

const AddressField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  fieldName,
  placeholder,
  secureTextEntry,
  separator,
  change,
  showClearButton,
  showContact,
  selectContact,
  clearContact,
  contact,
  autoFocus,
  showMemo,
  isDarkMode
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: showContact ? 64 : 42, paddingLeft: 16, paddingRight: 16, flexDirection: 'row', backgroundColor: isDarkMode ? 'black' : '#F7F7F7' }}>
    {!showContact && <TextInput
                       style={[styles.textFiled, { color: isDarkMode ? 'white' : 'black'}]}
                       autoCorrect={false}
                       autoFocus={autoFocus}
                       autoCapitalize="none"
                       placeholder={placeholder}
                       onChangeText={onChange}
                       keyboardType="default"
                       secureTextEntry={secureTextEntry}
                       {...restInput}
    />}
    {!!showContact && (
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ width: 40, height: 40, marginRight: 16 }}>
          <FastImage
            source={require('resources/images/Userpic2.png')}
            style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
          />
          <View style={{ height: 34, width: 34, borderRadius: 17, position: 'absolute', right: -15, top: -15, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableHighlight underlayColor={isDarkMode ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0)'} style={{ width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 5 }} activeOpacity={0.8} onPress={clearContact}>
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: isDarkMode ? 'black' : 'white' }}>
                <FastImage
                  source={require('resources/images/remove_red.png')}
                  style={{ width: 18, height: 18 }}
                />
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <View>
          <Text style={{ fontSize: 17, color: isDarkMode ? 'white' : 'black' }} lineOfNumebrs={1}>{contact.name}</Text>
          <Text style={{ fontSize: 15, color: isDarkMode ? 'rgba(255,255,255,0.48)' : 'rgba(0,0,0,0.48)', marginTop: 2 }} lineOfNumebrs={1}>{formatAddress(contact.address)}</Text>
        </View>
      </View>
    )
    }
    <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 30, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor={isDarkMode ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0)'} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={selectContact}>
        <FastImage
          source={require('resources/images/select_address.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableHighlight>
    </View>
    {!showContact && showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 50, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor={isDarkMode ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0)'} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
    {separator && showMemo && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 16, left: showContact ? 72 : 16, backgroundColor: '#C8C7CC' }} />}
  </View>
)

const MessageField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  fieldName,
  placeholder,
  secureTextEntry,
  change,
  showClearButton,
  showDeleteButton,
  showMemo,
  removeOPReturn,
  isDarkMode
}) => (
  <View style={{ width: '100%', alignItems: 'flex-start', height: showMemo ? 104 : 10, paddingLeft: 16, paddingRight: 16, paddingTop: showMemo ? 16 : 0, flexDirection: 'row', backgroundColor: isDarkMode ? 'black' : '#F7F7F7', borderBottomWidth: 0.5, borderBottomColor: '#C8C7CC' }}>
    {showMemo && <TextInput
                   style={[styles.messageFiled, { color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? 'black' : 'white' }]}
                   autoCorrect={false}
                   autoCapitalize="none"
                   placeholder={placeholder}
                   onChangeText={onChange}
                   keyboardType="default"
                   multiline={true}
                   placeholderTextColor={isDarkMode ? 'white' : 'black'}
                   secureTextEntry={secureTextEntry}
                   {...restInput}
    />}
    {showMemo && showClearButton && active && <View style={{ height: 30, position: 'absolute', right: 22, bottom: 14, width: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor={isDarkMode ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0)'} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
    {showDeleteButton && <View style={{ height: 30 * 0.8, position: 'absolute', right: 16, top: 20, width: 30 * 0.8, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 28 * 0.8, height: 30 * 0.8, marginRight: 8 }} onPress={removeOPReturn}>
        <FastImage
          source={require('resources/images/remove_red.png')}
          style={{ width: 28 * 0.8, height: 30 * 0.8 }}
        />
      </TouchableHighlight>
    </View>}
  </View>
)

const AmountField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  fieldName,
  placeholder,
  secureTextEntry,
  separator,
  change,
  valueLength,
  showClearButton,
  isDarkMode
}) => (
  <View style={{ width: '100%' }}>
    <View style={{ width: '100%', alignItems: 'flex-start', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <Text style={{ fontSize: 15, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', marginTop: 20 }}>{label}</Text>
    </View>
    <View style={{ width: '100%', alignItems: 'center', height: 72, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <TextInput
        style={[styles.amountFiled, (!!valueLength && valueLength > 10) ? { fontSize: 40, color: isDarkMode ? 'white' : 'black' } : { color: isDarkMode ? 'white' : 'black' }]}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        onChangeText={onChange}
        keyboardType="numeric"
        secureTextEntry={secureTextEntry}
        {...restInput}
      />
      {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableHighlight underlayColor={isDarkMode ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0)'} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
          <FastImage
            source={require('resources/images/clear.png')}
            style={{ width: 14, height: 14 }}
          />
        </TouchableHighlight>
      </View>}
      {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 16, left: 16, backgroundColor: '#C8C7CC' }} />}
    </View>
  </View>
)

const TextField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  fieldName,
  placeholder,
  secureTextEntry,
  separator,
  change,
  valueLength,
  showClearButton,
  isDarkMode
}) => (
  <View style={{ width: '100%' }}>
    <View style={{ width: '100%', alignItems: 'center', height: 40, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <TextInput
        style={[styles.smTextFiled, { color: isDarkMode ? 'white' : 'black'}]}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        {...restInput}
      />
      {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableHighlight underlayColor={isDarkMode ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0)'} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
          <FastImage
            source={require('resources/images/clear.png')}
            style={{ width: 14, height: 14 }}
          />
        </TouchableHighlight>
      </View>}
      {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 16, left: 16, backgroundColor: '#C8C7CC' }} />}
    </View>
  </View>
)

const CardField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  address,
  placeholder,
  available,
  symbol,
  chain,
  iconUrl,
  contract,
  separator,
  isDarkMode
}) => (
  <View style={{ width: '100%' }}>
    <View style={{ width: '100%', alignItems: 'flex-start', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <Text style={{ fontSize: 15, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', marginTop: 20 }}>{label}</Text>
    </View>
    <View style={{ width: '100%', alignItems: 'center', height: 72, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      {!!chain && !contract &&  <FastImage source={assetIcons[chain.toLowerCase()]} style={{ width: 40, height: 40, marginRight: 16, borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white' }} />}
      {!!contract && <View style={{ width: 41, height: 41, marginRight: 16 }}>
        <View style={{ width: 40, height: 40, borderWidth: 0, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white', borderRadius: 20 }}>
          <View style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#B9C1CF' }}>
            <Text style={{ fontWeight: '500', fontSize: 20, color: isDarkMode ? 'black' : 'white', paddingLeft: 1.6 }}>{symbol.slice(0, 1)}</Text>
          </View>
          <FastImage
            source={{ uri: iconUrl }}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: iconUrl ? 'white' : 'rgba(0,0,0,0)', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
          />
        </View>
        <FastImage source={assetIcons[chain.toLowerCase()]} style={{ position: 'absolute', right: -4, bottom: 0, width: 16, height: 16, borderRadius: 8, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white' }} />
      </View>}
      <View>
        <Text style={{ fontSize: 17, color: isDarkMode ? 'white' : 'black' }}>{formatAddress(address)}</Text>
        <Text style={{ fontSize: 15, color: isDarkMode ? 'rgba(255,255,255,0.48)' : 'rgba(0,0,0,0.48)', marginTop: 4 }}>{available} {symbol}</Text>
      </View>
    </View>
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 16, left: 72, backgroundColor: '#C8C7CC' }} />}
  </View>
)

const warn = (values, props) => {
  const warnings = {}
  /* const { transferAsset, assetBalance, walletBalance } = props
   * const balance = (transferAsset && transferAsset.contract) ? assetBalance : walletBalance
   * const available = balance && balance.balance */

  if (!values.toAddress) {
    warnings.toAddress = '请输入转账地址'
  }

  if (!values.amount) {
    warnings.amount = '请输入金额'
  } else if (isNaN(values.amount) || +values.amount <= 0) {
    warnings.amount = '请输入正确的金额'
  } /* else if (!available || +values.amount > +available) {
     * warnings.amount = '余额不足'
       } */

  return warnings
}

const shouldError = () => true

@injectIntl

@reduxForm({ form: 'transferAssetForm', shouldError, warn })

@connect(
  state => ({
    transfer: state.transfer,
    formSyncWarnings: getFormSyncWarnings('transferAssetForm')(state),
    formValues: getFormValues('transferAssetForm')(state),
    transferAsset: transferAssetSelector(state),
    transferWallet: transferWalletSelector(state),
    walletBalance: transferWalletBalanceSelector(state),
    assetBalance: transferAssetBalanceSelector(state),
    contacts: transferWalletsContactsSelector(state),
    selectedContact: selectedContactSelector(state),
    fee: transferWalletFeeSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions,
      ...walletActions,
      ...balanceActions,
      ...contactActions,
      ...feeActions
    }, dispatch)
  })
)

export default class TransferAsset extends Component {
  static contextType = DarkModeContext

  static get options() {
    return {
      topBar: {
        noBorder: true,
        backButton: {
          title: '返回'
        },
        rightButtons: [
          {
            id: 'scan',
            icon: require('resources/images/scan2_right.png')
          }
        ]
      },
      bottomTabs: {
        visible: false
      }
    }
  }
  subscription = Navigation.events().bindComponent(this)

  state = {
    selectContact: false,
    showSelectContact: false,
    selectedContactName: null,
    selectedContactAddress: null,
    selectedContactMemo: null,
    autoFocusToAddress: false,
    showOPReturn: false,
    customFee: false,
    spinValue: new Animated.Value(0),
    fastestBTCFee: 45,
    halfHourBTCFee: 35,
    hourBTCFee: 20,
    feeRate: 0,
    ethGasLimit: 60000,
    ethGasPrice: 0,
    useGasPrice: 0,
    initialGwei: 0,
    initialFeeRate: 0
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      // Keyboard.dismiss()
      // Navigation.dismissAllModals()
      Navigation.dismissModal(this.props.componentId)
    } else if (buttonId === 'scan') {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.Camera',
              passProps: { from: 'transfer', form: 'transferAssetForm', field: 'toAddress', chain: this.props.transferWallet.chain, symbol: this.props.transferWallet.symbol }
            }
          }]
        }
      })
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      (nextProps.selectedContact && nextProps.selectedContact.name) !== prevState.selectedContactName
      || (nextProps.selectedContact && nextProps.selectedContact.address) !== prevState.selectedContactAddress
      || (nextProps.selectedContact && nextProps.selectedContact.memo) !== prevState.selectedContactMemo
      || (nextProps.fee && nextProps.fee.fastestFee) !== prevState.fastestBTCFee
      || (nextProps.fee && nextProps.fee.halfHourFee) !== prevState.halfHourBTCFee
      || (nextProps.fee && nextProps.fee.hourFee) !== prevState.hourBTCFee
      || (nextProps.fee && nextProps.fee.gasPrice) !== prevState.ethGasPrice
    ) {
      LayoutAnimation.easeInEaseOut()

      return {
        selectedContactName: (nextProps.selectedContact && nextProps.selectedContact.name),
        selectedContactAddress: (nextProps.selectedContact && nextProps.selectedContact.address),
        selectedContactMemo: (nextProps.selectedContact && nextProps.selectedContact.memo),
        fastestBTCFee: (nextProps.fee && nextProps.fee.fastestFee),
        halfHourBTCFee: (nextProps.fee && nextProps.fee.halfHourFee),
        hourBTCFee: (nextProps.fee && nextProps.fee.hourFee),
        ethGasPrice: (nextProps.fee && nextProps.fee.gasPrice)
      }
    } else {
      return null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showOPReturn !== this.state.showOPReturn || prevState.customFee !== this.state.customFee) {
      LayoutAnimation.easeInEaseOut()
    }
  }

  componentWillUnmount() {
    this.props.reset()
  }

  submit = (data) => {
    const { intl, transferWallet, formSyncWarnings, transferAsset, assetBalance, walletBalance } = this.props
    const balance = (transferAsset && transferAsset.contract) ? assetBalance : walletBalance

    if (typeof formSyncWarnings === 'object') {
      const warning = formSyncWarnings.toAddress || formSyncWarnings.amount
      if (warning) {
        Alert.alert(
          warning,
          '',
          [
            { text: intl.formatMessage({ id: 'alert_button_confirm' }), onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }
    }
    // Keyboard.dismiss()

    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: intl.formatMessage({ id: 'alert_button_cancel' }),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
          onPress: password => this.props.actions.transfer.requested({
            ...data,
            password,
            fromAddress: transferWallet.address,
            chain: transferWallet.chain,
            id: transferWallet.id,
            feeRate: +this.state.feeRate || +this.state.initialFeeRate || this.state.fastestBTCFee || 45,
            symbol: transferAsset.symbol,
            precision: transferAsset.precision,
            decimals: transferAsset.decimals,
            contract: transferAsset.contract,
            componentId: this.props.componentId,
            memo: data.memo || (this.props.selectedContact && this.props.selectedContact.memo),
            gasLimit: this.state.ethGasLimit,
            gasPrice: +this.state.useGasPrice || +this.state.initialGwei || this.state.ethGasPrice || 4.00
          })
        }
      ],
      'secure-text'
    )
  }

  componentDidAppear() {
    if (this.props.selectedContact && this.props.selectedContact.address) {
      this.props.change('toAddress', this.props.selectedContact.address)
    }

    this.props.actions.getBalance.requested(this.props.transferWallet)
  }

  componentWillUnmount() {
    this.props.actions.setSelectedContact(null)
  }

  componentDidMount() {
    this.setState({ autoFocusToAddress: true })
    console.log('preset opreturn', this.props.presetOpReturn)

    if (this.props.presetWalletId) {
      this.props.actions.setTransferWallet(this.props.presetWalletId)
    }

    if (this.props.transferWallet.chain === 'BITCOIN') {
      this.props.actions.getBTCFees.requested()
    } else if (this.props.transferWallet.chain === 'ETHEREUM') {
      this.props.actions.getETHGasPrice.requested()
    }

    if (this.props.presetAddress) {
      this.props.change('toAddress', this.props.presetAddress)
    }

    if (this.props.presetAmount) {
      this.props.change('amount', this.props.presetAmount)
    }

    if (this.props.presetMemo) {
      this.props.change('memo', this.props.presetMemo)
    }

    if (this.props.presetOpReturn) {
      if (this.props.transferWallet.chain === 'BITCOIN') {
        this.props.change('opreturn', this.props.presetOpReturn)
        this.addOPReturn()
      }
    }

    if (this.props.transfer.loading) {
      this.props.actions.transfer.failed()
    }
  }

  clearError = () => {
    this.props.actions.transfer.clearError()
  }

  addOPReturn = () => {
    if (this.state.showOPReturn === false) this.setState({ showOPReturn: true })
  }

  removeOPReturn = () => {
    if (this.state.showOPReturn === true) this.setState({ showOPReturn: false })
  }

  onModalHide = () => {
    const error = this.props.transfer.error

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          errorDetail(error),
          [
            { text: '确定', onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  selectContact = () => {
    Keyboard.dismiss()

    if (this.props.contacts && this.props.contacts.length) {
      this.setState({ selectContact: true, showSelectContact: true })
    } else {
      const chain = this.props.transferWallet && this.props.transferWallet.chain
      let chainSymbol

      if (chain === 'BITCOIN') {
        chainSymbol = 'BTC'
      } else if (chain === 'ETHEREUM') {
        chainSymbol = 'ETH'
      } else if (chain === 'EOS') {
        chainSymbol = 'EOS'
      } else if (chain === 'CHAINX') {
        chainSymbol = 'PCX'
      } else {
        return null
      }

      Alert.alert(
        `暂无${chainSymbol}联系人地址`,
        null,
        [
          {
            text: '取消',
            onPress: () => console.log('cancel Pressed'),
            style: 'cancel'
          },
          { text: '添加',
            onPress: () => {
              Navigation.showModal({
                stack: {
                  children: [{
                    component: {
                      name: 'BitPortal.EditContact'
                    }
                  }]
                }
              })
            } }
        ]
      )
    }
  }

  selectContactAddress = (chain, id, name, address) => {
    this.props.actions.setSelectedContact({ id, address, name, chain })
    this.props.change('toAddress', address)
    this.cancelSelectContact()
  }

  onToAddressBlur = () => {
    const { contacts, selectedContact, formValues, transferWallet } = this.props

    if (contacts && contacts.length && !selectedContact) {
      const toAddress = formValues && formValues.toAddress
      if (toAddress) {
        const index = contacts.findIndex(item => item.address === toAddress || item.accountName === toAddress)
        if (index !== -1) {
          this.props.actions.setSelectedContact({
            id: contacts[index].id,
            address: contacts[index].address || contacts[index].accountName,
            name: contacts[index].name,
            chain: transferWallet.chain
          })
        }
      }
    }
  }

  cancelSelectContact = () => {
    this.setState({ selectContact: false }, () => {
      setTimeout(() => {
        this.setState({ showSelectContact: false })
      }, 200)
    })
  }

  clearContact = () => {
    this.props.change('toAddress', null)
    this.props.actions.setSelectedContact(null)
  }

  switchFeesType = () => {
    if (!this.state.customFee) {
      Animated.timing(
        this.state.spinValue,
        {
          toValue: 1,
          duration: 200,
          easing: Easing.inOut(Easing.quad)
        }
      ).start()
    } else {
      Animated.timing(
        this.state.spinValue,
        {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.quad)
        }
      ).start()
    }

    this.setState({
      customFee: !this.state.customFee,
      initialFeeRate: this.state.feeRate,
      initialGwei: +this.state.useGasPrice
    })
  }

  showFeesTip = () => {
    Alert.alert(
      '矿工费',
      '在加密货币中，矿工费是用来支付给矿工，让矿工把你的交易加到区块链中。费用的多少会影响交易的确认时间。',
      [
        { text: '确定', onPress: () => console.log('OK Pressed') }
      ]
    )
    // In cryptocurrencies, a minner fee (or shortly fee) is a payment to the miners for adding a transaction into the blockchain. When a transaction has been included in the blockchain, it is considered confirmed. The size of the fee sent with the transaction determines the confirmation time.
  }

  showOPReturnTip = () => {
    Alert.alert(
      'OP_RETURN 数据',
      'OP_RETURN是一种脚本代码，可以添加任意数据到区块链中，并且带有OP_RETURN的交易output无法再被使用，因此OP_RETURN也可以用于销毁比特币。',
      [
        { text: '确定', onPress: () => console.log('OK Pressed') }
      ]
    )
    // OP_RETURN is a script opcode which can be used to write arbitrary data on blockchain and also to mark a transaction output as invalid. Since any outputs with OP_RETURN are provably unspendable, OP_RETURN outputs can be used to burn bitcoins.
  }

  onSliderValueChange = (value) => {
    this.setState({
      useGasPrice: this.props.intl.formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    })
  }

  onFeeRateValueChange = (value) => {
    this.setState({
      feeRate: +parseInt(value)
    })
  }

  getSpeedText = (feeRate) => {
    if (this.state.fastestBTCFee && this.state.halfHourBTCFee && this.state.hourBTCFee) {
      if (feeRate < this.state.hourBTCFee) {
        // return 'more than 1h'
        return '(约一小时以上)'
      } else if (feeRate >= this.state.hourBTCFee && feeRate < this.state.halfHourBTCFee) {
        // return 'within 1h'
        return '(约一小时内)'
      } else if (feeRate >= this.state.halfHourBTCFee && feeRate < this.state.fastestBTCFee) {
        // return 'within 0.5h'
        return '(约半小时内)'
      } else {
        // return 'fastest'
        return '(最快)'
      }
    }

    return ''
  }

  render() {
    const { transfer, formValues, change, transferWallet, transferAsset, assetBalance, walletBalance, intl, presetContact, contacts, selectedContact } = this.props
    const balance = (transferAsset && transferAsset.contract) ? assetBalance : walletBalance
    const loading = transfer.loading
    const toAddress = formValues && formValues.toAddress
    const memo = formValues && formValues.memo
    const amount = formValues && formValues.amount
    const opreturn = formValues && formValues.opreturn
    const symbol = balance.symbol
    const iconUrl = transferAsset.icon_url
    const contract = transferAsset.contract
    const available = balance && intl.formatNumber(balance.balance, { minimumFractionDigits: 0, maximumFractionDigits: balance.precision })
    const chain = transferWallet.chain

    // fees and display related
    const showMinnerFee = chain === 'BITCOIN' || chain === 'ETHEREUM'
    const showMemo = chain === 'EOS'
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg']
    })

    const feeRate = this.state.feeRate || this.state.initialFeeRate || this.state.fastestBTCFee || 45
    const useGasPrice = this.state.useGasPrice || this.state.initialGwei || this.state.ethGasPrice || 4.00
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : '#F7F7F7' }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : 'white' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ backgroundColor: isDarkMode ? 'black' : 'white' }}
        >
          <View style={{ flex: 1, width: '100%', alignItems: 'center', borderTopWidth: 0, borderBottomWidth: 0, borderColor: '#C8C7CC', justifyContent: "flex-end" }}>
            <Field
              label={intl.formatMessage({ id: 'send_input_label_to_address' })}
              placeholder={`请输入${symbol}${chain === 'EOS' ? '账户名' : '地址'}`}
              name="toAddress"
              fieldName="toAddress"
              component={AddressField}
              showClearButton={!!toAddress && toAddress.length > 0}
              change={change}
              separator
              showContact={selectedContact}
              selectContact={this.selectContact}
              clearContact={this.clearContact}
              contact={this.props.selectedContact}
              autoFocus={this.state.autoFocusToAddress}
              onBlur={this.onToAddressBlur}
              showMemo={showMemo}
              isDarkMode={isDarkMode}
            />
            <Field
              label={intl.formatMessage({ id: 'send_input_label_send_memo' })}
              placeholder={(selectedContact && !!selectedContact.memo) ? `选填，默认为: ${selectedContact.memo}` : '添加备注 (选填)'}
              name="memo"
              fieldName="memo"
              component={MessageField}
              showClearButton={!!memo && memo.length > 0}
              change={change}
              showMemo={showMemo}
              isDarkMode={isDarkMode}
              separator
            />
            <Field
              label={intl.formatMessage({ id: 'send_input_label_payer_account' })}
              placeholder=""
              name="card"
              fieldName="card"
              component={CardField}
              address={transferWallet.address}
              available={available}
              symbol={symbol}
              chain={chain}
              iconUrl={iconUrl}
              contract={contract}
              isDarkMode={isDarkMode}
              separator
            />
            <Field
              label={intl.formatMessage({ id: 'send_input_label_send_amount' })}
              placeholder="00.00"
              name="amount"
              fieldName="amount"
              component={AmountField}
              showClearButton={!!amount && amount.length > 0}
              change={change}
              valueLength={!!amount && amount.length}
              isDarkMode={isDarkMode}
              separator
            />
            {showMinnerFee && chain === 'BITCOIN' && <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16 }}>
              <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                  <Text style={{ fontSize: 15, color: isDarkMode ? 'white' : 'black' }}>{intl.formatMessage({ id: 'send_input_label_mining_fee' })}</Text>
                  <TouchableHighlight
                    underlayColor={isDarkMode ? 'black' : 'white'}
                    activeOpacity={0.42}
                    onPress={this.showFeesTip}
                    style={{ width: 28, height: 28 }}
                  >
                    <FastImage
                      source={require('resources/images/Info.png')}
                      style={{ width: 28, height: 28, marginLeft: 4 }}
                    />
                  </TouchableHighlight>
                </View>
                <TouchableHighlight
                  underlayColor={isDarkMode ? 'black' : 'white'}
                  activeOpacity={0.42}
                  onPress={this.switchFeesType}
                  style={{ height: 50, alignItems: 'center' }}
                >
                  <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                    <View style={{ alignItems: 'flex-end', marginRight: 4, width: 180 }}>
                      <Text style={{ fontSize: 15, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textAlign: 'right' }}>
                        {`≈ ${intl.formatNumber(feeRate * 226 * Math.pow(10, -8), { minimumFractionDigits: 0, maximumFractionDigits: balance.precision })} btc`}
                      </Text>
                      {this.state.customFee && <Text style={{ fontSize: 13, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textAlign: 'right' }}>
                        {`${(feeRate)} sat/b ${this.getSpeedText(feeRate)}`}
                      </Text>}
                    </View>
                    <Animated.Image
                      source={require('resources/images/arrow_right_grey.png')}
                      style={{ width: 14, height: 14, transform: [{ rotate: spin }] }}
                    />
                  </View>
                </TouchableHighlight>
              </View>
              {this.state.customFee && <View style={{ width: '100%', height: 50 }}>
                <Slider
                  value={this.state.initialFeeRate || this.state.fastestBTCFee || 45}
                  minimumValue={this.state.hourBTCFee ? ((this.state.hourBTCFee - 5) > 0 ? (this.state.hourBTCFee - 5) : 1) : 1}
                  maximumValue={this.state.fastestBTCFee ? (this.state.fastestBTCFee + 50) : 100}
                  onValueChange={this.onFeeRateValueChange}
                  minimumTrackTintColor="#007AFF"
                  maximumTrackTintColor="#E5E5EA"
                />
              </View>}
            </View>}
            {showMinnerFee && chain === 'ETHEREUM' && <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16 }}>
              <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                  <Text style={{ fontSize: 15, color: isDarkMode ? 'white' : 'black' }}>{intl.formatMessage({ id: 'send_input_label_mining_fee' })}</Text>
                  <TouchableHighlight
                    underlayColor={isDarkMode ? 'black' : 'white'}
                    activeOpacity={0.42}
                    onPress={this.showFeesTip}
                    style={{ width: 28, height: 28 }}
                  >
                    <FastImage
                      source={require('resources/images/Info.png')}
                      style={{ width: 28, height: 28, marginLeft: 4 }}
                    />
                  </TouchableHighlight>
                </View>
                <TouchableHighlight
                  underlayColor={isDarkMode ? 'black' : 'white'}
                  activeOpacity={0.42}
                  onPress={this.switchFeesType}
                  style={{ height: 50, alignItems: 'center' }}
                >
                  <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                    <View style={{ alignItems: 'flex-end', marginRight: 4, width: 180 }}>
                      <Text style={{ fontSize: 15, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textAlign: 'right' }}>
                        {`${intl.formatNumber(useGasPrice * this.state.ethGasLimit * Math.pow(10, -9), { minimumFractionDigits: 0, maximumFractionDigits: balance.precision })} ether`}
                      </Text>
                      {this.state.customFee && <Text style={{ fontSize: 13, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textAlign: 'right' }}>
                        {`${intl.formatNumber(useGasPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gwei x ${this.state.ethGasLimit}`}
                      </Text>}
                    </View>
                    <Animated.Image
                      source={require('resources/images/arrow_right_grey.png')}
                      style={{ width: 14, height: 14, transform: [{ rotate: spin }] }}
                    />
                  </View>
                </TouchableHighlight>
              </View>
              {this.state.customFee && <View style={{ width: '100%', height: 50 }}>
                <Slider
                  value={this.state.initialGwei || this.state.ethGasPrice || 4.00}
                  minimumValue={1}
                  maximumValue={50}
                  onValueChange={this.onSliderValueChange}
                  minimumTrackTintColor="#007AFF"
                  maximumTrackTintColor="#E5E5EA"
                />
              </View>}
            </View>}
            {chain === 'BITCOIN' && <View style={{ width: '100%', marginBottom: this.state.showOPReturn ? 16 : 0 }}>
              <View style={{ position: 'absolute', height: 0.5, top: 0, right: 16, left: 16, backgroundColor: '#C8C7CC' }} />
              <View style={{ width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16 }}>
                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <Text style={{ fontSize: 15, color: isDarkMode ? 'white' : 'black' }}>{intl.formatMessage({ id: 'send_toggle_advanced_setting' })}</Text>
                </View>
                <View>
                  {!this.state.showOPReturn && <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 40, height: 50, justifyContent: 'center', alignItems: 'flex-end' }} onPress={this.addOPReturn}>
                    <FastImage
                      source={require('resources/images/add_green.png')}
                      style={{ width: 28 * 0.8, height: 30 * 0.8 }}
                    />
                  </TouchableHighlight>}
                  {this.state.showOPReturn && <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 40, height: 50, justifyContent: 'center', alignItems: 'flex-end' }} onPress={this.removeOPReturn}>
                    <FastImage
                      source={require('resources/images/remove_red.png')}
                      style={{ width: 28 * 0.8, height: 30 * 0.8 }}
                    />
                  </TouchableHighlight>}
                </View>
              </View>
              {this.state.showOPReturn && <Field
                                            label="opreturn"
                                            placeholder={intl.formatMessage({ id: 'send_input_placeholder_opreturn_hex' })}
                                            name="opreturn"
                                            fieldName="opreturn"
                                            component={TextField}
                                            showClearButton={!!opreturn && opreturn.length > 0}
                                            change={change}
                                            isDarkMode={isDarkMode}
                                            separator
              />}
              {this.state.showOPReturn && <View style={{ width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16 }}>
                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <Text style={{ fontSize: 13, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>{opreturn && new Buffer.from(opreturn, 'hex').toString()}</Text>
                </View>
              </View>}
            </View>
            }
            <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, marginTop: showMinnerFee ? 4 : 16, marginBottom: 20 }}>
              <TouchableHighlight
                underlayColor="#007AFF"
                activeOpacity={0.9}
                onPress={this.props.handleSubmit(this.submit)}
                style={{ backgroundColor: '#007AFF', borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ textAlign: 'center', color: 'white', fontSize: 17 }}>{intl.formatMessage({ id: 'send_button_send' })}</Text>
              </TouchableHighlight>
            </View>
          </View>
          <Modal
            isVisible={this.state.selectContact}
            onBackdropPress={this.cancelSelectContact}
            backdropOpacity={0.4}
            useNativeDriver
            animationIn="slideInUp"
            animationOut="slideOutDown"
            style={{ margin: 16, justifyContent: 'flex-end', marginBottom: tabHeight }}
          >
            {this.state.showSelectContact && <View>
              <View style={{ width: '100%', height: 64 * 5, borderWidth: 0.5, borderColor: '#C8C7CC', borderRadius: 12, overflow: 'hidden' }}>
                <View style={{ height: 64, width: '100%', backgroundColor: isDarkMode ? 'black' : '#F7F7F7', borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomWidth: 0.5, borderColor: '#C8C7CC', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }}>
                  <View style={{ height: '100%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                    <FastImage
                      source={walletIcons[chain.toLowerCase()]}
                      style={{ width: 40, height: 40, marginRight: 16, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white' }}
                    />
                    <View style={{ height: '100%', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 17, color: isDarkMode ? 'white' : 'black' }}>选择联系人</Text>
                      <Text style={{ fontSize: 14, color: '#666666', marginTop: 2 }}>{`${symbol} ${chain === 'EOS' ? '账户名' : '地址'}`}</Text>
                    </View>
                  </View>
                  {/* <TouchableHighlight underlayColor={isDarkMode ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0)'} style={{ padding: 4 }} activeOpacity={0.8} onPress={this.cancelSelectContact}>
                      <Text style={{ fontSize: 17, color: '#007AFF' }}>取消</Text>
                      </TouchableHighlight> */}
                </View>
                <View style={{ height: 64 * 4, width: '100%' }}>
                  <TableView
                    style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : 'white' }}
                    tableViewCellStyle={TableView.Consts.CellStyle.Default}
                    showsVerticalScrollIndicator={false}
                    cellSeparatorInset={{ left: 16 }}
                  >
                    <Section>
                      {contacts.map(contact => <Item
                                                 key={contact.id}
                                                 height={64}
                                                 isDarkMode={isDarkMode}
                                                 reactModuleForCell="SelectContactTableViewCell"
                                                 name={contact.name}
                                                 address={contact.address || contact.accountName}
                                                 onPress={this.selectContactAddress.bind(this, chain, contact.id, contact.name, contact.address || contact.accountName)}
                                                 accessoryType={(selectedContact && chain === selectedContact.chain && contact.name === selectedContact.name && (contact.address === selectedContact.address || contact.accountName === selectedContact.address)) ? TableView.Consts.AccessoryType.Checkmark : TableView.Consts.AccessoryType.None}
                      />
                      )}
                    </Section>
                  </TableView>
                </View>
              </View>
            </View>}
          </Modal>
          <Modal
            isVisible={loading}
            backdropOpacity={0.4}
            useNativeDriver
            animationIn="fadeIn"
            animationInTiming={200}
            backdropTransitionInTiming={200}
            animationOut="fadeOut"
            animationOutTiming={200}
            backdropTransitionOutTiming={200}
            onModalHide={this.onModalHide}
          >
            {loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <ActivityIndicator size="small" color="#000000" />
                <Text style={{ fontSize: 17, color: isDarkMode ? 'white' : 'black', marginLeft: 10, fontWeight: 'bold' }}>{intl.formatMessage({ id: 'transfer_alert_sending_transaction' })}</Text>
              </View>
            </View>}
          </Modal>
        </ScrollView>
      </SafeAreaView>
    )
}
}
