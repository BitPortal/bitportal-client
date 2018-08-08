import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { FormContainer, TextField, PasswordField, SubmitButton } from 'components/Form'
import { Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import PasswordStrength from 'components/PasswordStrength'
import Alert from 'components/Alert'
import { eosAccountSelector } from 'selectors/eosAccount'
import { getPasswordStrength } from 'utils'
import * as keystoreActions from 'actions/keystore'
import Colors from 'resources/colors'
import messages from './messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.cpwd_title_error_odpsd
    default:
      return messages.cpwd_title_error_reset
  }
}

const validate = (values, props) => {
  const errors = {}
  const { locale } = props

  if (!values.get('oldPassword')) {
    errors.oldPassword = messages[locale].cpwd_title_empty_psd
  }

  if (!values.get('newPassword')) {
    errors.newPassword = messages[locale].cpwd_title_empty_newpsd
  }

  if (values.get('confirmedNewPassword') !== values.get('newPassword')) {
    errors.confirmedNewPassword = messages[locale].cpwd_title_empty_rptnewpsd
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
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
            label={<FormattedMessage id="cpwd_txtbox_title_current" />}
            name="oldPassword"
            component={PasswordField}
          />
          <Field
            label={<FormattedMessage id="cpwd_txtbox_title_new" />}
            name="newPassword"
            component={PasswordField}
            rightContent={<PasswordStrength strength={getPasswordStrength(newPassword)} />}
          />
          <Field
            label={<FormattedMessage id="cpwd_txtbox_title_repeat" />}
            name="confirmedNewPassword"
            component={PasswordField}
          />
          <Field
            label={<FormattedMessage id="cpwd_title_name_pswht" />}
            name="passwordHint"
            component={TextField}
          />
          <Text style={styles.text14}>
            <Text style={{ color: Colors.textColor_89_185_226 }}>
              <FormattedMessage id="cpwd_hint_txt_txt1" />
            </Text>
            <FormattedMessage id="cpwd_hint_txt_txt2" />
            <Text onPress={this.importPrivateKey} style={{ textDecorationLine: 'underline', color: Colors.textColor_89_185_226 }}>
              <FormattedMessage id="cpwd_hint_txt_txt3" />
            </Text>
            <FormattedMessage id="cpwd_hint_txt_txt4" />
          </Text>
          <SubmitButton
            disabled={disabled}
            loading={loading}
            onPress={handleSubmit(this.submit)}
            text={<FormattedMessage id="cpwd_button_name_change" />}
          />
          <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearKeystoreError} />
        </FormContainer>
      </IntlProvider>
    )
  }
}
