import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { FormContainer, TextField, PasswordField, TextAreaField, SubmitButton } from 'components/Form'
import PasswordStrength from 'components/PasswordStrength'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { BITPORTAL_API_TERMS_URL } from 'constants/env'
import { View, Text, TouchableOpacity } from 'react-native'
import { getPasswordStrength } from 'utils'
import { validateText } from 'utils/validate'
import { normalizePrivateKey } from 'utils/normalize'
import * as eosAccountActions from 'actions/eosAccount'
import Alert from 'components/Alert'
import Colors from 'resources/colors'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messages from 'resources/messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid private key!':
      return messages.add_eos_error_popup_text_private_key_invalid
    case 'No key accounts':
      return 'No key accounts'
    case 'EOS System Error':
      return 'EOS System Error'
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
    errors.password = <FormattedMessage id="add_eos_label_set_password" />
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
    errors.confirmedPassword = <FormattedMessage id="add_eos_error_text_password_blank" />
  }

  if (values.get('confirmedPassword') !== values.get('password')) {
    errors.confirmedPassword = <FormattedMessage id="add_eos_error_text_password_unmatch" />
  }

  if (!values.get('privateKey')) {
    errors.privateKey = <FormattedMessage id="add_eos_import_error_text_private_key_blank" />
  } else if (!validateText(values.get('privateKey'))) {
    errors.privateKey = <FormattedMessage id="add_eos_error_popup_text_private_key_invalid" />
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
  state = {
    unsignAgreement: true
  }

  checkTerms = () => {
    const { locale } = this.props
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.BPWebView',
        passProps: {
          title: messages[locale].webview_title_tos,
          uri: BITPORTAL_API_TERMS_URL
        }
      }
    })
  }

  submit = (data) => {
    this.props.actions.getEOSKeyAccountsRequested(data.set('componentId', this.props.componentId).delete('confirmedPassword').toJS())
  }

  signAgreement = () => {
    this.setState(prevState => ({ unsignAgreement: !prevState.unsignAgreement }))
  }

  render() {
    const { handleSubmit, invalid, pristine, password, eosAccount, locale } = this.props
    const { unsignAgreement } = this.state
    const loading = eosAccount.get('loading')
    const error = eosAccount.get('getKeyAccountsError')
    const disabled = invalid || pristine || loading || unsignAgreement

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            placeholder={messages[locale].add_eos_text_private_key}
            name="privateKey"
            component={TextAreaField}
            normalize={normalizePrivateKey}
          />
          <Field
            label={<FormattedMessage id="add_eos_label_set_password" />}
            tips={messages[locale].add_eos_popup_text_password_tips}
            placeholder={messages[locale].add_eos_text_password}
            name="password"
            component={PasswordField}
            rightContent={<PasswordStrength strength={getPasswordStrength(password)} />}
          />
          <Field
            placeholder={messages[locale].add_eos_text_confirm_password}
            name="confirmedPassword"
            component={PasswordField}
          />
          <Field
            placeholder={messages[locale].add_eos_text_password_hint}
            name="passwordHint"
            component={TextField}
          />
          <View style={styles.terms}>
            <TouchableOpacity style={styles.termsBtn} onPress={this.signAgreement}>
              <Ionicons name="ios-checkmark-circle" size={24} color={unsignAgreement ? Colors.textColor_181_181_181 : Colors.textColor_89_185_226} />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.text14}>
              {messages[locale].add_eos_text_tos_agree}
              <Text numberOfLines={1} onPress={this.checkTerms} style={[styles.text14, { textDecorationLine: 'underline', color: Colors.textColor_89_185_226 }]}>
                {messages[locale].add_eos_link_tos}
              </Text>
            </Text>
          </View>
          <SubmitButton disabled={disabled} onPress={handleSubmit(this.submit)} text={<FormattedMessage id="add_eos_import_button_import" />} />
          <Alert message={errorMessages(error, messages[locale])} subMessage={errorMessageDetail(error)} dismiss={this.props.actions.clearEOSAccountError} />
        </FormContainer>
      </IntlProvider>
    )
  }
}
