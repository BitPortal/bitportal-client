import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, InteractionManager } from 'react-native'
import { Field, reduxForm, reset } from 'redux-form'
import { FormContainer, TextField, SubmitButton } from 'components/Form'
import { normalizeUnitByFraction, normalizeUnitByCurrency } from 'utils/normalize'
import { validateUnitByFraction, validateUnitByCurrency } from 'utils/validate'
import * as ramActions from 'actions/ram'
import Switch from 'components/Switch'
import Balance from 'components/Balance'
import { IntlProvider } from 'react-intl'
import EStyleSheet from 'react-native-extended-stylesheet'
import { eosAccountSelector } from 'selectors/eosAccount'
import { eosBalanceSelector } from 'selectors/balance'
import Prompt from 'components/Prompt'
import Alert from 'components/Alert'
import messages from 'resources/messages'

const styles = EStyleSheet.create({
  buyRAMForm: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column'
  }
})

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.general_error_popup_text_password_incorrect
    case 'account using more than allotted RAM usage':
      return messages.resource_error_popup_text_ram_insufficient
    case 'transaction exceeded the current CPU usage limit imposed on the transaction':
      return messages.resource_error_popup_text_cpu_insufficient
    case 'EOS System Error':
      return messages.resource_error_popup_text_eos_system_error
    default:
      return messages.resource_error_popup_text_transaction_failed
  }
}

export const errorMessageDetail = (error) => {
  if (!error || typeof error !== 'object') { return null }

  return error.detail
}

const validate = (values, props) => {
  const { eosAccount, eosBalance } = props
  const ramQuota = eosAccount.getIn(['data', 'ram_quota']) || 0
  const ramUsage = eosAccount.getIn(['data', 'ram_usage']) || 0

  const errors = {}

  if (!+values.get('quant')) {
    errors.quant = messages[props.locale].resource_error_text_amount
  } else if (+eosBalance < +values.get('quant')) {
    errors.quant = messages[props.locale].resource_error_text_balance_insufficient
  } else if (!validateUnitByCurrency('EOS')(values.get('quant'))) {
    errors.quant = messages[props.locale].resource_error_text_amount_invalid
  }

  if (!+values.get('bytes')) {
    errors.bytes = messages[props.locale].resource_error_text_amount
  } else if ((+ramQuota - +ramUsage) < +values.get('bytes')) {
    errors.bytes = messages[props.locale].resource_error_text_balance_insufficient
  } else if (!validateUnitByFraction(0)(values.get('bytes'))) {
    errors.bytes = messages[props.locale].resource_error_text_amount_invalid
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.locale,
    eosAccount: eosAccountSelector(state),
    eosBalance: eosBalanceSelector(state),
    ram: state.ram
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...ramActions,
      reset
    }, dispatch)
  })
)

@reduxForm({ form: 'tradeRAMForm', validate })

export default class TradeRAMForm extends Component {
  state = { activeForm: 'Buy', isVisible: false, data: null }

  submit = (data) => {
    this.setState({ isVisible: true, data })
  }

  handleConfirm = (password) => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        const data = this.state.data
        const eosAccount = this.props.eosAccount
        const eosAccountName = eosAccount.getIn(['data', 'account_name'])
        if (this.state.activeForm === 'Buy') {
          this.props.actions.buyRAMRequested(data.set('eosAccountName', eosAccountName).set('password', password).toJS())
        } else {
          this.props.actions.sellRAMRequested(data.set('eosAccountName', eosAccountName).set('password', password).toJS())
        }
      })
    })
  }

  switchForm = (form) => {
    if (form !== this.state.activeForm) {
      this.setState({ activeForm: form })
      this.props.actions.clearRAMError()
      this.props.reset('tradeRAMForm')
    }
  }

  closePrompt = () => {
    this.setState({ isVisible: false })
  }

  render() {
    const { handleSubmit, invalid, pristine, ram, locale, eosAccount, eosBalance } = this.props
    const buying = ram.get('buying')
    const selling = ram.get('selling')
    const showSuccess = ram.get('showSuccess')
    const loading = buying || selling
    const error = ram.get('error')
    const disabled = invalid || pristine || loading
    const availableRAM = (eosAccount.getIn(['data', 'ram_quota']) && eosAccount.getIn(['data', 'ram_usage'])) ? (eosAccount.getIn(['data', 'ram_quota']) - eosAccount.getIn(['data', 'ram_usage'])) : 0
    const availableBalance = this.state.activeForm === 'Buy' ? eosBalance : availableRAM
    const availableBalanceUnit = this.state.activeForm === 'Buy' ? 'EOS' : 'Bytes'

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.buyRAMForm}>
          <Switch itemList={['Buy', 'Sell']} active={this.state.activeForm} onSwitch={this.switchForm} />
          <Balance title={messages[locale].resource_label_balance} value={availableBalance} unit={availableBalanceUnit} />
          <FormContainer>
            {this.state.activeForm === 'Buy' && <Field
              name="quant"
              component={TextField}
              keyboardType="numeric"
              rightContent={<Text style={{ color: 'white' }}>EOS</Text>}
              normalize={normalizeUnitByCurrency('EOS')}
            />}
            {this.state.activeForm === 'Sell' && <Field
              name="bytes"
              component={TextField}
              keyboardType="numeric"
              rightContent={<Text style={{ color: 'white' }}>Bytes</Text>}
              normalize={normalizeUnitByFraction(0)}
            />}
            <SubmitButton
              disabled={disabled}
              onPress={handleSubmit(this.submit)}
              text={this.state.activeForm === 'Buy' ? messages[locale].resource_ram_button_buy : messages[locale].resource_ram_button_sell}
            />
            <Alert message={errorMessages(error, messages[locale])} subMessage={errorMessageDetail(error)} dismiss={this.props.actions.clearRAMError} />
            <Alert message={!!showSuccess && messages[locale].resource_popup_text_transaction_successful} dismiss={this.props.actions.hideSuccessModal} />
            <Prompt
              isVisible={this.state.isVisible}
              title={messages[locale].general_popup_label_password}
              negativeText={messages[locale].general_popup_button_cancel}
              positiveText={messages[locale].general_popup_button_confirm}
              type="secure-text"
              callback={this.handleConfirm}
              dismiss={this.closePrompt}
            />
          </FormContainer>
        </View>
      </IntlProvider>
    )
  }
}
