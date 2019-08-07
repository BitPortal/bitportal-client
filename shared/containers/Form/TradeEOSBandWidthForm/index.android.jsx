import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  SegmentedControlIOS,
  TouchableHighlight,
  TouchableNativeFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  Dimensions,
  Clipboard
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode-svg'
import { formatCycleTime, formatMemorySize } from 'utils/format'
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
import { FilledTextField } from 'components/Form'
import IndicatorModal from 'components/Modal/IndicatorModal'

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

const validate = (values, props) => {
  const errors = {}
  const { selfDelegatedBandwidth, othersDelegatedBandwidth, balance, account } = props
  const eosBalance = balance ? +balance.balance : 0
  const ramBytes = account ? account.ram_quota - account.ram_usage : 0

  if (!values.delegateCPUAmount) {
    errors.delegateCPUAmount = '请输入CPU数量'
  } else if (!+values.delegateCPUAmount) {
    errors.delegateCPUAmount = '无效的CPU数量'
  } else if (+eosBalance < +values.delegateCPUAmount + +values.delegateNETAmount) {
    errors.delegateCPUAmount = 'EOS余额不足'
  }

  if (!values.undelegateCPUAmount) {
    errors.undelegateCPUAmount = '请输入CPU数量'
  } else if (!+values.undelegateCPUAmount) {
    errors.undelegateCPUAmount = '无效的CPU数量'
  }  else if (!selfDelegatedBandwidth || +selfDelegatedBandwidth.cpu_weight.split(' ')[0] < +values.undelegateCPUAmount) {
    errors.undelegateCPUAmount = '可赎回CPU数量不足'
  }

  if (!values.delegateNETAmount) {
    errors.delegateNETAmount = '请输入NET数量'
  } else if (!+values.delegateNETAmount) {
    errors.delegateNETAmount = '无效的NET数量'
  }

  if (!values.undelegateNETAmount) {
    errors.undelegateNETAmount = '请输入NET数量'
  } else if (!+values.undelegateNETAmount) {
    errors.undelegateNETAmount = '无效的NET数量'
  }  else if (!selfDelegatedBandwidth || +selfDelegatedBandwidth.net_weight.split(' ')[0] < +values.undelegateNETAmount) {
    errors.undelegateNETAmount = '可赎回NET数量不足'
  }

  return errors
}

const warn = (values, props) => {
  const warnings = {}

  return warnings
}

const shouldError = () => true

