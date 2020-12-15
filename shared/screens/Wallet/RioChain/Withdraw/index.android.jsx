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
  Keyboard,
  Dimensions,
  LayoutAnimation,
  UIManager,
  TouchableNativeFeedback,
} from 'react-native'
import FastImage from 'react-native-fast-image'
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
import { assetIcons, walletIcons,rioTokenIcons } from 'resources/images'
import IndicatorModal from 'components/Modal/IndicatorModal'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import { getChain,getExternalChainSymbol,getExternalChainFee } from 'utils/riochain'

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
  textFiled2: {
    height: '100%',
    fontSize: 16,
    width: Dimensions.get('window').width - 80  - 6,
    marginLeft: 0,
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
      return gt('pwd_wrong')
    case 'Amount less than minimum':
      return gt('tx_error_belowlimit')
    case 'Select utxo failed':
    case 'You don\'t have enough balance':
      return gt('error_balance_insufficient')
    case 'Returned error: insufficient funds for gas * price + value':
      return gt('error_balance_insuffi_fee')
    case 'EOS System Error':
      return 'EOS系统错误'
    default:
      return `${gt('tx_failed')} ${message.toString()}`
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
  showMemo
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: showContact ? 64 : 42, paddingLeft: 16, paddingRight: 16, flexDirection: 'row'}}>
    {!showContact && <TextInput
      style={showContact? styles.textFiled : styles.textFiled2}
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
    {separator && <View style={{ position: 'absolute', height: active ? 2 : 1, bottom: 0, right: 16, left: showContact ? 72 : 16, backgroundColor: active ? 'white' : 'rgba(255,255,255,0.12)' }} />}
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
            <Text style={{ fontWeight: '500', fontSize: 20, color: 'white', paddingLeft: 1.6 }}>{symbol && symbol.length? symbol.slice(0, 1):''}</Text>
          </View>
          <FastImage
            source={iconUrl}
            style={{width: 40, height: 40, borderRadius: 20, backgroundColor: iconUrl ? 'white' : 'rgba(0,0,0,0)', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
          />
        </View>
        <Image source={assetIcons[chain.toLowerCase()]} style={{ position: 'absolute', right: -8, bottom: 0, width: 20, height: 20, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white' }} />
      </View>}
      <View>
        <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{symbol}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)', marginTop: 4 }}>{available}</Text>
      </View>
    </View>
    {separator && <View style={{ position: 'absolute', height: 1, bottom: 0, right: 16, left: 72, backgroundColor: 'rgba(0,0,0,0.12)' }} />}
  </View>
)

const warn = (values, props) => {
  const warnings = {}
  // const { transferAsset, assetBalance, walletBalance } = props
  // const balance = (transferAsset && transferAsset.contract) ? assetBalance : walletBalance
  // const available = balance && balance.balance

  if (!values.toAddress) {
    warnings.toAddress = gt('tx_enter_addr')
  }

  if (!values.amount) {
    warnings.amount = gt('tx_enter_amount')
  } else if (isNaN(values.amount) || +values.amount <= 0) {
    warnings.amount = gt('tx_enter_amount_error')
  }
  // else if (!available || +values.amount > +available) {
  //   warnings.amount = gt('error_balance_insufficient')
  // }

  return warnings
}

const shouldError = () => true

@injectIntl

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

@reduxForm({ form: 'transferAssetForm', shouldError, warn })

export default class WithdrawAsset extends Component {
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

  constructor(props) {
    super(props);
    this.updateTxid = ''
    this.showTip = false
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    selectContact: false,
    showSelectContact: false,
    selectedContactName: null,
    selectedContactAddress: null,
    selectedContactMemo: null,
    autoFocusToAddress: false,
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
      console.log(buttonId)
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
    ) {
      LayoutAnimation.easeInEaseOut()

      return {
        selectedContactName: (nextProps.selectedContact && nextProps.selectedContact.name),
        selectedContactAddress: (nextProps.selectedContact && nextProps.selectedContact.address),
        dataProvider: dataProvider.cloneWithRows(contactCells),
        extendedState: { selectedContact }
      }
    } else {
      return { dataProvider: dataProvider.cloneWithRows(contactCells), extendedState: { selectedContact } }
    }
  }

  componentWillUnmount() {
    this.props.reset()
  }

  submit = (data) => {
    const { intl, formSyncWarnings } = this.props

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

    const { withdrawAssetInfo, activeWallet, formValues } = this.props

    if (formValues && typeof formValues === 'object') {
      const password = this.state.password

      this.props.actions.withdrawAsset.requested({
        ...formValues,
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

  onModalHide = () => {
    const error = this.props.transfer.error

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
      this.setState({ selectContact: true })
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
          {
            text: t(this,'add'),
            onPress: () => {
              Navigation.push(this.props.componentId, {
                component: {
                  name: 'BitPortal.EditContact',
                  options: {
                    topBar: {
                      title: {
                        text: t(this,'contact_create')
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

  showRioChainTip = () => {
    Alert.alert(
      t(this,'gas_fee'),
      t(this,'tx_caution_riochain_confirmation'),
      [
        { text: t(this,'button_ok'), onPress: () => console.log('OK Pressed') }
      ]
    )
  }

  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  renderItem = (type, data) => {
    const { activeWallet } = this.props
    const chain = activeWallet.chain

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

    const {activeWallet, withdrawAsset, formValues, change, assetBalance, walletBalance, intl, contacts, selectedContact } = this.props
    const balance =  assetBalance.symbol === 'RFUEL' ? walletBalance : assetBalance
    const loading = withdrawAsset.loading
    const toAddress = formValues && formValues.toAddress
    const memo = formValues && formValues.memo
    const amount = formValues && formValues.amount
    const symbol =  balance.symbol || ''
    const contract = balance.contract
    const available = balance && intl.formatNumber(balance.balance, { minimumFractionDigits: 0, maximumFractionDigits: balance.precision })
    const chain = activeWallet.chain
    let rio_icon = rioTokenIcons[(symbol || '').toLowerCase()]

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ backgroundColor: 'white' }}
      >
        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#673AB7', width: '100%', elevation: 4, paddingBottom: 32 }}>
            <View style={{ width: '100%', paddingLeft: 16, paddingBottom: 6 }}>
              <Text style={{ color: 'white', fontSize: 24 }}>{t(this,'send_token_symbol',{symbol})}</Text>
            </View>
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
            />
          </View>
          <Field
            label={intl.formatMessage({ id: 'send_input_label_payer_account' })}
            placeholder=""
            name="card"
            fieldName="card"
            component={CardField}
            symbol={getExternalChainSymbol(symbol.toUpperCase())}
            available={available}
            chain={chain}
            iconUrl={ rio_icon }
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
          <View style={{width:'100%',paddingHorizontal:16}}>
            <View style={{width:'100%',justifyContent:'space-between',flexDirection:'row',alignItems:'center',marginTop:15,}}>
              <Text style={{ fontSize: 15, color:'black'}}>{t(this,'gas_fee')}</Text>
              <Text style={{ fontSize: 15, color:'rgba(0,0,0,0.4)', textAlign: 'right' }}>{'0.1 RFUEL'}</Text>
            </View>
            <View style={{width:'100%',justifyContent:'space-between',flexDirection:'row',alignItems:'center',marginTop:15,}}>
              <Text style={{ fontSize: 15, color:'black' }}>{t(this,'asset_withdraw_network_fee')}</Text>
              <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.4)', textAlign: 'right' }}>{getExternalChainFee(symbol.toUpperCase())} {getExternalChainSymbol(symbol.toUpperCase())}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:15,marginBottom:10,marginRight:21}}>
              <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', textAlign: 'left'}}>
                {t(this,'asset_withdraw_tip')}
              </Text>
              <TouchableHighlight
                underlayColor={'white'}
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
                <Text style={{ fontSize: 20, color: 'rgba(0,0,0,0.87)', fontWeight: '500' }}>{t(this,'contact_select')}</Text>
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
                <Text style={{ fontSize: 20, color: 'black', marginBottom: 12 }}>{t(this,'pwd_enter')}</Text>
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
        <IndicatorModal onModalHide={this.onModalHide} isVisible={loading} message={intl.formatMessage({ id: 'transfer_alert_sending_transaction' })} />
      </ScrollView>
    )
  }
}
