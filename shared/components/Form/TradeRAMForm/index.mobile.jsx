/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, AlertIOS } from 'react-native'
import { Field, reduxForm, reset } from 'redux-form/immutable'
import {
  FormContainer,
  FieldItem,
  FieldInput,
  TextField,
  SubmitButton
} from 'components/Form'
import { normalizeUnitByFraction, normalizeUnitByCurrency } from 'utils/normalize'
import * as ramActions from 'actions/ram'
import Alert from 'components/Alert'
import Switch from 'components/Switch'
import { IntlProvider, FormattedMessage } from 'react-intl'
import EStyleSheet from 'react-native-extended-stylesheet'
import { eosAccountSelector } from 'selectors/eosAccount'
import Dialog from 'components/Dialog'
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
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return '密码错误'
    default:
      return '交易失败'
  }
}

const validate = (values, props) => {
  const hasAccount = !!props.eosAccount.get('data').size
  console.log(props.eosAccount.toJS())
  const eosBalance = (hasAccount && props.eosAccount.get('data').get('core_liquid_balance')) ? props.eosAccount.get('data').get('core_liquid_balance').split(' ')[0] : 0
  const ramBytes = (hasAccount && props.eosAccount.get('data').get('total_resources').get('ram_bytes')) ? props.eosAccount.get('data').get('total_resources').get('ram_bytes') : 0

  const errors = {}

  if (!+values.get('quant')) {
    errors.quant = 'Please input quantity'
  }

  if (!values.get('bytes')) {
    errors.bytes = 'Please input bytes'
  } else if (+ramBytes < +values.get('bytes')) {
    errors.bytes = 'You don\'t have enough ram bytes'
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
  constructor(props, context) {
    super(props, context)
    this.state = { activeForm: 'Buy' }
    this.submit = this.submit.bind(this)
    this.switchForm = this.switchForm.bind(this)
  }

  submit(data) {
    AlertIOS.prompt(
      'Please input password',
      null,
      (password) => {
        const eosAccount = this.props.eosAccount
        const eosAccountName = eosAccount.get('data').get('account_name')

        if (this.state.activeForm === 'Buy') {
          this.props.actions.buyRAMRequested(data.set('eosAccountName', eosAccountName).set('password', password).toJS())
        } else {
          this.props.actions.sellRAMRequested(data.set('eosAccountName', eosAccountName).set('password', password).toJS())
        }
      },
      'secure-text'
    )
  }

  switchForm(form) {
    if (form !== this.state.activeForm) {
      this.setState({ activeForm: form })
      this.props.actions.clearError()
      this.props.reset('tradeRAMForm')
    }
  }

  render() {
    const { handleSubmit, invalid, pristine, password, ram, locale } = this.props
    const buying = ram.get('buying')
    const selling = ram.get('selling')
    const showSuccess = ram.get('showSuccess')
    const loading = buying || selling
    const error = ram.get('error')
    const disabled = invalid || pristine || loading

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.buyRAMForm}>
          <Switch itemList={['Buy', 'Sell']} active={this.state.activeForm} onSwitch={this.switchForm} />
          <FormContainer>
            {this.state.activeForm === 'Buy' && <Field
              name="quant"
              component={TextField}
              normalize={normalizeUnitByCurrency('EOS')}
              rightContent={<Text style={{ color: 'white' }}>EOS</Text>}
            />}
            {this.state.activeForm === 'Sell' && <Field
              name="bytes"
              component={TextField}
              normalize={normalizeUnitByFraction(0)}
              rightContent={<Text style={{ color: 'white' }}>Bytes</Text>}
            />}
            <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text={this.state.activeForm === 'Buy' ? 'Buy' : 'Sell'} />
            <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearError} />
            <Alert message={!!showSuccess && '交易成功'} dismiss={this.props.actions.hideSuccessModal} />
          </FormContainer>
        </View>
      </IntlProvider>
    )
  }
}
