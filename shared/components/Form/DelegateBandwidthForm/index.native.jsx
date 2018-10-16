import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, InteractionManager } from 'react-native'
import { Field, reduxForm, reset } from 'redux-form/immutable'
import { FormContainer, TextField, SubmitButton } from 'components/Form'
import { normalizeUnitByCurrency } from 'utils/normalize'
import { validateUnitByCurrency } from 'utils/validate'
import * as bandwidthActions from 'actions/bandwidth'
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
  delegateBandwidthForm: {
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
  const netWeight = eosAccount.getIn(['data', 'total_resources', 'net_weight']) ? eosAccount.getIn(['data', 'total_resources', 'net_weight']).split(' ')[0] : 0
  const cpuWeight = eosAccount.getIn(['data', 'total_resources', 'cpu_weight']) ? eosAccount.getIn(['data', 'total_resources', 'cpu_weight']).split(' ')[0] : 0

  const errors = {}

  if (!+values.get('quant')) {
    errors.quant = messages[props.locale].resource_error_text_amount
  } else if (!validateUnitByCurrency('EOS')(values.get('quant'))){
    errors.quant = messages[props.locale].resource_error_text_amount_invalid
  }

  const activeForm = props.bandwidth.get('activeForm')
  const resource = props.resource

  if (activeForm === 'Delegate') {
    if (+eosBalance < +values.get('quant')) {
      errors.quant = messages[props.locale].resource_error_text_balance_insufficient
    }
  } else if (resource === 'net') {
    if (+netWeight < +values.get('quant')) {
      errors.quant = messages[props.locale].resource_error_text_balance_insufficient
    }
  } else if (+cpuWeight < +values.get('quant')) {
    errors.quant = messages[props.locale].resource_error_text_balance_insufficient
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state),
    eosBalance: eosBalanceSelector(state),
    bandwidth: state.bandwidth
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...bandwidthActions,
      reset
    }, dispatch)
  })
)

@reduxForm({ form: 'delegateBandwidthForm', validate })

export default class DelegateBandwidthForm extends Component {
  state = { activeForm: 'Delegate', isVisible: false, data: null }

  submit = (data) => {
    this.setState({ isVisible: true, data })
  }

  handleConfirm = (password) => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        const data = this.state.data
        const eosAccount = this.props.eosAccount
        const eosAccountName = eosAccount.getIn(['data', 'account_name'])
        const resource = this.props.resource

        if (this.state.activeForm === 'Delegate') {
          this.props.actions.delegateBandwidthRequested(data.set('resource', resource).set('eosAccountName', eosAccountName).set('password', password).toJS())
        } else {
          this.props.actions.undelegateBandwidthRequested(data.set('resource', resource).set('eosAccountName', eosAccountName).set('password', password).toJS())
        }
      })
    })
  }

  switchForm = (form) => {
    if (form !== this.state.activeForm) {
      this.props.actions.setActiveForm(form)
      this.setState({ activeForm: form })
      this.props.actions.clearBandwidthError()
      this.props.reset('delegateBandwidthForm')
    }
  }

  closePrompt = () => {
    this.setState({ isVisible: false })
  }

  render() {
    const { handleSubmit, invalid, pristine, bandwidth, locale, eosAccount, eosBalance } = this.props
    const delegating = bandwidth.get('delegating')
    const undelegating = bandwidth.get('undelegating')
    const showSuccess = bandwidth.get('showSuccess')
    const loading = delegating || undelegating
    const error = bandwidth.get('error')
    const disabled = invalid || pristine || loading
    const netWeight = eosAccount.getIn(['data', 'total_resources', 'net_weight']) ? eosAccount.getIn(['data', 'total_resources', 'net_weight']).split(' ')[0] : 0
    const cpuWeight = eosAccount.getIn(['data', 'total_resources', 'cpu_weight']) ? eosAccount.getIn(['data', 'total_resources', 'cpu_weight']).split(' ')[0] : 0
    const availableBalance = this.state.activeForm === 'Delegate' ? eosBalance : (this.props.resource === 'net' ? netWeight : cpuWeight)
    const balanceTitle = this.state.activeForm === 'Delegate' ? messages[locale].resource_label_balance : messages[locale].resource_label_staked

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.delegateBandwidthForm}>
          <Switch itemList={['Delegate', 'Undelegate']} active={this.state.activeForm} onSwitch={this.switchForm} />
          <Balance title={balanceTitle} value={availableBalance} unit="EOS" />
          <FormContainer>
            <Field
              name="quant"
              component={TextField}
              rightContent={<Text style={{ color: 'white' }}>EOS</Text>}
              normalize={normalizeUnitByCurrency('EOS')}
              keyboardType="numeric"
            />
            <SubmitButton
              disabled={disabled}
              onPress={handleSubmit(this.submit)}
              text={this.state.activeForm === 'Delegate' ? messages[locale].resource_button_stake : messages[locale].resource_button_unstake}
            />
            <Alert message={errorMessages(error, messages[locale])} subMessage={errorMessageDetail(error)} dismiss={this.props.actions.clearBandwidthError} />
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
