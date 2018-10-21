import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { LayoutAnimation } from 'react-native'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { IntlProvider } from 'react-intl'
import { FormContainer, TextField, PasswordField, TextAreaField, SubmitButton } from 'components/Form'
import { normalizeEOSAccountName, normalizeText } from 'utils/normalize'
import PasswordStrength from 'components/PasswordStrength'
import Alert from 'components/Alert'
import { validateEOSAccountName } from 'utils/validate'
import { getPasswordStrength } from 'utils'
import * as walletActions from 'actions/wallet'
import * as eosAccountActions from 'actions/eosAccount'
import { onEventWithMap } from 'utils/analytics'
import { ACCOUNT_EOS_CREATE } from 'constants/analytics'
import messages from 'resources/messages'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error
  switch (String(message)) {
    case 'Account name already exists':
      return messages.add_eos_create_error_popup_text_account_name_exist
    case 'Invalid private key!':
      return messages.add_eos_error_popup_text_private_key_invalid
    case 'Campaign is for invitation only':
      return messages.add_eos_create_error_popup_text_registration_code_invite
    case 'Campaign is for eos only':
      return messages.add_eos_create_error_popup_text_registration_code_eos
    case 'Unknown invitation Code':
      return messages.add_eos_create_error_popup_text_registration_code_invalid
    case 'Coupon code is used':
      return messages.add_eos_create_error_popup_text_registration_code_used
    case 'Error retrieving data':
      return messages.add_eos_create_error_popup_text_data_extraction_failed
    default:
      return messages.add_eos_create_error_popup_text_create_failed
  }
}

const validate = (values, props) => {
  const errors = {}
  const { locale } = props

  if (!values.get('eosAccountName')) {
    errors.eosAccountName = messages[locale].add_eos_create_error_text_account_name_blank
  }

  if (!!values.get('eosAccountName') && !validateEOSAccountName(values.get('eosAccountName'))) {
    errors.eosAccountName = messages[locale].add_eos_create_error_text_account_name_invalid
  }

  if (!values.get('password')) {
    errors.password = messages[locale].add_eos_error_text_password_blank
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
    errors.confirmedPassword = messages[locale].add_eos_error_text_confirm_password
  }

  if (values.get('confirmedPassword') !== values.get('password')) {
    errors.confirmedPassword = messages[locale].add_eos_error_text_password_unmatch
  }

  if (!values.get('inviteCode')) {
    errors.inviteCode = messages[locale].add_eos_create_error_text_registration_code_blank
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    eosAccount: state.eosAccount,
    password: formValueSelector('createEOSAccountForm')(state, 'password')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...eosAccountActions
    }, dispatch)
  })
)

@reduxForm({ form: 'createEOSAccountForm', validate })

export default class CreateEOSAccountForm extends Component {
  UNSAFE_componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  submit = (data) => {
    // Umeng analytics
    onEventWithMap(ACCOUNT_EOS_CREATE, { eosAccountName: data.get('eosAccountName'), inviteCode: data.get('inviteCode') })
    const componentId = this.props.componentId
    this.props.actions.createEOSAccountRequested(data.set('componentId', componentId).delete('confirmedPassword').toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, eosAccount, locale, password } = this.props
    const loading = eosAccount.get('loading')
    const disabled = invalid || pristine || loading
    const error = eosAccount.get('error')

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={messages[locale].add_eos_create_label_account_name}
            name="eosAccountName"
            component={TextField}
            placeholder={messages[locale].add_eos_create_text_account_name}
            tips={messages[locale].add_eos_create_popup_text_account_name_tips}
            normalize={normalizeEOSAccountName}
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
          <Field
            label={messages[locale].add_eos_create_label_registration_code}
            tips={messages[locale].add_eos_create_popup_text_registration_code_tips}
            placeholder={messages[locale].add_eos_create_text_registration_code}
            name="inviteCode"
            component={TextField}
          />
          <Field
            label={messages[locale].add_eos_create_button_with_private_key}
            placeholder={messages[locale].add_eos_text_private_key}
            name="privateKey"
            normalize={normalizeText}
            component={TextAreaField}
          />

          <SubmitButton disabled={disabled} onPress={handleSubmit(this.submit)} text={messages[locale].add_eos_create_button_create} />

          <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearEOSAccountError} />
        </FormContainer>
      </IntlProvider>
    )
  }
}
