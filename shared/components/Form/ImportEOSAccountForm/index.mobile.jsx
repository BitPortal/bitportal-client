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
import { normalizeText, normalizeEOSAccountName } from 'utils/normalize'
import * as eosAccountActions from 'actions/eosAccount'

const validate = (values, props) => {
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

  if (!values.get('ownerPrivateKey')) {
    errors.ownerPrivateKey = 'Please input onwer private key'
  }

  if (!values.get('activePrivateKey')) {
    errors.activePrivateKey = 'Please input active private key'
  }

  return errors
}

@reduxForm({ form: 'importEOSAccountForm', validate })

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: state.eosAccount,
    password: formValueSelector('importEOSAccountForm')(state, 'password')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAccountActions
    }, dispatch)
  })
)

export default class ImportEOSAccountForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {
    this.props.actions.importEOSAccountRequested(data.delete('confirmedPassword').toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, password, eosAccount } = this.props
    const loading = eosAccount.get('loading')
    const disabled = invalid || pristine || loading

    console.log(loading)
    console.log(disabled)
    return (
      <FormContainer>
        <Field
          label="Bitportal Wallet Name"
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
        <Field
          label="Onwer Private Key"
          name="ownerPrivateKey"
          component={TextAreaField}
          normalize={normalizeText}
        />
        <Field
          label="Active Private Key"
          name="activePrivateKey"
          component={TextAreaField}
          normalize={normalizeText}
        />
        <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text="Import" />
      </FormContainer>
    )
  }
}