@connect(
  state => ({
    delegateBW: state.delegateBW,
    undelegateBW: state.undelegateBW,
    formSyncWarnings: getFormSyncWarnings('tradeEOSBandWidthForm')(state),
    formValues: getFormValues('tradeEOSBandWidthForm')(state),
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

@reduxForm({ form: 'tradeEOSBandWidthForm', validate, shouldError, warn })

export default class TradeEOSBandWidthForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.delegateBW.loading !== prevState.delegateBWLoading
      || nextProps.delegateBW.error !== prevState.delegateBWError
      || nextProps.undelegateBW.loading !== prevState.undelegateBWLoading
      || nextProps.undelegateBW.error !== prevState.undelegateBWError
      || nextProps.activeIndex !== prevState.activeIndex
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        delegateBWLoading: nextProps.delegateBW.loading,
        delegateBWError: nextProps.delegateBW.error,
        undelegateBWLoading: nextProps.undelegateBW.loading,
        undelegateBWError: nextProps.undelegateBW.error,
        activeIndex: nextProps.activeIndex
      }
    } else {
      return null
    }
  }

  state = {
    delegateBWLoading: false,
    delegateBWError: null,
    undelegateBWLoading: false,
    undelegateBWError: null,

    activeIndex: null,
    delegate: true,

    invalid: false,
    pristine: false
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.delegateBWLoading !== this.state.delegateBWLoading
      || prevState.undelegateBWLoading !== this.state.undelegateBWLoading
      || (prevState.activeIndex !== this.state.activeIndex && this.state.activeIndex === 1)
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'submit',
              icon: require('resources/images/check_android.png'),
              enabled: !this.state.invalid && !this.state.pristine && !this.state.delegateBWLoading && !this.state.undelegateBWLoading
            }
          ]
        }
      })
    }
  }

  clearError = () => {
    this.props.actions.delegateBW.clearError()
    this.props.actions.undelegateBW.clearError()
  }

  onModalHide = () => {
    const error = this.state.delegateBWError || this.state.undelegateBWError

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

  toggleBandWidth = (delegate) => {
    if (this.props.toggleBandWidth) {
      this.props.toggleBandWidth(delegate)
    }
  }

  componentDidMount() {
    this.props.initialize({
      currentAccount: this.props.account.account_name
    })
  }

  render() {
    const { formValues, change, account, totalResources, selfDelegatedBandwidth, othersDelegatedBandwidth, balance } = this.props
    const currentAccount = formValues && formValues.currentAccount
    const receiver = formValues && formValues.receiver
    const delegateCPUAmount = formValues && formValues.delegateCPUAmount
    const undelegateCPUAmount = formValues && formValues.undelegateCPUAmount
    const delegateNETAmount = formValues && formValues.delegateNETAmount
    const undelegateNETAmount = formValues && formValues.undelegateNETAmount

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingTop: 0 }}>
            <View style={{ width: '100%', alignItems: 'center', paddingVertical: 8, backgroundColor: 'white' }}>
              <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 12, paddingBottom: 10 , paddingLeft: 16, paddingRight: 16 }}>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>CPU</Text>
                  <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>已使用{formatCycleTime(account.cpu_limit.max)}中的{formatCycleTime(account.cpu_limit.used)}</Text>
                </View>
                <View style={{ width: '100%', backgroundColor: '#E5E5EA', height: 4, marginTop: 8, flexDirection: 'row' }}>
                  <View style={{ width: !!account.cpu_limit.max ? ((account.cpu_limit.available/account.cpu_limit.max) * (Dimensions.get('window').width - 32) - +(account.cpu_limit.available !== account.cpu_limit.max)) : 0, height: '100%', backgroundColor: 'rgb(255,204,0)' }} />
                  {account.cpu_limit.available !== account.cpu_limit.max && <View style={{ height: '100%', width: 1, backgroundColor: 'white' }} />}
                </View>
                <View style={{ width: '100%', marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>自己抵押: {selfDelegatedBandwidth ? <FormattedNumber value={selfDelegatedBandwidth.cpu_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS </Text>
                  <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>他人抵押: {othersDelegatedBandwidth ? <FormattedNumber value={othersDelegatedBandwidth.cpu_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS</Text>
                </View>
              </View>

              <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 12, paddingBottom: 10 , paddingLeft: 16, paddingRight: 16 }}>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>NET</Text>
                  <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>已使用{formatMemorySize(account.net_limit.max)}中的{formatMemorySize(account.net_limit.used)}</Text>
                </View>
                <View style={{ width: '100%', backgroundColor: '#E5E5EA', height: 4, marginTop: 8, flexDirection: 'row' }}>
                  <View style={{ width: !!account.net_limit.max ? ((account.net_limit.available/account.net_limit.max) * (Dimensions.get('window').width - 32) - +(account.net_limit.available !== account.net_limit.max)) : 0, height: '100%', backgroundColor: 'rgb(76,217,100)' }} />
                  {account.net_limit.available !== account.net_limit.max && <View style={{ height: '100%', width: 1, backgroundColor: 'white' }} />}
                </View>
                <View style={{ width: '100%', marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>自己抵押: {selfDelegatedBandwidth ? <FormattedNumber value={selfDelegatedBandwidth.net_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS </Text>
                  <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>他人抵押: {othersDelegatedBandwidth ? <FormattedNumber value={othersDelegatedBandwidth.net_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS</Text>
                </View>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)', paddingBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 }}>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>选择操作</Text>
              </View>
              <TouchableNativeFeedback onPress={this.toggleBandWidth.bind(this, true)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 60 }}>
                  {this.props.delegate && <FastImage source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  {!this.props.delegate && <FastImage source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  <View>
                    <Text style={{ fontSize: 16, marginBottom: 2, color: 'rgba(0,0,0,0.87)' }}>抵押 CPU/NET</Text>
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>
                      最多可抵押 {balance ? <FormattedNumber value={balance.balance} maximumFractionDigits={4} minimumFractionDigits={4} /> : '--'} EOS
                    </Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={this.toggleBandWidth.bind(this, false)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 60 }}>
                  {!this.props.delegate && <FastImage source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  {this.props.delegate && <FastImage source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  <View>
                    <Text style={{ fontSize: 16, marginBottom: 2, color: 'rgba(0,0,0,0.87)' }}>赎回 CPU/NET</Text>
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>
                      最多可赎回 CPU {selfDelegatedBandwidth ? <FormattedNumber value={selfDelegatedBandwidth.cpu_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS, NET {selfDelegatedBandwidth ? <FormattedNumber value={selfDelegatedBandwidth.net_weight.split(' ')[0]} maximumFractionDigits={4} minimumFractionDigits={4} /> : '0.0000'} EOS
                    </Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
            </View>

            <View style={{ borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 }}>
                {!!this.props.delegate && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>抵押信息</Text>}
                {!this.props.delegate && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>赎回信息</Text>}
              </View>
            </View>
            <Field
              label="当前账户"
              placeholder={!!this.props.delegate ? '抵押发起者' : '赎回发起者'}
              name="currentAccount"
              fieldName="currentAccount"
              component={FilledTextField}
              change={change}
              nonEmpty={!!currentAccount && currentAccount.length > 0}
              editable={false}
            />
            <Field
              label="接收账户"
              placeholder="选填，默认为发起者自己"
              name="receiver"
              fieldName="receiver"
              component={FilledTextField}
              change={change}
              nonEmpty={!!receiver && receiver.length > 0}
            />
            {this.props.delegate && (
               <Field
                 label="CPU数量"
                 placeholder="以 EOS 为单位"
                 name="delegateCPUAmount"
                 fieldName="delegateCPUAmount"
                 component={FilledTextField}
                 change={change}
                 nonEmpty={!!delegateCPUAmount && delegateCPUAmount.length > 0}
                 keyboardType="numeric"
               />
             )}
                {!this.props.delegate && (
                   <Field
                     label="CPU数量"
                     placeholder="以 EOS 为单位"
                     name="undelegateCPUAmount"
                     fieldName="undelegateCPUAmount"
                     component={FilledTextField}
                     change={change}
                     nonEmpty={!!undelegateCPUAmount && undelegateCPUAmount.length > 0}
                     keyboardType="numeric"
                   />
                 )}
                {this.props.delegate && (
                   <Field
                     label="NET数量"
                     placeholder="以 EOS 为单位"
                     name="delegateNETAmount"
                     fieldName="delegateNETAmount"
                     component={FilledTextField}
                     change={change}
                     nonEmpty={!!delegateNETAmount && delegateNETAmount.length > 0}
                     keyboardType="numeric"
                   />
                 )}
                {!this.props.delegate && (
                   <Field
                     label="NET数量"
                     placeholder="以 EOS 为单位"
                     name="undelegateNETAmount"
                     fieldName="undelegateNETAmount"
                     component={FilledTextField}
                     change={change}
                     nonEmpty={!!undelegateNETAmount && undelegateNETAmount.length > 0}
                     keyboardType="numeric"
                   />
                 )}
          </View>
        </ScrollView>
        <IndicatorModal isVisible={this.state.delegateBWLoading || this.state.undelegateBWLoading} message={(this.state.delegateBWLoading && '抵押中...') || (this.state.undelegateBWLoading && '赎回中...')} onModalHide={this.onModalHide} onModalShow={this.onModalShow} />
      </View>
    )
  }
}
