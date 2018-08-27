import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, InteractionManager } from 'react-native'
import { Field, reduxForm, reset } from 'redux-form/immutable'
import { FormContainer, TextField, SubmitButton } from 'components/Form'
import { normalizeUnitByFraction, normalizeUnitByCurrency } from 'utils/normalize'
import { validateUnitByFraction, validateUnitByCurrency } from 'utils/validate'
import * as ramActions from 'actions/ram'
import Switch from 'components/Switch'
import Balance from 'components/Balance'
import { IntlProvider } from 'react-intl'
import EStyleSheet from 'react-native-extended-stylesheet'
import { eosAccountSelector } from 'selectors/eosAccount'
import Prompt from 'components/Prompt'
import Alert from 'components/Alert'
import messages from './messages'

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
      return messages.tra_popup_title_pwderr
    case 'account using more than allotted RAM usage':
      return messages.tra_popup_title_mousg
    case 'transaction exceeded the current CPU usage limit imposed on the transaction':
      return messages.tra_popup_title_exlimit
    default:
      return messages.tra_popup_title_trafail
  }
}

const validate = (values, props) => {
  const { eosAccount } = props
  const eosBalance = eosAccount.getIn(['data', 'core_liquid_balance']) ? eosAccount.getIn(['data', 'core_liquid_balance']).split(' ')[0] : 0
  const ramQuota = eosAccount.getIn(['data', 'ram_quota']) || 0
  const ramUsage = eosAccount.getIn(['data', 'ram_usage']) || 0

  const errors = {}

  if (!+values.get('quant')) {
    errors.quant = messages[props.locale].tra_popup_title_epteosinput
  } else if (+eosBalance < +values.get('quant')) {
    errors.quant = messages[props.locale].tra_popup_title_enbyteinput
  } else if (!validateUnitByCurrency('EOS')(values.get('quant'))) {
    errors.quant = messages[props.locale].tra_popup_title_invalideinput
  }

  if (!+values.get('bytes')) {
    errors.bytes = messages[props.locale].tra_popup_title_eptbyteinput
  } else if ((+ramQuota - +ramUsage) < +values.get('bytes')) {
    errors.bytes = messages[props.locale].tra_popup_title_enbyteinput
  } else if (!validateUnitByFraction(0)(values.get('bytes'))) {
    errors.bytes = messages[props.locale].tra_popup_title_invalideinput
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state),
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
    const { handleSubmit, invalid, pristine, ram, locale, eosAccount } = this.props
    const buying = ram.get('buying')
    const selling = ram.get('selling')
    const showSuccess = ram.get('showSuccess')
    const loading = buying || selling
    const error = ram.get('error')
    const disabled = invalid || pristine || loading
    const eosBalance = eosAccount.getIn(['data', 'core_liquid_balance']) ? eosAccount.getIn(['data', 'core_liquid_balance']).split(' ')[0] : '0.0000'
    const availableRAM = (eosAccount.getIn(['data', 'ram_quota']) && eosAccount.getIn(['data', 'ram_usage'])) ? (eosAccount.getIn(['data', 'ram_quota']) - eosAccount.getIn(['data', 'ram_usage'])) : 0
    const availableBalance = this.state.activeForm === 'Buy' ? eosBalance : availableRAM
    const availableBalanceUnit = this.state.activeForm === 'Buy' ? 'EOS' : 'Bytes'

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.buyRAMForm}>
          <Switch itemList={['Buy', 'Sell']} active={this.state.activeForm} onSwitch={this.switchForm} />
          <Balance title={messages[locale].tra_popup_title_baln} value={availableBalance} unit={availableBalanceUnit} />
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
              loading={loading}
              onPress={handleSubmit(this.submit)}
              text={this.state.activeForm === 'Buy' ? messages[locale].tra_popup_title_buy : messages[locale].tra_popup_title_sell}
            />
            <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearRAMError} />
            <Alert message={!!showSuccess && messages[locale].tra_popup_title_trasucc} dismiss={this.props.actions.hideSuccessModal} />
            <Prompt
              isVisible={this.state.isVisible}
              title={messages[locale].tra_popup_title_pwd}
              negativeText={messages[locale].tra_popup_buttom_can}
              positiveText={messages[locale].tra_popup_buttom_ent}
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
