import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { FormContainer, TextField, PasswordField, SubmitButton, Button } from 'components/Form'
import PasswordStrength from 'components/PasswordStrength'
import { normalizeText } from 'utils/normalize'
import { getPasswordStrength } from 'utils'
import * as walletActions from 'actions/wallet'

const validate = (values) => {
  const errors = {}

  if (!values.get('name')) {
    errors.name = 'Please input bitportal wallet name'
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

@reduxForm({ form: 'createWalletForm', validate })

@connect(
  state => ({
    locale: state.intl.locale,
    password: formValueSelector('createWalletForm')(state, 'password'),
    wallet: state.wallet
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

export default class CreateWalletForm extends Component {
  submit = (data) => {
    this.props.actions.createWalletRequested(data.delete('confirmedPassword').toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, password, wallet } = this.props
    const loading = wallet.get('loading')
    const disabled = invalid || pristine || loading

    return (
      <FormContainer>
        <Field
          label="Wallet Name"
          name="name"
          component={TextField}
          normalize={normalizeText}
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
        <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text="Next" />
        <Button text="Import" onPress={this.props.importEOSAccount} />
      </FormContainer>
    )
  }
}
