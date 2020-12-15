import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  LayoutAnimation,
  SafeAreaView,
  Platform
} from 'react-native'
import FastImage from 'react-native-fast-image'
import TableView from 'components/TableView'
import { withdrawContactSelector, selectedContactSelector } from 'selectors/contact'
import { transferWalletBalanceSelector, transferAssetBalanceSelector } from 'selectors/balance'
import { withdrawAssetSelector } from 'selectors/asset'
import { activeWalletSelector } from 'selectors/wallet'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import * as transactionActions from 'actions/transaction'
import * as balanceActions from 'actions/balance'
import * as contactActions from 'actions/contact'
import * as walletActions from 'actions/wallet'
import Modal from 'react-native-modal'
import { assetIcons, walletIcons } from 'resources/images'
import { DarkModeContext } from 'utils/darkMode'
import { rioTokenIcons } from 'resources/images'
import { getChain,getExternalChainSymbol,getExternalChainFee } from 'utils/riochain'

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
      return gt('pwd_wrong')
    case 'Amount less than minimum':
      return gt('tx_error_belowlimit')
    case 'Select utxo failed':
    case 'You don\'t have enough balance':
      return gt('error_balance_insufficient')
    case 'Returned error: insufficient funds for gas * price + value':
      return gt('error_balance_insuffi_fee')
    case 'request timeout':
      return '请求超时，请检查区块链浏览器以确定交易是否发出！'
    default:
      return `${t(this,'tx_failed')} ${message.toString()}`
  }
}

export const errorDetail = (error) => {
  if (!error) { return null }

  const detail = typeof error === 'object' ? error.detail : ''

  return detail
}

const formatAddress = (address) => {
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
            {/* <Text style={{ fontWeight: '500', fontSize: 20, color: isDarkMode ? 'black' : 'white', paddingLeft: 1.6 }}>{symbol && symbol.length? symbol.slice(0, 1):''}</Text> */}
          </View>
          <FastImage
            source={iconUrl}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: iconUrl ? 'white' : 'rgba(0,0,0,0)', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
          />
        </View>
        <FastImage source={assetIcons[chain.toLowerCase()]} style={{ position: 'absolute', right: -4, bottom: 0, width: 16, height: 16, borderRadius: 8, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white' }} />
      </View>}
      <View>
        <Text style={{ fontSize: 17, color: isDarkMode ? 'white' : 'black' }}>{symbol}</Text>
         <Text style={{ fontSize: 15, color: isDarkMode ? 'rgba(255,255,255,0.48)' : 'rgba(0,0,0,0.48)', marginTop: 4 }}>{available}</Text>
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
    warnings.toAddress = t(this,'tx_enter_addr')
  }

  if (!values.amount) {
    warnings.amount = t(this,'tx_enter_amount')
  } else if (isNaN(values.amount) || +values.amount <= 0) {
    warnings.amount = t(this,'tx_enter_amount_error')
  }

  return warnings
}

const shouldError = () => true

@injectIntl

@reduxForm({ form: 'transferAssetForm', shouldError, warn })

@connect(
  state => ({
    formSyncWarnings: getFormSyncWarnings('transferAssetForm')(state),
    formValues: getFormValues('transferAssetForm')(state),
    walletBalance: transferWalletBalanceSelector(state),
    assetBalance: transferAssetBalanceSelector(state),
    contacts: withdrawContactSelector(state),
    selectedContact: selectedContactSelector(state),
    withdrawAsset: state.withdrawAsset,
    activeWallet: activeWalletSelector(state),
    withdrawAssetInfo: withdrawAssetSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions,
      ...walletActions,
      ...balanceActions,
      ...contactActions,
    }, dispatch)
  })
)

export default class WithdrawAsset extends Component {
  static contextType = DarkModeContext

