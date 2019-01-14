import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { FormContainer, TextField, PasswordField, TextAreaField, SubmitButton } from 'components/Form'
import PasswordStrength from 'components/PasswordStrength'
import { getPasswordStrength } from 'utils'
import { validateText } from 'utils/validate'
import { normalizePrivateKey } from 'utils/normalize'
import * as eosAccountActions from 'actions/eosAccount'
import Alert from 'components/Alert'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messages from 'resources/messages'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid private key!':
      return messages.add_eos_error_popup_text_private_key_invalid
    case 'No key accounts':
      return 'No key accounts'
    case 'EOS System Error':
      return messages.resource_error_popup_text_eos_system_error
    default:
      return messages.add_eos_import_error_popup_text_private_key_import_failed
  }
}

export const errorMessageDetail = (error) => {
  if (!error || typeof error !== 'object') { return null }

  return error.detail
}

const validate = (values, props) => {
  const errors = {}
  const { locale } = props
  if (!values.get('password')) {
    errors.password = messages[locale].add_eos_label_set_password
  }

  if (!!values.get('password') && values.get('password').length < 6) {
    errors.password = messages[locale].add_eos_error_text_password_min_character
  }

  if (!!values.get('password') && values.get('password').length > 64) {
    errors.password = messages[locale].add_eos_error_text_password_max_character
  }

  if (!!values.get('passwordHint') && values.get('passwordHint').length > 64) {
    errors.passwordHint = messages[locale].add_eos_error_text_password_hint_max_character
  }

  if (!values.get('confirmedPassword')) {
    errors.confirmedPassword = messages[locale].add_eos_error_text_password_blank
  }

  if (values.get('confirmedPassword') !== values.get('password')) {
    errors.confirmedPassword = messages[locale].add_eos_error_text_password_unmatch
  }

  if (!values.get('privateKey')) {
    errors.privateKey = messages[locale].add_eos_import_error_text_private_key_blank
  } else if (!validateText(values.get('privateKey'))) {
    errors.privateKey = messages[locale].add_eos_error_popup_text_private_key_invalid
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.locale,
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
  submit = (data) => {
    this.props.actions.getEOSKeyAccountsRequested(data.set('componentId', this.props.componentId).delete('confirmedPassword').toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, password, eosAccount, locale } = this.props
    const loading = eosAccount.get('loading')
    const error = eosAccount.get('getKeyAccountsError')
    const disabled = invalid || pristine || loading

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={messages[locale].add_eos_import_error_text_private_key}
            placeholder={messages[locale].add_eos_import_error_text_private_key_blank}
            name="privateKey"
            component={TextAreaField}
            normalize={normalizePrivateKey}
          />
          <Field
            label={messages[locale].add_eos_label_set_password}
            tips={messages[locale].add_eos_popup_text_password_tips}
            placeholder={messages[locale].add_eos_text_password}
            name="password"
            component={PasswordField}
            rightContent={<PasswordStrength strength={getPasswordStrength(password)} />}
          />
          <Field
            label={messages[locale].add_eos_text_confirm_password}
            placeholder={messages[locale].add_eos_error_text_confirm_password}
            name="confirmedPassword"
            component={PasswordField}
          />
          <Field
            label={messages[locale].add_eos_text_password_hint}
            placeholder={messages[locale].add_eos_text_password_hint_blank}
            name="passwordHint"
            component={TextField}
          />
          <SubmitButton disabled={disabled} onPress={handleSubmit(this.submit)} text={<FormattedMessage id="add_eos_import_button_import" />} />
          <Alert message={errorMessages(error, messages[locale])} subMessage={errorMessageDetail(error)} dismiss={this.props.actions.clearEOSAccountError} />
        </FormContainer>
      </IntlProvider>
    )
  }
}
