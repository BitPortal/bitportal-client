import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedNumber } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  SegmentedControlIOS,
  TouchableHighlight,
  Keyboard,
  Alert,
  ActivityIndicator,
  Dimensions,
  Clipboard,
  SafeAreaView
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode-svg'
import { formatCycleTime, formatMemorySize } from 'utils/format'
import { eosRAMPriceSelector } from 'selectors/ticker'
import { managingWalletBalanceSelector } from 'selectors/balance'
import { managingAccountSelector } from 'selectors/account'
import {
  managingAccountTotalResourcesSelector,
  managingAccountSelfDelegatedBandwidthSelector,
  managingAccountOthersDelegatedBandwidthSelector
} from 'selectors/account'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as tickerActions from 'actions/ticker'
import * as transactionActions from 'actions/transaction'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
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
    fontSize: 17,
    width: '100% - 138'
  },
  textAreaFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 52'
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

const TextField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  placeholder,
  separator,
  secureTextEntry,
  fieldName,
  change,
  showClearButton,
  keyboardType
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <Text style={{ fontSize: 17, marginRight: 16, width: 70 }}>{label}</Text>
    <TextInput
      style={styles.textFiled}
      autoCorrect={false}
      keyboardType={keyboardType || 'default'}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      secureTextEntry={secureTextEntry}
      {...restInput}
    />
    {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 20, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />}
  </View>
)

const TextAreaField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  placeholder,
  fieldName,
  change,
  showClearButton
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <TextInput
      style={styles.textAreaFiled}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      {...restInput}
    />
    {showClearButton && active && <View style={{ position: 'absolute', right: 13, top: 0, width: 20, height: 44, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
  </View>
)

export const errorMessages = (error) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return '密码错误'
    case 'EOS System Error':
      return 'EOS系统错误'
    default:
      return '操作失败'
  }
}

export const errorDetail = (error) => {
  if (!error) { return null }

  const detail = typeof error === 'object' ? error.detail : ''

  return detail
}

const validate = (values) => {
  const errors = {}

  if (!values.buyRAMAmount) {
    errors.buyRAMAmount = '请输入RAM数量'
  }

  if (!values.sellRAMAmount) {
    errors.sellRAMAmount = '请输入RAM数量'
  }

  if (!values.delegateCPUAmount) {
    errors.delegateCPUAmount = '请输入CPU数量'
  }

  if (!values.undelegateCPUAmount) {
    errors.undelegateCPUAmount = '请输入CPU数量'
  }

  if (!values.delegateNETAmount) {
    errors.delegateNETAmount = '请输入NET数量'
  }

  if (!values.undelegateNETAmount) {
    errors.undelegateNETAmount = '请输入NET数量'
  }

  return errors
}

const warn = (values, props) => {
  const warnings = {}
  const { selfDelegatedBandwidth, othersDelegatedBandwidth, balance, account } = props
  const eosBalance = balance ? +balance.balance : 0
  const ramBytes = account ? account.ram_quota - account.ram_usage : 0

  if (isNaN(values.buyRAMAmount)) {
    warnings.buyRAMAmount = '无效的RAM数量'
  } else if (+eosBalance < +values.buyRAMAmount) {
    warnings.buyRAMAmount = 'EOS余额不足'
  }

  if (isNaN(values.sellRAMAmount)) {
    warnings.sellRAMAmount = '无效的RAM数量'
  } else if (+ramBytes < +values.sellRAMAmount) {
    warnings.sellRAMAmount = 'RAM余额不足'
  }

  if (isNaN(values.delegateCPUAmount)) {
    warnings.delegateCPUAmount = '无效的CPU数量'
  } else if (+eosBalance < +values.delegateCPUAmount + +values.delegateNETAmount) {
    warnings.delegateCPUAmount = 'EOS余额不足'
  }

  if (isNaN(values.delegateNETAmount)) {
    warnings.delegateNETAmount = '无效的CPU数量'
  }

  if (isNaN(values.undelegateCPUAmount)) {
    warnings.undelegateCPUAmount = '无效的CPU数量'
  }  else if (!selfDelegatedBandwidth || +selfDelegatedBandwidth.cpu_weight.split(' ')[0] < +values.undelegateCPUAmount) {
    warnings.undelegateCPUAmount = '可赎回CPU数量不足'
  }

  if (isNaN(values.undelegateNETAmount)) {
    warnings.undelegateNETAmount = '无效的NET数量'
  }  else if (!selfDelegatedBandwidth || +selfDelegatedBandwidth.net_weight.split(' ')[0] < +values.undelegateNETAmount) {
    warnings.undelegateNETAmount = '可赎回NET数量不足'
  }

  return warnings
}

