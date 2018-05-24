/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { FormContainer, FieldItem, FieldInput, TextField, PasswordField, SubmitButton } from 'components/Form'
import PasswordStrength from 'components/PasswordStrength'
import { normalizeText } from 'utils/normalize'
import { getPasswordStrength } from 'utils'
import * as walletActions from 'actions/wallet'

const validate = (values, props) => {
  const errors = {}

  if (!values.get('eosName')) {
    errors.eosName = 'Please input bitportal wallet name'
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

@connect(
  state => ({
    locale: state.intl.get('locale'),
    password: formValueSelector('createEOSAccountForm')(state, 'password'),
    wallet: state.wallet
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
    }, dispatch)
  })
)

@reduxForm({ form: 'createEOSAccountForm', validate })

export default class CreateEOSAccountForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {
    // this.props.onPress()
    console.log(data.toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, password, wallet } = this.props
    const loading = wallet.get('loading')
    const disabled = invalid || pristine || loading

    return (
      <FormContainer>
        <Field
          label="EOS Account Name"
          name="eosName"
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
        <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text="Create" />
      </FormContainer>
    )
  }
}
