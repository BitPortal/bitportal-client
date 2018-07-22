

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { FormContainer, TextField, PasswordField, SubmitButton, Button } from 'components/Form'
import PasswordStrength from 'components/PasswordStrength'
import { normalizeEOSAccountName } from 'utils/normalize'
import { getPasswordStrength } from 'utils'
import * as walletActions from 'actions/wallet'
import Alert from 'components/Alert'

export const errorMessages = (error) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'EOS account already exists!':
      return 'EOS account already exists!'
    case 'Wallet already exists!':
      return 'Wallet already exists!'
    case 'Generate EOS keys failed!':
      return 'Generate EOS keys failed!'
    default:
      return 'Create failed!'
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.get('name')) {
    errors.name = 'Please input bitportal wallet name'
  } else if (values.get('name').length > 12) {
    errors.name = 'Wallet name should contain 1~12 characters'
  }

  if (!values.get('eosAccountName')) {
    errors.eosAccountName = 'Please input EOS account name'
  }

  if (!values.get('password')) {
    errors.password = 'Please input password'
  } else if (!!values.get('password') && values.get('password').length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (!values.get('confirmedPassword')) {
    errors.confirmedPassword = 'Please confirm password'
  }

  if (values.get('confirmedPassword') !== values.get('password')) {
    errors.confirmedPassword = 'Passwords don\'t macth'
  }

  return errors
}

@reduxForm({ form: 'createWalletAndEOSAccountForm', validate })

@connect(
  state => ({
    locale: state.intl.get('locale'),
    password: formValueSelector('createWalletAndEOSAccountForm')(state, 'password'),
    wallet: state.wallet
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

export default class CreateWalletAndEOSAccountForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {
    this.props.actions.createWalletAndEOSAccountRequested(data.delete('confirmedPassword').toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, password, wallet } = this.props
    const loading = wallet.get('loading')
    const error = wallet.get('error')
    const disabled = invalid || pristine || loading

    return (
      <FormContainer>
        <Field
          label="BitPortal Wallet Name"
          name="name"
          component={TextField}
        />
        <Field
          label="EOS Account Name"
          name="eosAccountName"
          component={TextField}
          normalize={normalizeEOSAccountName}
        />
        <Field
          label="Set a password"
          name="password"
          component={PasswordField}
          rightContent={<PasswordStrength strength={getPasswordStrength(password)} />}
        />
        <Field
          label="Confirm Your Password"
          name="confirmedPassword"
          component={PasswordField}
        />
        <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text="Create" />
        <Button text="Import" onPress={this.props.importEOSAccount} />
        <Alert message={errorMessages(error)} dismiss={this.props.actions.clearEOSAccountError} />
      </FormContainer>
    )
  }
}