const shouldError = () => true

@injectIntl

@connect(
  state => ({
    getAccount: state.getAccount,
    buyRAM: state.buyRAM,
    sellRAM: state.sellRAM,
    delegateBW: state.delegateBW,
    undelegateBW: state.undelegateBW,
    formSyncWarnings: getFormSyncWarnings('manageEOSResourcesForm')(state),
    formValues: getFormValues('manageEOSResourcesForm')(state),
    ramPrice: eosRAMPriceSelector(state),
    account: managingAccountSelector(state),
    totalResources: managingAccountTotalResourcesSelector(state),
    selfDelegatedBandwidth: managingAccountSelfDelegatedBandwidthSelector(state),
    othersDelegatedBandwidth: managingAccountOthersDelegatedBandwidthSelector(state),
    balance: managingWalletBalanceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
      ...tickerActions,
      ...transactionActions
    }, dispatch)
  })
)

@reduxForm({ form: 'manageEOSResourcesForm', validate, shouldError, warn })

export default class ManageEOSResource extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'submit',
            text: '确认',
            fontWeight: '400',
            enabled: false
          }
        ],
        largeTitle: {
          visible: false
        },
        backButton: {
          title: '返回'
        },
        title: {
          text: 'EOS资源管理'
        },
        noBorder: false,
        drawBehind: false
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.buyRAM.loading !== prevState.buyRAMLoading
      || nextProps.buyRAM.error !== prevState.buyRAMError
      || nextProps.sellRAM.loading !== prevState.sellRAMLoading
      || nextProps.sellRAM.error !== prevState.sellRAMError
      || nextProps.delegateBW.loading !== prevState.delegateBWLoading
      || nextProps.delegateBW.error !== prevState.delegateBWError
      || nextProps.undelegateBW.loading !== prevState.undelegateBWLoading
      || nextProps.undelegateBW.error !== prevState.undelegateBWError
      || nextProps.getAccount.loading !== prevState.getAccountLoading
      || nextProps.getAccount.loaded !== prevState.getAccountLoaded
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        buyRAMLoading: nextProps.buyRAM.loading,
        buyRAMError: nextProps.buyRAM.error,
        sellRAMLoading: nextProps.sellRAM.loading,
        sellRAMError: nextProps.sellRAM.error,
        delegateBWLoading: nextProps.delegateBW.loading,
        delegateBWError: nextProps.delegateBW.error,
        undelegateBWLoading: nextProps.undelegateBW.loading,
        undelegateBWError: nextProps.undelegateBW.error,
        getAccountLoading: nextProps.getAccount.loading,
        getAccountLoaded: nextProps.getAccount.loaded
      }
    } else {
      return null
    }
  }

  state = {
    buyRAMLoading: false,
    buyRAMError: null,
    sellRAMLoading: false,
    sellRAMError: null,
    delegateBWLoading: false,
    delegateBWError: null,
    undelegateBWLoading: false,
    undelegateBWError: null,
    getAccountLoading: false,
    getAccountLoaded: false,

    selectedIndex: 0,
    buy: true,
    delegate: true,

    invalid: false,
    pristine: false,
    showModal: false,
    showModalContent: false
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    const { intl } = this.props
    if (buttonId === 'submit') {
      const { formSyncWarnings } = this.props
      if (typeof formSyncWarnings === 'object') {
        let warning

        if (!this.state.selectedIndex) {
          if (this.state.buy) {
            warning = formSyncWarnings.buyRAMAmount
          } else {
            warning = formSyncWarnings.sellRAMAmount
          }
        } else {
          if (this.state.delegate) {
            warning = formSyncWarnings.delegateCPUAmount || formSyncWarnings.delegateNETAmount
          } else {
            warning = formSyncWarnings.undelegateCPUAmount || formSyncWarnings.undelegateNETAmount
          }
        }

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

      Keyboard.dismiss()

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
            onPress: (password) => {
              const accountName = this.props.account.account_name
              const chain = this.props.chain
              const id = this.props.walletId
              const formValues = this.props.formValues

              if (!this.state.selectedIndex) {
                if (this.state.buy) {
                  this.props.actions.buyRAM.requested({
                    chain,
                    id,
                    accountName,
                    receiver: formValues.receiver,
                    ramAmount: formValues.buyRAMAmount,
                    password
                  })
                } else {
                  this.props.actions.sellRAM.requested({
                    chain,
                    id,
                    accountName,
                    receiver: formValues.receiver,
                    ramAmount: formValues.sellRAMAmount,
                    password
                  })
                }
              } else {
                if (this.state.delegate) {
                  this.props.actions.delegateBW.requested({
                    chain,
                    id,
                    accountName,
                    receiver: formValues.receiver,
                    cpuAmount: formValues.delegateCPUAmount,
                    netAmount: formValues.delegateNETAmount,
                    password
                  })
                } else {
                  this.props.actions.undelegateBW.requested({
                    chain,
                    id,
                    accountName,
                    receiver: formValues.receiver,
                    cpuAmount: formValues.undelegateCPUAmount,
                    netAmount: formValues.undelegateNETAmount,
                    password
                  })
                }
              }
            }
          }
        ],
        'secure-text'
      )
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.selectedIndex !== this.state.selectedIndex
      || prevState.buyRAMLoading !== this.state.buyRAMLoading
      || prevState.sellRAMLoading !== this.state.sellRAMLoading
      || prevState.delegateBWLoading !== this.state.delegateBWLoading
      || prevState.undelegateBWLoading !== this.state.undelegateBWLoading
      || prevState.getAccountLoading !== this.state.getAccountLoading
      || prevState.getAccountLoaded !== this.state.getAccountLoaded
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'submit',
              text: '确认',
              fontWeight: '400',
              enabled: !this.state.invalid && !this.state.pristine && !this.state.buyRAMLoading && !this.state.sellRAMLoading && !this.state.delegateBWLoading && !this.state.undelegateBWLoading
            }
          ],
          noBorder: !(!this.state.getAccountLoaded && this.state.getAccountLoading)
        }
      })
    }
  }

  componentDidMount() {
    this.props.actions.getEOSRAMTicker.requested()

    if (!this.props.account && this.props.address && this.props.chain) {
      this.props.actions.getAccount.requested({ chain: this.props.chain, address: this.props.address })
    }
  }

  copy = (text) => {
    this.setState({ showModal: true, showModalContent: true }, () => {
      Clipboard.setString(text)

      setTimeout(() => {
        this.setState({ showModal: false }, () => {
          this.setState({ showModalContent: false })
        })
      }, 1000)
    })
  }

  clearError = () => {
    this.props.actions.buyRAM.clearError()
    this.props.actions.sellRAM.clearError()
    this.props.actions.delegateBW.clearError()
    this.props.actions.undelegateBW.clearError()
  }

  onModalHide = () => {
    const error = this.state.buyRAMError || this.state.sellRAMError || this.state.delegateBWError || this.state.undelegateBWError

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
    } else {
      setTimeout(() => {
        Alert.alert(
          '操作成功',
          '',
          [
            { text: '确定', onPress: () => {} }
          ]
        )
      }, 20)
    }
  }

  changeSelectedIndex = (e) => {
    this.setState({ selectedIndex: e.nativeEvent.selectedSegmentIndex })
  }

  toggleRAM = (buy) => {
    this.setState({ buy })
  }

  toggleBandWidth = (delegate) => {
    this.setState({ delegate })
  }

  render() {
    const { formValues, change, account, ramPrice, totalResources, selfDelegatedBandwidth, othersDelegatedBandwidth, balance, getAccount } = this.props
    const receiver = formValues && formValues.receiver
    const buyRAMAmount = formValues && formValues.buyRAMAmount
    const sellRAMAmount = formValues && formValues.sellRAMAmount
    const delegateCPUAmount = formValues && formValues.delegateCPUAmount
    const undelegateCPUAmount = formValues && formValues.undelegateCPUAmount
    const delegateNETAmount = formValues && formValues.delegateNETAmount
    const undelegateNETAmount = formValues && formValues.undelegateNETAmount

    if ((!getAccount.loaded && getAccount.loading) || !account) {
      return (
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator size="small" color="#000000" />
            <Text style={{ fontSize: 17, marginLeft: 5 }}>获取账户信息中...</Text>
          </View>
        </View>
      )
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ height: 52, width: '100%', justifyContent: 'center', paddingTop: 5, paddingBottom: 13, paddingLeft: 16, paddingRight: 16, backgroundColor: '#F7F7F7', borderColor: '#C8C7CC', borderBottomWidth: 0.5 }}>
          <SegmentedControlIOS
            values={['RAM', 'CPU/NET']}
            selectedIndex={this.state.selectedIndex}
            onChange={this.changeSelectedIndex}
            style={{ width: '100%' }}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            {this.state.selectedIndex === 0 && <Fragment>
              <View style={{ width: '100%', height: 30 }} />
              <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: 'white' }}>
                <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 12, paddingBottom: 10 , paddingLeft: 16, paddingRight: 16 }}>
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17 }}>RAM</Text>
                    <Text style={{ fontSize: 17, color: '#666666' }}>已使用{formatMemorySize(account.ram_quota)}中的{formatMemorySize(account.ram_usage)}</Text>
                  </View>
                  <View style={{ width: '100%', backgroundColor: '#E5E5EA', height: 18, marginTop: 8, borderRadius: 4, flexDirection: 'row' }}>
                    <View style={{ width: !!account.ram_quota ? ((1 - account.ram_usage/account.ram_quota) * (Dimensions.get('window').width - 32) - +(account.ram_quota !== account.ram_usage)) : 0, height: '100%', backgroundColor: 'rgb(255,59,48)', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }} />
                    {account.ram_quota !== account.ram_usage && <View style={{ height: '100%', width: 1, backgroundColor: 'white' }} />}
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <Text>
                      当前价格: {typeof ramPrice === 'number' ? <FormattedNumber
                        value={ramPrice}
                        maximumFractionDigits={5}
                        minimumFractionDigits={5}
                      /> : '--'} EOS/KB
                    </Text>
                  </View>
                </View>
              </View>
            </Fragment>}
            {this.state.selectedIndex === 1 && <Fragment>
              <View style={{ width: '100%', height: 30 }} />
              <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: 'white' }}>
                <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 12, paddingBottom: 10 , paddingLeft: 16, paddingRight: 16 }}>
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17 }}>CPU</Text>
                    <Text style={{ fontSize: 17, color: '#666666' }}>已使用{formatCycleTime(account.cpu_limit.max)}中的{formatCycleTime(account.cpu_limit.used)}</Text>
                  </View>
                  <View style={{ width: '100%', backgroundColor: '#E5E5EA', height: 18, marginTop: 8, borderRadius: 4, flexDirection: 'row' }}>
                    <View style={{ width: !!account.cpu_limit.max ? ((account.cpu_limit.available/account.cpu_limit.max) * (Dimensions.get('window').width - 32) - +(account.cpu_limit.available !== account.cpu_limit.max)) : 0, height: '100%', backgroundColor: 'rgb(255,204,0)', borderTopLeftRadius: 4, borderBottomLeftRadius: 4, borderTopRightRadius: account.cpu_limit.available === account.cpu_limit.max ? 4 : 0, borderBottomRightRadius: account.cpu_limit.available === account.cpu_limit.max ? 4 : 0 }} />
                    {account.cpu_limit.available !== account.cpu_limit.max && <View style={{ height: '100%', width: 1, backgroundColor: 'white' }} />}
                  </View>
                  <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <Text>自己抵押: {selfDelegatedBandwidth ? <FormattedNumber value={selfDelegatedBandwidth.cpu_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS </Text>
                    <Text>他人抵押: {othersDelegatedBandwidth ? <FormattedNumber value={othersDelegatedBandwidth.cpu_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS</Text>
                  </View>
                </View>
                <View style={{ position: 'absolute', left: 16, right: 0, bottom: 0, height: 0.5, backgroundColor: '#C8C7CC' }} />
              </View>
              <View style={{ width: '100%', alignItems: 'center', borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: 'white' }}>
                <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 12, paddingBottom: 10 , paddingLeft: 16, paddingRight: 16 }}>
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17 }}>NET</Text>
                    <Text style={{ fontSize: 17, color: '#666666' }}>已使用{formatMemorySize(account.net_limit.max)}中的{formatMemorySize(account.net_limit.used)}</Text>
                  </View>
                  <View style={{ width: '100%', backgroundColor: '#E5E5EA', height: 18, marginTop: 8, borderRadius: 4, flexDirection: 'row' }}>
                    <View style={{ width: !!account.net_limit.max ? ((account.net_limit.available/account.net_limit.max) * (Dimensions.get('window').width - 32) - +(account.net_limit.available !== account.net_limit.max)) : 0, height: '100%', backgroundColor: 'rgb(76,217,100)', borderTopLeftRadius: 4, borderBottomLeftRadius: 4, borderTopRightRadius: account.net_limit.available === account.net_limit.max ? 4 : 0, borderBottomRightRadius: account.net_limit.available === account.net_limit.max ? 4 : 0 }} />
                    {account.net_limit.available !== account.net_limit.max && <View style={{ height: '100%', width: 1, backgroundColor: 'white' }} />}
                  </View>
                  <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <Text>自己抵押: {selfDelegatedBandwidth ? <FormattedNumber value={selfDelegatedBandwidth.net_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS </Text>
                    <Text>他人抵押: {othersDelegatedBandwidth ? <FormattedNumber value={othersDelegatedBandwidth.net_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS</Text>
                  </View>
                </View>
              </View>
            </Fragment>}
            <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 13, color: '#666666' }}>选择操作</Text>
            </View>
            <View style={{ width: '100%', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: 'white' }}>
              {this.state.selectedIndex === 0 && <Fragment>
                <TouchableHighlight underlayColor="#D9D9D9" style={{ width: '100%' }} onPress={this.toggleRAM.bind(this, true)}>
                  <View style={{ paddingTop: 8, paddingBottom: 8, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }}>
                    <View>
                      <Text style={{ fontSize: 17, marginBottom: 2 }}>买入 RAM</Text>
                      <Text style={{ fontSize: 15, color: '#666666' }}>
                        最多可买入 {balance ? <FormattedNumber value={balance.balance} maximumFractionDigits={4} minimumFractionDigits={4} /> : '--'} EOS
                      </Text>
                    </View>
                    {this.state.buy && <FastImage source={require('resources/images/radio_checked.png')} style={{ width: 24, height: 24 }} />}
                    {!this.state.buy && <FastImage source={require('resources/images/radio_unchecked.png')} style={{ width: 24, height: 24 }} />}
                    <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />
                  </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#D9D9D9" style={{ width: '100%' }} onPress={this.toggleRAM.bind(this, false)}>
                  <View style={{ paddingTop: 8, paddingBottom: 8, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }}>
                    <View>
                      <Text style={{ fontSize: 17, marginBottom: 2 }}>卖出 RAM</Text>
                      <Text style={{ fontSize: 15, color: '#666666' }}>
                        最多可卖出 {account ? `${account.ram_quota - account.ram_usage} bytes` : '-- byte' }
                      </Text>
                    </View>
                    {this.state.buy && <FastImage source={require('resources/images/radio_unchecked.png')} style={{ width: 24, height: 24 }} />}
                    {!this.state.buy && <FastImage source={require('resources/images/radio_checked.png')} style={{ width: 24, height: 24 }} />}
                  </View>
                </TouchableHighlight>
              </Fragment>}
              {this.state.selectedIndex === 1 && <Fragment>
                <TouchableHighlight underlayColor="#D9D9D9" style={{ width: '100%' }} onPress={this.toggleBandWidth.bind(this, true)}>
                  <View style={{ paddingTop: 8, paddingBottom: 8, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }}>
                    <View>
                      <Text style={{ fontSize: 17, marginBottom: 2 }}>抵押 CPU/NET</Text>
                      <Text style={{ fontSize: 15, color: '#666666' }}>
                        最多可抵押 {balance ? <FormattedNumber value={balance.balance} maximumFractionDigits={4} minimumFractionDigits={4} /> : '--'} EOS
                      </Text>
                    </View>
                    {this.state.delegate && <FastImage source={require('resources/images/radio_checked.png')} style={{ width: 24, height: 24 }} />}
                    {!this.state.delegate && <FastImage source={require('resources/images/radio_unchecked.png')} style={{ width: 24, height: 24 }} />}
                    <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />
                  </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#D9D9D9" style={{ width: '100%' }} onPress={this.toggleBandWidth.bind(this, false)}>
                  <View style={{ paddingTop: 8, paddingBottom: 8, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }}>
                    <View style={{ width: Dimensions.get('window').width - 32 - 24 }}>
                      <Text style={{ fontSize: 17, marginBottom: 2 }}>赎回 CPU/NET</Text>
                      <Text style={{ fontSize: 15, color: '#666666' }}>
                        最多可赎回 CPU {selfDelegatedBandwidth ? <FormattedNumber value={selfDelegatedBandwidth.cpu_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS, NET {selfDelegatedBandwidth ? <FormattedNumber value={selfDelegatedBandwidth.net_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS
                      </Text>
                    </View>
                    {this.state.delegate && <FastImage source={require('resources/images/radio_unchecked.png')} style={{ width: 24, height: 24 }} />}
                    {!this.state.delegate && <FastImage source={require('resources/images/radio_checked.png')} style={{ width: 24, height: 24 }} />}
                  </View>
                </TouchableHighlight>
              </Fragment>}
            </View>
            <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
              {this.state.selectedIndex === 0 && !!this.state.buy && <Text style={{ fontSize: 13, color: '#666666' }}>买入信息</Text>}
              {this.state.selectedIndex === 0 && !this.state.buy && <Text style={{ fontSize: 13, color: '#666666' }}>卖出信息</Text>}
              {this.state.selectedIndex === 1 && !!this.state.delegate && <Text style={{ fontSize: 13, color: '#666666' }}>抵押信息</Text>}
              {this.state.selectedIndex === 1 && !this.state.delegate && <Text style={{ fontSize: 13, color: '#666666' }}>赎回信息</Text>}
            </View>
            <Fragment>
              <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: 'white', marginBottom: 35 }}>
                <View style={{ width: '100%', alignItems: 'center', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
                  {this.state.selectedIndex === 0 && !!this.state.buy && <Text style={{ fontSize: 17, marginRight: 16, width: 70 }}>支付账户</Text>}
                  {this.state.selectedIndex === 0 && !this.state.buy && <Text style={{ fontSize: 17, marginRight: 16, width: 70 }}>出售账户</Text>}
                  {this.state.selectedIndex === 1 && <Text style={{ fontSize: 17, marginRight: 16, width: 70 }}>发起账户</Text>}
                  <Text style={{ fontSize: 17, marginRight: 16 }}>{account.account_name}</Text>
                  <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />
                </View>
                {((this.state.selectedIndex === 0 && !!this.state.buy) || this.state.selectedIndex === 1) && (
                   <Field
                     label="接收账户"
                     placeholder="选填，默认为发起者自己"
                     name="receiver"
                     fieldName="receiver"
                     component={TextField}
                     change={change}
                     showClearButton={!!receiver && receiver.length > 0}
                     separator={true}
                   />
                 )}
                {this.state.selectedIndex === 0 && this.state.buy && (
                   <Field
                     label="买入数量"
                     placeholder="以 EOS 为单位"
                     name="buyRAMAmount"
                     fieldName="buyRAMAmount"
                     component={TextField}
                     change={change}
                     showClearButton={!!buyRAMAmount && buyRAMAmount.length > 0}
                     keyboardType="numeric"
                   />
                 )}
                {this.state.selectedIndex === 0 && !this.state.buy && (
                   <Field
                     label="卖出数量"
                     placeholder="以 Byte 为单位"
                     name="sellRAMAmount"
                     fieldName="sellRAMAmount"
                     component={TextField}
                     change={change}
                     showClearButton={!!sellRAMAmount && sellRAMAmount.length > 0}
                     keyboardType="numeric"
                   />
                 )}
                {this.state.selectedIndex === 1 && this.state.delegate && (
                   <Field
                     label="CPU数量"
                     placeholder="以 EOS 为单位"
                     name="delegateCPUAmount"
                     fieldName="delegateCPUAmount"
                     component={TextField}
                     change={change}
                     showClearButton={!!delegateCPUAmount && delegateCPUAmount.length > 0}
                     separator={true}
                     keyboardType="numeric"
                   />
                 )}
                {this.state.selectedIndex === 1 && !this.state.delegate && (
                   <Field
                     label="CPU数量"
                     placeholder="以 EOS 为单位"
                     name="undelegateCPUAmount"
                     fieldName="undelegateCPUAmount"
                     component={TextField}
                     change={change}
                     showClearButton={!!undelegateCPUAmount && undelegateCPUAmount.length > 0}
                     separator={true}
                     keyboardType="numeric"
                   />
                 )}
                {this.state.selectedIndex === 1 && this.state.delegate && (
                   <Field
                     label="NET数量"
                     placeholder="以 EOS 为单位"
                     name="delegateNETAmount"
                     fieldName="delegateNETAmount"
                     component={TextField}
                     change={change}
                     showClearButton={!!delegateNETAmount && delegateNETAmount.length > 0}
                     keyboardType="numeric"
                   />
                 )}
                {this.state.selectedIndex === 1 && !this.state.delegate && (
                   <Field
                     label="NET数量"
                     placeholder="以 EOS 为单位"
                     name="undelegateNETAmount"
                     fieldName="undelegateNETAmount"
                     component={TextField}
                     change={change}
                     showClearButton={!!undelegateNETAmount && undelegateNETAmount.length > 0}
                     keyboardType="numeric"
                   />
                 )}
              </View>
            </Fragment>
          </View>
        </ScrollView>
        <Modal
          isVisible={this.state.buyRAMLoading || this.state.sellRAMLoading || this.state.delegateBWLoading || this.state.undelegateBWLoading}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
          onModalHide={this.onModalHide}
          onModalShow={this.onModalShow}
        >
          {(this.state.buyRAMLoading || this.state.sellRAMLoading || this.state.delegateBWLoading || this.state.undelegateBWLoading) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#000000" />
              {this.state.buyRAMLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>买入中...</Text>}
              {this.state.sellRAMLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>卖出中...</Text>}
              {this.state.delegateBWLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>抵押中...</Text>}
              {this.state.undelegateBWLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>赎回中...</Text>}
            </View>
          </View>}
        </Modal>
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
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>已复制</Text>
            </View>
          </View>}
        </Modal>
      </View>
      </SafeAreaView>
    )
  }
}
