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
  Switch,
  Animated,
  Easing,
  UIManager,
  TouchableNativeFeedback,
  // Slider
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { transferWalletSelector } from 'selectors/wallet'
import { transferWalletFeeSelector } from 'selectors/fee'
import { transferWalletsContactsSelector, selectedContactSelector } from 'selectors/contact'
import { transferWalletBalanceSelector, transferAssetBalanceSelector } from 'selectors/balance'
import { transferAssetSelector } from 'selectors/asset'
import { Navigation } from 'react-native-navigation'
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
import IndicatorModal from 'components/Modal/IndicatorModal'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'

const dataProvider = new DataProvider((r1, r2) => r1.key !== r2.key)

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
    fontSize: 16,
    width: Dimensions.get('window').width - 80 - 56 - 6,
    marginLeft: 56,
    color: 'white',
    paddingLeft: 0
  },
  messageFiled: {
    backgroundColor: 'white',
    borderRadius: 17,
    borderWidth: 0.5,
    fontSize: 16,
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
    width: '100% - 52',
    paddingBottom: 0
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
  showMemo
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: showContact ? 64 : 42, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    {!showContact && <TextInput
      style={styles.textFiled}
      autoCorrect={false}
      autoFocus={autoFocus}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      keyboardType="default"
      secureTextEntry={secureTextEntry}
      placeholderTextColor='rgba(255,255,255,0.5)'
      {...restInput}
    />}
    {!!showContact && (
    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
      <View style={{ width: 40, height: 40, marginRight: 16 }}>
        <Image
          source={require('resources/images/profile_placeholder_android.png')}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
        <View style={{ height: 34, width: 34, borderRadius: 17, position: 'absolute', right: -15, top: -15, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 5 }} activeOpacity={0.8} onPress={clearContact}>
            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: 'white' }}>
              <Image
                source={require('resources/images/remove_circle_orange_android.png')}
                 style={{ width: 18, height: 18 }}
              />
            </View>
          </TouchableHighlight>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 17, color: 'white' }} lineOfNumebrs={1}>{contact.name}</Text>
        <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.54)', marginTop: 2 }} lineOfNumebrs={1}>{formatAddress(contact.address)}</Text>
      </View>
    </View>
    )}
    <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 30, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={selectContact}>
        <Image
          source={require('resources/images/select_address_android.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableHighlight>
    </View>
    {!showContact && showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 50, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <Image
          source={require('resources/images/clear_white_android.png')}
          style={{ width: 22, height: 22 }}
        />
      </TouchableHighlight>
    </View>}
    {separator && <View style={{ position: 'absolute', height: active ? 2 : 1, bottom: 0, right: 16, left: 72, backgroundColor: active ? 'white' : 'rgba(255,255,255,0.12)' }} />}
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
  showMemo
}) => (
  <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    {showMemo && <TextInput
                   style={[styles.textFiled, { maxHeight: 100 }]}
                   autoCorrect={false}
                   autoCapitalize="none"
                   placeholder={placeholder}
                   onChangeText={onChange}
                   keyboardType="default"
                   multiline={true}
                   secureTextEntry={secureTextEntry}
                   placeholderTextColor='rgba(255,255,255,0.5)'
                   {...restInput}
                 />}
    {showMemo && showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 22, width: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <Image
          source={require('resources/images/clear_white_android.png')}
          style={{ width: 22, height: 22 }}
        />
      </TouchableHighlight>
    </View>}
    <View style={{ position: 'absolute', height: active ? 2 : 1, bottom: 0, right: 16, left: 72, backgroundColor: active ? 'white' : 'rgba(255,255,255,0.12)' }} />
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
  showClearButton
}) => (
  <View style={{ width: '100%' }}>
    <View style={{ width: '100%', alignItems: 'flex-start', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)', marginTop: 20 }}>{label}</Text>
    </View>
    <View style={{ width: '100%', alignItems: 'center', height: 72, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <TextInput
        style={[styles.amountFiled, (!!valueLength && valueLength > 10) ? { fontSize: 40 } : {}]}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        onChangeText={onChange}
        keyboardType="numeric"
        secureTextEntry={secureTextEntry}
        {...restInput}
      />
      {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
          <Image
            source={require('resources/images/clear_android.png')}
            style={{ width: 22, height: 22 }}
          />
        </TouchableHighlight>
      </View>}
      {separator && <View style={{ position: 'absolute', height: 1, bottom: 0, right: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.12)' }} />}
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
  showClearButton
}) => (
  <View style={{ width: '100%' }}>
    <View style={{ width: '100%', alignItems: 'center', paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <TextInput
        style={[styles.smTextFiled]}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        {...restInput}
      />
      {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
          <Image
            source={require('resources/images/clear_android.png')}
            style={{ width: 22, height: 22 }}
          />
        </TouchableHighlight>
      </View>}
      {separator && <View style={{ position: 'absolute', height: 1, bottom: 0, right: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.12)' }} />}
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
  separator
}) => (
  <View style={{ width: '100%' }}>
    <View style={{ width: '100%', alignItems: 'flex-start', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)', marginTop: 20 }}>{label}</Text>
    </View>
    <View style={{ width: '100%', alignItems: 'center', height: 72, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      {!!chain && !contract &&  <Image source={assetIcons[chain.toLowerCase()]} style={{ width: 40, height: 40, marginRight: 16, borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }} />}
      {!!contract && <View style={{ width: 41, height: 41, marginRight: 16 }}>
        <View style={{ width: 40, height: 40, borderWidth: 0, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white', borderRadius: 20 }}>
          <View style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#B9C1CF' }}>
            <Text style={{ fontWeight: '500', fontSize: 20, color: 'white', paddingLeft: 1.6 }}>{symbol.slice(0, 1)}</Text>
          </View>
          <FastImage
            source={{ uri: iconUrl }}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: iconUrl ? 'white' : 'rgba(0,0,0,0)', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
          />
        </View>
        <Image source={assetIcons[chain.toLowerCase()]} style={{ position: 'absolute', right: -8, bottom: 0, width: 20, height: 20, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white' }} />
      </View>}
      <View>
        <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{formatAddress(address)}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', marginTop: 4 }}>{available} {symbol}</Text>
      </View>
    </View>
    {separator && <View style={{ position: 'absolute', height: 1, bottom: 0, right: 16, left: 72, backgroundColor: 'rgba(0,0,0,0.12)' }} />}
  </View>
)

const warn = (values, props) => {
  const warnings = {}
  const { transferAsset, assetBalance, walletBalance } = props
  const balance = (transferAsset && transferAsset.contract) ? assetBalance : walletBalance
  const available = balance && balance.balance

  if (!values.toAddress) {
    warnings.toAddress = '请输入转账地址'
  }

  if (!values.amount) {
    warnings.amount = '请输入金额'
  } else if (isNaN(values.amount) || +values.amount <= 0) {
    warnings.amount = '请输入正确的金额'
  } else if (!available || +values.amount > +available) {
    warnings.amount = '余额不足'
  }

  return warnings
}

const shouldError = () => true

@injectIntl

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

@reduxForm({ form: 'transferAssetForm', shouldError, warn })

export default class TransferAsset extends Component {
  static get options() {
    return {
      topBar: {
        elevation: 0
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  layoutProvider = new LayoutProvider(
    index => {
      return 0
    },
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 64
    }
  )

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
    initialFeeRate: 0,
    dataProvider: dataProvider.cloneWithRows([]),
    extendedState: { selectedContact: false },
    showPrompt: false,
    password: ''
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      // Keyboard.dismiss()
      // Navigation.dismissAllModals()
      Navigation.dismissModal(this.props.componentId)
    } else if (buttonId === 'scan') {
      /* Navigation.showModal({
       *   stack: {
       *     children: [{
       *       component: {
       *         name: 'BitPortal.Camera',
       *         passProps: { from: 'transfer', form: 'transferAssetForm', field: 'toAddress', chain: this.props.transferWallet.chain, symbol: this.props.transferWallet.symbol }
       *       }
       *     }]
       *   }
       * })*/
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { presetContact, contacts, selectedContact } = nextProps
    let contactCells = []
    contactCells = contacts.map(contact => ({
      key: contact.id,
      id: contact.id,
      name: contact.name,
      address: contact.address || contact.accountName,
    }))

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
        ethGasPrice: (nextProps.fee && nextProps.fee.gasPrice),
        dataProvider: dataProvider.cloneWithRows(contactCells),
        extendedState: { selectedContact }
      }
    } else {
      return { dataProvider: dataProvider.cloneWithRows(contactCells), extendedState: { selectedContact } }
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
    Keyboard.dismiss()
    this.requestPassword()

    /* Alert.prompt(
     *   intl.formatMessage({ id: 'alert_input_wallet_password' }),
     *   null,
     *   [
     *     {
     *       text: intl.formatMessage({ id: 'alert_button_cancel' }),
     *       onPress: () => console.log('Cancel Pressed'),
     *       style: 'cancel'
     *     },
     *     {
     *       text: intl.formatMessage({ id: 'alert_button_confirm' }),
     *       onPress: password => this.props.actions.transfer.requested({
     *         ...data,
     *         password,
     *         fromAddress: transferWallet.address,
     *         chain: transferWallet.chain,
     *         id: transferWallet.id,
     *         feeRate: +this.state.feeRate || +this.state.initialFeeRate || this.state.fastestBTCFee || 45,
     *         symbol: transferAsset.symbol,
     *         precision: transferAsset.precision,
     *         decimals: transferAsset.decimals,
     *         contract: transferAsset.contract,
     *         componentId: this.props.componentId,
     *         memo: data.memo || (this.props.selectedContact && this.props.selectedContact.memo),
     *         gasLimit: this.state.ethGasLimit,
     *         gasPrice: +this.state.useGasPrice || +this.state.initialGwei || this.state.ethGasPrice || 4.00
     *       })
     *     }
     *   ],
     *   'secure-text'
     * )*/
  }

  requestPassword = () => {
    this.setState({ showPrompt: true, password: '' })
  }

  changePassword = (text) => {
    this.setState({ password: text })
  }

  clearPassword = () => {
    this.setState({ password: '', showPrompt: false })
  }

  submitPassword = () => {
    this.setState({ showPrompt: false })

    const { transferWallet, transferAsset, formValues } = this.props

    if (formValues && typeof formValues === 'object') {
      const password = this.state.password

      this.props.actions.transfer.requested({
        ...formValues,
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
        memo: formValues.memo || (this.props.selectedContact && this.props.selectedContact.memo),
        gasLimit: this.state.ethGasLimit,
        gasPrice: +this.state.useGasPrice || +this.state.initialGwei || this.state.ethGasPrice || 4.00
      })
    }
  }

  componentDidAppear() {
    if (this.props.selectedContact && this.props.selectedContact.address) {
      this.props.change('toAddress', this.props.selectedContact.address)
    }

    this.props.actions.getBalance.requested(this.props.transferWallet)

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'scan',
            icon: require('resources/images/scan_android.png')
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

    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
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
      this.setState({ selectContact: true })
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
          {
            text: '添加',
            onPress: () => {
              Navigation.push(this.props.componentId, {
                component: {
                  name: 'BitPortal.EditContact',
                  options: {
                    topBar: {
                      title: {
                        text: '创建联系人'
                      }
                    }
                  }
                }
              })
            }
          }
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
    /* const { contacts, selectedContact, formValues, transferWallet } = this.props

     * if (contacts && contacts.length && !selectedContact) {
     *   const toAddress = formValues && formValues.toAddress
     *   if (toAddress) {
     *     const index = contacts.findIndex(item => item.address === toAddress || item.accountName === toAddress)
     *     if (index !== -1) {
     *       this.props.actions.setSelectedContact({
     *         id: contacts[index].id,
     *         address: contacts[index].address || contacts[index].accountName,
     *         name: contacts[index].name,
     *         chain: transferWallet.chain
     *       })
     *     }
     *   }
     * }*/
  }

  cancelSelectContact = () => {
    this.setState({ selectContact: false })
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

  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  renderItem = (type, data) => {
    const { transferWallet } = this.props
    const chain = transferWallet.chain

    return (
      <TouchableNativeFeedback onPress={this.selectContactAddress.bind(this, chain, data.id, data.name, data.address || data.accountName)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image
              source={require('resources/images/profile_placeholder_android.png')}
              style={{ width: 40, height: 40, borderRadius: 29, marginRight: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}
            />
            <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
              <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'center', paddingRight: 16 }}>
                <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }} numberOfLines={1}>{data.name}</Text>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', paddingTop: 2 }} numberOfLines={1}>{this.formatAddress(data.address)}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
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
    const available = balance && intl.formatNumber(balance.balance, { minimumFractionDigits: balance.precision, maximumFractionDigits: balance.precision })
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

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ backgroundColor: 'white' }}
      >
        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#673AB7', width: '100%', elevation: 4, paddingBottom: 32 }}>
            <View style={{ width: '100%', paddingLeft: 72, paddingBottom: 6 }}>
              <Text style={{ color: 'white', fontSize: 24 }}>{`发送${symbol}到`}</Text>
            </View>
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
            />
            {chain === 'EOS' && <Field
              label={intl.formatMessage({ id: 'send_input_label_send_memo' })}
              placeholder={(selectedContact && !!selectedContact.memo) ? `选填，默认为: ${selectedContact.memo}` : '添加备注 (选填)'}
              name="memo"
              fieldName="memo"
              component={MessageField}
              showClearButton={!!memo && memo.length > 0}
              change={change}
              showMemo={showMemo}
              separator
            />}
          </View>
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
            separator
          />
          {showMinnerFee && chain === 'BITCOIN' && <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16 }}>
            <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{intl.formatMessage({ id: 'send_input_label_mining_fee' })}</Text>
                <TouchableHighlight
                  underlayColor="white"
                  activeOpacity={0.42}
                  onPress={this.showFeesTip}
                  style={{ width: 24, height: 24, marginLeft: 4 }}
                >
                  <Image
                    source={require('resources/images/info_android.png')}
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableHighlight>
              </View>
              <TouchableHighlight
                underlayColor="white"
                activeOpacity={0.42}
                onPress={this.switchFeesType}
                style={{ height: 50, alignItems: 'center' }}
              >
                <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                  <View style={{ alignItems: 'flex-end', width: 180 }}>
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', textAlign: 'right' }}>
                      {`≈ ${intl.formatNumber(feeRate * 226 * Math.pow(10, -8), { minimumFractionDigits: balance.precision, maximumFractionDigits: balance.precision })} btc`}
                    </Text>
                    {this.state.customFee && <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.54)', textAlign: 'right' }}>
                      {`${(feeRate)} sat/b ${this.getSpeedText(feeRate)}`}
                    </Text>}
                  </View>
                  <Animated.Image
                    source={require('resources/images/arrow_right_android.png')}
                    style={{ width: 20, height: 20, transform: [{ rotate: spin }] }}
                  />
                </View>
              </TouchableHighlight>
            </View>
            {this.state.customFee && <View style={{ width: '100%', height: 50, justifyContent: 'center', paddingBottom: 10 }}>
              <Slider
                value={this.state.initialFeeRate || this.state.fastestBTCFee || 45}
                minimumValue={this.state.hourBTCFee ? ((this.state.hourBTCFee - 5) > 0 ? (this.state.hourBTCFee - 5) : 1) : 1}
                maximumValue={this.state.fastestBTCFee ? (this.state.fastestBTCFee + 50) : 100}
                onValueChange={this.onFeeRateValueChange}
              />
            </View>}
          </View>}
          {showMinnerFee && chain === 'ETHEREUM' && <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16 }}>
            <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{intl.formatMessage({ id: 'send_input_label_mining_fee' })}</Text>
                <TouchableHighlight
                  underlayColor="white"
                  activeOpacity={0.42}
                  onPress={this.showFeesTip}
                  style={{ width: 24, height: 24, marginLeft: 4 }}
                >
                  <Image
                    source={require('resources/images/info_android.png')}
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableHighlight>
              </View>
              <TouchableHighlight
                underlayColor="white"
                activeOpacity={0.42}
                onPress={this.switchFeesType}
                style={{ height: 50, alignItems: 'center' }}
              >
                <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                  <View style={{ alignItems: 'flex-end', width: 180 }}>
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', textAlign: 'right' }}>
                      {`${intl.formatNumber(useGasPrice * this.state.ethGasLimit * Math.pow(10, -9), { minimumFractionDigits: balance.precision, maximumFractionDigits: balance.precision })} ether`}
                    </Text>
                    {this.state.customFee && <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.54)', textAlign: 'right' }}>
                      {`${intl.formatNumber(useGasPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gwei x ${this.state.ethGasLimit}`}
                    </Text>}
                  </View>
                  <Animated.Image
                    source={require('resources/images/arrow_right_android.png')}
                    style={{ width: 20, height: 20, transform: [{ rotate: spin }] }}
                  />
                </View>
              </TouchableHighlight>
            </View>
            {this.state.customFee && <View style={{ width: '100%', height: 50, justifyContent: 'center', paddingBottom: 10 }}>
              <Slider
                value={this.state.initialGwei || this.state.ethGasPrice || 4.00}
                minimumValue={1}
                maximumValue={50}
                onValueChange={this.onSliderValueChange}
              />
            </View>}
          </View>}
          {chain === 'BITCOIN' && <View style={{ width: '100%', marginBottom: this.state.showOPReturn ? 16 : 0 }}>
            <View style={{ position: 'absolute', height: 0.5, top: 0, right: 16, left: 16, backgroundColor: '#C8C7CC' }} />
            <View style={{ width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16 }}>
              <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{intl.formatMessage({ id: 'send_toggle_advanced_setting' })}</Text>
                {/* <TouchableHighlight
                    underlayColor="white"
                    activeOpacity={0.42}
                    onPress={this.showOPReturnTip}
                    style={{ width: 28, height: 28 }}
                    >
                    <FastImage
                    source={require('resources/images/Info.png')}
                    style={{ width: 28, height: 28, marginLeft: 4 }}
                    />
                    </TouchableHighlight> */}
              </View>
              <View>
                {!this.state.showOPReturn && <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 40, height: 50, justifyContent: 'center', alignItems: 'flex-end' }} onPress={this.addOPReturn}>
                  <Image
                    source={require('resources/images/add_circle_purple_android.png')}
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableHighlight>}
                {this.state.showOPReturn && <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 40, height: 50, justifyContent: 'center', alignItems: 'flex-end' }} onPress={this.removeOPReturn}>
                  <Image
                    source={require('resources/images/remove_circle_orange_android.png')}
                    style={{ width: 24, height: 24}}
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
              separator
            />}
          </View>
          }
        <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, marginTop: showMinnerFee ? 4 : 16, marginBottom: 20 }}>
          <TouchableNativeFeedback onPress={this.props.handleSubmit(this.submit)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)}>
            <View
              style={{
                width: '100%',
                height: 50,
                backgroundColor: '#673AB7',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
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
                {intl.formatMessage({ id: 'send_button_send' })}
              </Text>
            </View>
          </TouchableNativeFeedback>
          </View>
        </View>

        <Modal
          isVisible={this.state.selectContact}
          onBackdropPress={this.cancelSelectContact}
          backdropOpacity={0.6}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={500}
          backdropTransitionInTiming={500}
          animationOut="fadeOut"
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
        >
          {(this.state.selectContact) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 4, alignItem: 'center', elevation: 14, width: '100%' }}>
              <View style={{ paddingHorizontal: 24, paddingBottom: 9, paddingTop: 20 }}>
                <Text style={{ fontSize: 20, color: 'rgba(0,0,0,0.87)', fontWeight: '500' }}>选择联系人</Text>
              </View>
              <View style={{ paddingBottom: 12, paddingTop: 6, paddingHorizontal: 16 }}>
                <View style={{ height: 64 * 4, width: '100%' }}>
                  <RecyclerListView
                    layoutProvider={this.layoutProvider}
                    dataProvider={this.state.dataProvider}
                    rowRenderer={this.renderItem}
                    renderAheadOffset={64 * 10}
                    extendedState={this.state.extendedState}
                  />
                </View>
              </View>
            </View>
          </View>}
        </Modal>

        <Modal
          isVisible={this.state.showPrompt}
          backdropOpacity={0.6}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={500}
          backdropTransitionInTiming={500}
          animationOut="fadeOut"
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
        >
          {(this.state.showPrompt) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
            <View style={{ backgroundColor: 'white', paddingTop: 14, paddingBottom: 11, paddingHorizontal: 24, borderRadius: 2, alignItem: 'center', justifyContent: 'space-between', elevation: 14, width: '100%' }}>
              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20, color: 'black', marginBottom: 12 }}>请输入密码</Text>
                {/* <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.54)', marginBottom: 12 }}>This is a prompt</Text> */}
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
                  placeholder="Password"
                  keyboardType="default"
                  secureTextEntry={true}
                  onChangeText={this.changePassword}
                  onSubmitEditing={this.submitPassword}
                />
              </View>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TouchableNativeFeedback onPress={this.clearPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2, marginRight: 8 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>取消</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.submitPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>确定</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>}
        </Modal>
        <IndicatorModal onModalHide={this.onModalHide} isVisible={loading} message={intl.formatMessage({ id: 'transfer_alert_sending_transaction' })} />
      </ScrollView>
    )
  }
}
