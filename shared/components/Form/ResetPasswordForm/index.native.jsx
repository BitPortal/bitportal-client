import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { FormContainer, TextField, PasswordField, SubmitButton } from 'components/Form'
import { Text } from 'react-native'
import { Navigation } from 'components/Navigation'
import PasswordStrength from 'components/PasswordStrength'
import Alert from 'components/Alert'
import { eosAccountSelector } from 'selectors/eosAccount'
import { getPasswordStrength } from 'utils'
import * as keystoreActions from 'actions/keystore'
import Colors from 'resources/colors'
import messages from 'resources/messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.change_password_error_popup_text_current_password_incorrect
    default:
      return messages.change_password_error_popup_text_change_failed
  }
}

const validate = (values, props) => {
  const errors = {}
  const { locale } = props

  if (!values.get('oldPassword')) {
    errors.oldPassword = messages[locale].change_password_error_text_current_password_blank
  }

  if (!values.get('newPassword')) {
    errors.newPassword = messages[locale].change_password_error_text_new_password_blank
  }

  if (!!values.get('newPassword') && values.get('newPassword').length < 6) {
    errors.newPassword = messages[locale].add_eos_error_text_password_min_character
  }

  if (!!values.get('newPassword') && values.get('newPassword').length > 64) {
    errors.newPassword = messages[locale].add_eos_error_text_password_max_character
  }

  if (!!values.get('passwordHint') && values.get('passwordHint').length > 64) {
    errors.passwordHint = messages[locale].add_eos_error_text_password_hint_max_character
  }

  if (values.get('confirmedNewPassword') !== values.get('newPassword')) {
    errors.confirmedNewPassword = messages[locale].change_password_error_text_confirm_new_password_unmatch
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.locale,
    keystore: state.keystore,
    eosAccount: eosAccountSelector(state),
    newPassword: formValueSelector('resetPasswordForm')(state, 'newPassword')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...keystoreActions
    }, dispatch)
  })
)

@reduxForm({ form: 'resetPasswordForm', validate })

export default class ResetPasswordForm extends Component {
  submit = (data) => {
    const eosAccountName = this.props.eosAccount.get('data').get('account_name')
    const componentId = this.props.componentId
    this.props.actions.changePasswordRequested(data.set('componentId', componentId).set('eosAccountName', eosAccountName).delete('confirmedNewPassword').toJS())
  }

  importPrivateKey = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AccountImport'
      }
    })
  }

  render() {
    const { handleSubmit, invalid, pristine, locale, newPassword, keystore } = this.props
    const loading = keystore.get('changing')
    const error = keystore.get('changingError')
    const disabled = invalid || pristine || loading

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={messages[locale].change_password_label_current_password}
            name="oldPassword"
            component={PasswordField}
          />
          <Field
            label={messages[locale].change_password_label_new_password}
            name="newPassword"
            component={PasswordField}
            rightContent={<PasswordStrength strength={getPasswordStrength(newPassword)} />}
          />
          <Field
            label={messages[locale].change_password_label_confirm_new_password}
            name="confirmedNewPassword"
            component={PasswordField}
          />
          <Field
            label={messages[locale].change_password_label_new_password_hint}
            name="passwordHint"
            component={TextField}
          />
          <Text style={styles.text14}>
            <Text style={{ color: Colors.textColor_255_255_238 }}>
              {messages[locale].change_password_text_forget_password1}
            </Text>
            {messages[locale].change_password_text_forget_password2}
            <Text onPress={this.importPrivateKey} style={{ textDecorationLine: 'underline', color: Colors.textColor_89_185_226 }}>
              {messages[locale].change_password_link_import_private_key}
            </Text>
            {messages[locale].change_password_text_forget_password3}
          </Text>
          <SubmitButton
            disabled={disabled}
            onPress={handleSubmit(this.submit)}
            text={messages[locale].change_password_button_change}
          />
          <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearKeystoreError} />
        </FormContainer>
      </IntlProvider>
    )
  }
}
