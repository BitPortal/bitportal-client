import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { FormattedNumber, injectIntl } from 'react-intl'
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
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import { FilledTextField } from 'components/Form'
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
import IndicatorModal from 'components/Modal/IndicatorModal'

export const errorMessages = (error) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return gt('密码错误')
    case 'EOS System Error':
      return gt('EOS系统错误')
    default:
      return gt('操作失败')
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

  if (!values.buyRAMAmount) {
    errors.buyRAMAmount = gt('请输入RAM数量')
  } else if (!+values.buyRAMAmount) {
    errors.buyRAMAmount = gt('无效的RAM数量')
  } else if (+eosBalance < +values.buyRAMAmount) {
    errors.buyRAMAmount = gt('EOS余额不足')
  }

  if (!values.sellRAMAmount) {
    errors.sellRAMAmount = gt('请输入RAM数量')
  } else if (!+values.sellRAMAmount) {
    errors.sellRAMAmount = gt('无效的RAM数量')
  } else if (+ramBytes < +values.sellRAMAmount) {
    errors.sellRAMAmount = gt('RAM余额不足')
  }

  return errors
}

const warn = (values, props) => {
  const warnings = {}

  return warnings
}

const shouldError = () => true
@injectIntl
@connect(
  state => ({
    buyRAM: state.buyRAM,
    sellRAM: state.sellRAM,
    formSyncWarnings: getFormSyncWarnings('tradeEOSRAMForm')(state),
    formValues: getFormValues('tradeEOSRAMForm')(state),
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

@reduxForm({ form: 'tradeEOSRAMForm', validate, shouldError, warn })

export default class TradeEOSRAMForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.buyRAM.loading !== prevState.buyRAMLoading
      || nextProps.buyRAM.error !== prevState.buyRAMError
      || nextProps.sellRAM.loading !== prevState.sellRAMLoading
      || nextProps.sellRAM.error !== prevState.sellRAMError
      || nextProps.activeIndex !== prevState.activeIndex
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        buyRAMLoading: nextProps.buyRAM.loading,
        buyRAMError: nextProps.buyRAM.error,
        sellRAMLoading: nextProps.sellRAM.loading,
        sellRAMError: nextProps.sellRAM.error,
        activeIndex: nextProps.activeIndex
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

    activeIndex: null,

    invalid: false,
    pristine: false
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.selectedIndex !== this.state.selectedIndex
      || prevState.buyRAMLoading !== this.state.buyRAMLoading
      || prevState.sellRAMLoading !== this.state.sellRAMLoading
      || (prevState.activeIndex !== this.state.activeIndex && this.state.activeIndex === 0)
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'submit',
              icon: require('resources/images/check_android.png'),
              enabled: !this.state.invalid && !this.state.pristine && !this.state.buyRAMLoading && !this.state.sellRAMLoading
            }
          ]
        }
      })
    }
  }

  clearError = () => {
    this.props.actions.buyRAM.clearError()
    this.props.actions.sellRAM.clearError()
  }

  onModalHide = () => {
    const error = this.state.buyRAMError || this.state.sellRAMError

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          errorDetail(error),
          [
            { text: t(this,'确定'), onPress: () => this.clearError() }
          ]
        )
      }, 20)
    } else {
      setTimeout(() => {
        Alert.alert(
          t(this,'操作成功'),
          '',
          [
            { text: t(this,'确定'), onPress: () => {} }
          ]
        )
      }, 20)
    }
  }

  toggleRAM = (buy) => {
    if (this.props.toggleRAM) {
      this.props.toggleRAM(buy)
    }
  }

  componentDidMount() {
    this.props.initialize({
      currentAccount: this.props.account.account_name
    })
  }

  render() {
    const { formValues, change, account, ramPrice, totalResources, balance } = this.props
    const currentAccount = formValues && formValues.currentAccount
    const receiver = formValues && formValues.receiver
    const buyRAMAmount = formValues && formValues.buyRAMAmount
    const sellRAMAmount = formValues && formValues.sellRAMAmount

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
                  <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>RAM</Text>
                  <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>
                    {/*已使用{formatMemorySize(account.ram_quota)}中的{formatMemorySize(account.ram_usage)}*/}
                    {t(this,'已使用{value1}中的{value2}',{
                      value1:formatMemorySize(account.ram_quota),
                      value2:formatMemorySize(account.ram_usage)
                    })}
                  </Text>
                </View>
                <View style={{ width: '100%', backgroundColor: '#E5E5EA', height: 4, marginTop: 8, flexDirection: 'row' }}>
                  <View style={{ width: !!account.ram_quota ? ((1 - account.ram_usage/account.ram_quota) * (Dimensions.get('window').width - 32) - +(account.ram_quota !== account.ram_usage)) : 0, height: '100%', backgroundColor: 'rgb(255,59,48)' }} />
                  {account.ram_quota !== account.ram_usage && <View style={{ height: '100%', width: 1, backgroundColor: 'white' }} />}
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>{t(this,'当前价格')}: {typeof ramPrice === 'number' ? <FormattedNumber value={ramPrice} maximumFractionDigits={5} minimumFractionDigits={5} /> : '--'} EOS/KB</Text>
                </View>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)', paddingBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 }}>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,'operation_select')}</Text>
              </View>
              <TouchableNativeFeedback onPress={this.toggleRAM.bind(this, true)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 60 }}>
                  {this.props.buy && <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  {!this.props.buy && <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  <View>
                    <Text style={{ fontSize: 16, marginBottom: 2, color: 'rgba(0,0,0,0.87)' }}>{t(this,'买入 RAM')}</Text>
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>
                      {t(this,'最多可买入')} {balance ? <FormattedNumber value={balance.balance} maximumFractionDigits={4} minimumFractionDigits={4} /> : '--'} EOS
                    </Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={this.toggleRAM.bind(this, false)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 60 }}>
                  {!this.props.buy && <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  {this.props.buy && <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, marginRight: 32 }} />}
                  <View>
                    <Text style={{ fontSize: 16, marginBottom: 2, color: 'rgba(0,0,0,0.87)' }}>{t(this,'卖出 RAM')}</Text>
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>
                      {t(this,'最多可卖出')} {account ? `${account.ram_quota - account.ram_usage} bytes` : '-- byte' }
                    </Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={{ borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 }}>
                {!!this.props.buy && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,'买入信息')}</Text>}
                {!this.props.buy && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,'卖出信息')}</Text>}
              </View>
            </View>
            <Field
              label={t(this,'当前账户')}
              placeholder={!!this.props.buy ? t(this,'买入发起者') : t(this,'卖出发起者')}
              name="currentAccount"
              fieldName="currentAccount"
              component={FilledTextField}
              change={change}
              nonEmpty={!!currentAccount && currentAccount.length > 0}
              editable={false}
            />
            {this.props.buy && <Field
              label={t(this,'接收账户')}
              placeholder={t(this,'"选填，默认为发起者自己"')}
              name="receiver"
              fieldName="receiver"
              component={FilledTextField}
              change={change}
              nonEmpty={!!receiver && receiver.length > 0}
            />}
            {this.props.buy && (
               <Field
                 label={t(this,'买入数量')}
                 placeholder={t(this,'以 {value} 为单位',{value:'EOS'})}
                 name="buyRAMAmount"
                 fieldName="buyRAMAmount"
                 component={FilledTextField}
                 change={change}
                 nonEmpty={!!buyRAMAmount && buyRAMAmount.length > 0}
                 keyboardType="numeric"
               />
             )}
                {!this.props.buy && (
                   <Field
                     label={t(this,'卖出数量')}
                     placeholder={t(this,'以 {value} 为单位',{value:'Byte'})}
                     name="sellRAMAmount"
                     fieldName="sellRAMAmount"
                     component={FilledTextField}
                     change={change}
                     nonEmpty={!!sellRAMAmount && sellRAMAmount.length > 0}
                     keyboardType="numeric"
                   />
                 )}
          </View>
        </ScrollView>
        <IndicatorModal isVisible={this.state.buyRAMLoading || this.state.sellRAMLoading} message={(this.state.buyRAMLoading && t(this,'买入中...')) || (this.state.sellRAMLoading && t(this,'卖出中...'))} onModalHide={this.onModalHide} onModalShow={this.onModalShow} />
      </View>
    )
  }
}