  static get options() {
    return {
      topBar: {
        noBorder: true,
        backButton: {
          title: gt('button_back')
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
  constructor(props) {
    super(props);
    this.updateTxid = ''
    this.showTip = false
  }
  state = {
    selectContact: false,
    showSelectContact: false,
    selectedContactName: null,
    selectedContactAddress: null,
    autoFocusToAddress: false,
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
              passProps: { from: 'transfer', form: 'transferAssetForm', field: 'toAddress', chain: this.props.activeWallet.chain, symbol: this.props.activeWallet.symbol }
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
    ) {
      LayoutAnimation.easeInEaseOut()

      return {
        selectedContactName: (nextProps.selectedContact && nextProps.selectedContact.name),
        selectedContactAddress: (nextProps.selectedContact && nextProps.selectedContact.address),
      }
    } else {
      return null
    }
  }

  componentWillUnmount() {
    this.props.reset()
  }

  submit = (data) => {
    Keyboard.dismiss()
    const { intl, formSyncWarnings,withdrawAssetInfo,activeWallet } = this.props
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
          onPress: password => this.props.actions.withdrawAsset.requested({
            ...data,
            password,
            chain: withdrawAssetInfo.chain,
            id: activeWallet.id,
            symbol: withdrawAssetInfo.symbol,
            decimals: withdrawAssetInfo.decimals,
            contract: withdrawAssetInfo.contract,
            componentId: this.props.componentId,
            onError:this.onError,
            onSuccess: this.onSuccess.bind(this),
            onUpdate: this.onUpdate
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

    if (this.props.presetAddress) {
      this.props.change('toAddress', this.props.presetAddress)
    }

    if (this.props.presetAmount) {
      this.props.change('amount', this.props.presetAmount)
    }
    if (this.props.withdrawAsset.loading) {
      this.props.actions.withdrawAsset.failed()
    }
  }

  clearError = () => {
    this.props.actions.withdrawAsset.clearError()
  }

  onModalHide = () => {
    const error = this.props.withdrawAsset.error

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          errorDetail(error),
          [
            { text: t(this,'button_ok'), onPress: () => this.clearError() }
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
      const symbol = this.props.withdrawAssetInfo && this.props.withdrawAssetInfo.symbol
      const chainSymbol = getChain(symbol.toUpperCase())
      Alert.alert(
        t(this,'contact_nocontact_symbol',{symbol:chainSymbol}),
        null,
        [
          {
            text: t(this,'button_cancel'),
            onPress: () => console.log('cancel Pressed'),
            style: 'cancel'
          },
          { text: t(this,'add'),
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

  onError = () =>{}

  onSuccess = () => {
    if (this.showTip === false) {
      this.showTip = true
      setTimeout(() => {
        Alert.alert(
          t(this,'asset_withdraw_success'),
          null,
          [
            {
              text: t(this,'button_cancel'),
              onPress: () => this.showTip = false,
              style: 'cancel'
            }
          ]
        )
      },500);
    }
  }

  onUpdate = (txid) => {
  this.updateTxid = txid
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

  showRioChainTip = () => {
    Alert.alert(
      t(this,'gas_fee'),
      t(this,'tx_caution_riochain_confirmation'),
      [
        { text:  t(this,'button_ok'), onPress: () => console.log('OK Pressed') }
      ]
    )
  }

  render() {

    const { withdrawAsset, formValues, change, assetBalance, walletBalance, intl, contacts, selectedContact } = this.props
    const balance =  assetBalance.symbol === 'RFUEL' ? walletBalance : assetBalance
    const loading = withdrawAsset.loading
    const toAddress = formValues && formValues.toAddress
    const memo = formValues && formValues.memo
    const amount = formValues && formValues.amount
    const symbol =  balance.symbol || ''
    const contract = balance.contract
    const available = balance && intl.formatNumber(balance.balance, { minimumFractionDigits: 0, maximumFractionDigits: balance.precision })
    const chain = walletBalance.chain
    let rio_icon = rioTokenIcons[(symbol || '').toLowerCase()]

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
              placeholder={t(this,'addr_enter_symbol',{symbol:getChain(symbol.toUpperCase())})}
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
              isDarkMode={isDarkMode}
            />
            <Field
              label={intl.formatMessage({ id: 'send_input_label_send_memo' })}
              placeholder={(selectedContact && !!selectedContact.memo) ? t(this,'optional_default_value',{value:electedContact.memo}) : t(this,'optional_add_note') }
              name="memo"
              fieldName="memo"
              component={MessageField}
              showClearButton={!!memo && memo.length > 0}
              change={change}
              isDarkMode={isDarkMode}
              separator
            />
            <Field
              label={intl.formatMessage({ id: 'send_input_label_payer_account' })}
              placeholder=""
              name="card"
              fieldName="card"
              component={CardField}
              available={available}
              symbol={getExternalChainSymbol(symbol.toUpperCase())}
              chain={chain}
              iconUrl={rio_icon}
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
            <View style={{width:'100%',paddingHorizontal:16}}>
              <View style={{width:'100%',justifyContent:'space-between',flexDirection:'row',alignItems:'center',marginTop:15,}}>
                <Text style={{ fontSize: 15, color: isDarkMode ? 'white' : 'black' }}>{t(this,'gas_fee')}</Text>
                <Text style={{ fontSize: 15, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textAlign: 'right' }}>{'0.1 RFUEL'}</Text>
              </View>
              <View style={{width:'100%',justifyContent:'space-between',flexDirection:'row',alignItems:'center',marginTop:15,}}>
                <Text style={{ fontSize: 15, color: isDarkMode ? 'white' : 'black' }}>{t(this,'asset_withdraw_network_fee')}</Text>
                <Text style={{ fontSize: 15, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textAlign: 'right' }}>{getExternalChainFee(symbol.toUpperCase())} {getExternalChainSymbol(symbol.toUpperCase())}</Text>
              </View>
              <View style={{flexDirection:'row',marginTop:15,marginBottom:10,marginRight:21}}>
                <Text style={{ fontSize: 12, color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textAlign: 'left'}}>
                  {t(this,'asset_withdraw_tip')}
                </Text>
                <TouchableHighlight
                  underlayColor={isDarkMode ? 'black' : 'white'}
                  activeOpacity={0.42}
                  onPress={this.showRioChainTip}
                  style={{ width: 28, height: 28 }}
                >
                  <FastImage
                    source={require('resources/images/Info.png')}
                    style={{ width: 28, height: 28, marginLeft: 4 }}
                  />
                </TouchableHighlight>
              </View>
            </View>
            <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, marginTop: 16, marginBottom: 20 }}>
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
                      <Text style={{ fontSize: 17, color: isDarkMode ? 'white' : 'black' }}>{t(this,'contact_select')}</Text>
                      <Text style={{ fontSize: 14, color: '#666666', marginTop: 2 }}>{`${symbol} ${t(this,'addr')}`}</Text>
                    </View>
                  </View>

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
