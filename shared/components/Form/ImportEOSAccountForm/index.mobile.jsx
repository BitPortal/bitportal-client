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
import { normalizeText, isEOSAccountNameValid } from 'utils/normalize'
import * as eosAccountActions from 'actions/eosAccount'
import Alert from 'components/Alert'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messages from './messages'

export const errorMessages = (error) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid owner private key!':
      return 'Invalid owner private key!'
    case 'Invalid active private key!':
      return 'Invalid active private key!'
    case 'EOS account dose not exist!':
      return 'EOS account dose not exist!'
    case 'Owner permission dose not exist!':
      return 'Owner permission dose not exist!'
    case 'Active permission dose not exist!':
      return 'Active permission dose not exist!'
    case 'Unauthorized owner private key!':
      return 'Unauthorized owner private key!'
    case 'Unauthorized active private key!':
      return 'Unauthorized active private key!'
    default:
      return 'Import failed!'
  }
}

const validate = (values, props) => {
  const errors = {}

  if (!values.get('name')) {
    errors.name = <FormattedMessage id="import_txtbox_txt_hint1" />
  } else if (values.get('name').length > 12) {
    errors.name = <FormattedMessage id="import_txtbox_txt_hint1" />
  }

  if (!values.get('eosAccountName')) {
    errors.eosAccountName = 'Please input EOS account name'
  }

  if (!isEOSAccountNameValid(values.get('eosAccountName'))) {
    errors.eosAccountName = 'Only 12345abcdefghijklmnopqrstuvwxyz works'
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

@reduxForm({ form: 'importEOSAccountForm', validate })

export default class ImportEOSAccountForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {
    this.props.actions.importEOSAccountRequested(data.delete('confirmedPassword').toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, password, eosAccount, locale } = this.props
    const loading = eosAccount.get('loading')
    const error = eosAccount.get('error')
    const disabled = invalid || pristine || loading

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={messages[locale]['import_title_name_bpnm']}
            name="name"
            component={TextField}
          />
          <Field
            label="EOS Account Name"
            name="eosAccountName"
            component={TextField}
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
          <Alert message={errorMessages(error)} dismiss={this.props.actions.clearError} />
        </FormContainer>
      </IntlProvider>
    )
  }
}
