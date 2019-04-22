import React, { Component } from 'react'
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
  AlertIOS,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  LayoutAnimation,
  ActionSheetIOS
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { transferWalletSelector } from 'selectors/wallet'
import { transferWalletBalanceSelector } from 'selectors/balance'
import { Navigation } from 'react-native-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import * as transactionActions from 'actions/transaction'
import * as balanceActions from 'actions/balance'
import Modal from 'react-native-modal'
import { assetIcons } from 'resources/images'

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
    backgroundColor: 'white',
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
      return '转账失败'
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

const TextField = ({
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
  contact
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: showContact ? 64 : 42, paddingLeft: 16, paddingRight: 16, flexDirection: 'row', backgroundColor: '#F7F7F7' }}>
    {!showContact && <TextInput
      style={styles.textFiled}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      keyboardType="default"
      autoCapitalize='none'
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
             <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 5 }} activeOpacity={0.8} onPress={clearContact}>
               <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: 'white' }}>
                 <FastImage
                   source={require('resources/images/remove_red.png')}
                   style={{ width: 18, height: 18 }}
                 />
               </View>
             </TouchableHighlight>
           </View>
         </View>
         <View>
           <Text style={{ fontSize: 17 }} lineOfNumebrs={1}>{contact.name}</Text>
           <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginTop: 2 }} lineOfNumebrs={1}>{formatAddress(contact.address)}</Text>
         </View>
       </View>
     )
    }
    <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 30, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={selectContact}>
        <FastImage
          source={require('resources/images/select_address.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableHighlight>
    </View>
    {!showContact && showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 50, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 16, left: showContact ? 72 : 16, backgroundColor: '#C8C7CC' }} />}
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
  showClearButton
}) => (
  <View style={{ width: '100%', alignItems: 'flex-start', height: 104, paddingLeft: 16, paddingRight: 16, paddingTop: 16, flexDirection: 'row', backgroundColor: '#F7F7F7', borderBottomWidth: 0.5, borderBottomColor: '#C8C7CC' }}>
    <TextInput
      style={styles.messageFiled}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      keyboardType="default"
      autoCapitalize='none'
      multiline={true}
      secureTextEntry={secureTextEntry}
      {...restInput}
    />
    {showClearButton && active && <View style={{ height: 30, position: 'absolute', right: 22, bottom: 14, width: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
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
  showClearButton
}) => (
  <View style={{ width: '100%' }}>
    <View style={{ width: '100%', alignItems: 'flex-start', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.4)', marginTop: 20 }}>{label}</Text>
    </View>
    <View style={{ width: '100%', alignItems: 'center', height: 72, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <TextInput
        style={[styles.amountFiled, (!!valueLength && valueLength > 10) ? { fontSize: 40 } : {}]}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        onChangeText={onChange}
        keyboardType="numeric"
        autoCapitalize='none'
        secureTextEntry={secureTextEntry}
        {...restInput}
      />
      {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
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
  separator
}) => (
  <View style={{ width: '100%' }}>
    <View style={{ width: '100%', alignItems: 'flex-start', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.4)', marginTop: 20 }}>{label}</Text>
    </View>
    <View style={{ width: '100%', alignItems: 'center', height: 72, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
      {!!chain && <FastImage
        source={assetIcons[chain.toLowerCase()]}
        style={{ width: 40, height: 40, marginRight: 16, borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
      />}
      <View>
        <Text style={{ fontSize: 17 }}>{formatAddress(address)}</Text>
        <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginTop: 4 }}>{available} {symbol}</Text>
      </View>
    </View>
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 16, left: 72, backgroundColor: '#C8C7CC' }} />}
  </View>
)

const warn = (values, props) => {
  const warnings = {}
  const { balance } = props
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
    activeWallet: transferWalletSelector(state),
    balance: transferWalletBalanceSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions,
      ...balanceActions
    }, dispatch)
  })
)

@reduxForm({ form: 'transferAssetForm', shouldError, warn })

export default class TransferAsset extends Component {
  static get options() {
    return {
      topBar: {
        noBorder: true,
        backButton: {
          title: '返回'
        },
        rightButtons: [
          {
            id: 'scanQrCode',
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
  state = { showContact: true, presetContact: false, defaultMemo: null }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissAllModals()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.presetContact !== prevState.presetContact) {
      return { presetContact: nextProps.presetContact, defaultMemo: nextProps.contact && nextProps.contact.memo }
    } else {
      return null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showContact !== this.state.showContact) {
      LayoutAnimation.easeInEaseOut()
    }
  }

  componentWillUnmount() {
    this.props.reset()
  }

  submit = (data) => {
    const { activeWallet, formSyncWarnings, balance } = this.props
    if (typeof formSyncWarnings === 'object') {
      const warning = formSyncWarnings.toAddress || formSyncWarnings.amount
      if (warning) {
        Alert.alert(
          warning,
          '',
          [
            { text: '确定', onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }
    }
    // Keyboard.dismiss()

    AlertIOS.prompt(
      '请输入钱包密码',
      null,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: '确认',
          onPress: password => this.props.actions.transfer.requested({
            ...data,
            password,
            fromAddress: activeWallet.address,
            chain: activeWallet.chain,
            id: activeWallet.id,
            feeRate: 35,
            symbol: balance.symbol,
            precision: balance.precision,
            contract: balance.contract,
            componentId: this.props.componentId,
            memo: data.memo || this.state.defaultMemo
          })
        }
      ],
      'secure-text'
    )
  }

  componentDidAppear() {
    if (this.props.presetContact && this.props.contact && this.props.contact.address) {
      this.props.change('toAddress', this.props.contact.address)
    }

    this.props.actions.getBalance.requested(this.props.activeWallet)
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
            { text: '确定', onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  selectContact = () => {
    this.setState({ showContact: true })
  }

  clearContact = () => {
    this.setState({ showContact: false })
    this.props.change('toAddress', null)
  }

  switchFeesType = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      title: '选择矿工费',
      options: ['取消', `普通: 35 sat/b`, `优先: 45 sat/b`, `自定义手续费 (sat/b)`],
      cancelButtonIndex: 0,
    }, (buttonIndex) => {
      if (buttonIndex === 1) {

      } else if (buttonIndex === 2) {

      } else if (buttonIndex === 3) {

      } else {

      }
    })
  }

  showFeesTip = () => {
    Alert.alert(
      '矿工费',
      'Miner fees are a fee that spenders may include in any Bitcoin on-chain transaction. The fee may be collected by the miner who includes the transaction in a block',
      [
        { text: '确定', onPress: () => console.log('OK Pressed') }
      ]
    )
  }

  render() {
    const { transfer, formValues, change, activeWallet, balance, intl, contact, presetContact } = this.props
    const loading = transfer.loading
    const toAddress = formValues && formValues.toAddress
    const memo = formValues && formValues.memo
    const amount = formValues && formValues.amount
    const symbol = activeWallet.symbol
    const available = balance && intl.formatNumber(balance.balance, { minimumFractionDigits: balance.precision, maximumFractionDigits: balance.precision })
    const chain = activeWallet.chain

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: 'white' }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ backgroundColor: 'white' }}
      >
        <View style={{ flex: 1, width: '100%', alignItems: 'center', borderTopWidth: 0, borderBottomWidth: 0, borderColor: '#C8C7CC' }}>
          <Field
            label="地址"
            placeholder={`请输入${symbol}地址`}
            name="toAddress"
            fieldName="toAddress"
            component={TextField}
            showClearButton={!!toAddress && toAddress.length > 0}
            change={change}
            separator
            showContact={this.state.showContact && this.state.presetContact}
            selectContact={this.selectContact}
            clearContact={this.clearContact}
            contact={contact}
          />
          <Field
            label="备注"
            placeholder={(this.state.showContact && this.state.presetContact && !!this.state.defaultMemo) ? `选填，默认为: ${this.state.defaultMemo}` : '添加备注 (选填)'}
            name="memo"
            fieldName="memo"
            component={MessageField}
            showClearButton={!!memo && memo.length > 0}
            change={change}
            separator
          />
          <Field
            label="当前帐号"
            placeholder=""
            name="card"
            fieldName="card"
            component={CardField}
            address={activeWallet.address}
            available={available}
            symbol={symbol}
            chain={chain}
            separator
          />
          <Field
            label="金额"
            placeholder="00.00"
            name="amount"
            fieldName="amount"
            component={AmountField}
            showClearButton={!!amount && amount.length > 0}
            change={change}
            valueLength={!!amount && amount.length}
            separator
          />
          <View style={{ flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingLeft: 16, paddingRight: 16 }}>
            <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
              <Text style={{ fontSize: 15 }}>矿工费</Text>
              <TouchableHighlight
                underlayColor="white"
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
              underlayColor="white"
              activeOpacity={0.42}
              onPress={this.switchFeesType}
              style={{ height: 50, alignItems: 'center' }}
            >
              <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.4)' }}>35 sat/b</Text>
                <FastImage
                  source={require('resources/images/arrow_right_grey.png')}
                  style={{ width: 14, height: 14 }}
                />
              </View>
            </TouchableHighlight>
          </View>
          <View style={{ width: '100%', paddingLeft: 16, paddingRight: 16, marginTop: 4, marginBottom: 20 }}>
            <TouchableHighlight
              underlayColor="#007AFF"
              activeOpacity={0.9}
              onPress={this.props.handleSubmit(this.submit)}
              style={{ backgroundColor: '#007AFF', borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 17 }}>发送</Text>
            </TouchableHighlight>
          </View>
        </View>
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
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>交易发送中...</Text>
            </View>
          </View>}
        </Modal>
      </ScrollView>
    )
  }
}
