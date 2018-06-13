/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import {
  FormContainer,
  FieldItem,
  FieldInput,
  TextField,
  PasswordField,
  TextAreaField,
  SubmitButton
} from 'components/Form'
import PasswordStrength from 'components/PasswordStrength'
import { getPasswordStrength } from 'utils'
import { normalizeUnitByCurrency } from 'utils/normalize'
import * as stakeActions from 'actions/stake'
import { eosAccountSelector } from 'selectors/eosAccount'
import Alert from 'components/Alert'

export const errorMessages = (error) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return 'Invalid password!'
    case 'Invalid active private key!':
      return 'Invalid active private key!'
    default:
      return 'Stake failed!'
  }
}

const validate = (values, props) => {
  const errors = {}

  if (!values.get('amount')) {
    errors.amount = 'Please input the stake amount'
  }

  if (!values.get('password')) {
    errors.password = 'Please input the password'
  }

  return errors
}

@reduxForm({ form: 'stakeEOSForm', validate })

@connect(
  state => ({
    locale: state.intl.get('locale'),
    stake: state.stake,
    eosAccount: eosAccountSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...stakeActions
    }, dispatch)
  })
)

export default class StakeEOSForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {
    this.props.actions.stakeRequested(data.set('eosAccountName', this.props.eosAccount.get('data').get('account_name')).toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, password, stake } = this.props
    const loading = stake.get('loading')
    const error = stake.get('error')
    const disabled = invalid || pristine || loading

    return (
      <FormContainer>
        <Field
          label="Enter the stake amount"
          name="amount"
          component={TextField}
          normalize={normalizeUnitByCurrency('EOS')}
        />
        <Field
          label="Password"
          name="password"
          component={PasswordField}
        />
        <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text="Stake" />
        <Alert message={errorMessages(error)} dismiss={this.props.actions.clearError} />
      </FormContainer>
    )
  }
}
