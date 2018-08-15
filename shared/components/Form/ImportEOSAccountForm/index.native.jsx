import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { FormContainer, TextField, PasswordField, TextAreaField, SubmitButton } from 'components/Form'
import PasswordStrength from 'components/PasswordStrength'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { BITPORTAL_API_TERMS_URL } from 'constants/env'
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native'
import { getPasswordStrength } from 'utils'
import { validateText } from 'utils/validate'
import { normalizeText } from 'utils/normalize'
import * as eosAccountActions from 'actions/eosAccount'
import Alert from 'components/Alert'
import Colors from 'resources/colors'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid private key!':
      return messages.import_txtbox_txt_invalidown
    default:
      return messages.ast_imp_hint_fail
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.get('password')) {
    errors.password = <FormattedMessage id="import_title_name_pwd" />
  } else if (!!values.get('password') && values.get('password').length < 6) {
    errors.password = <FormattedMessage id="import_txtbox_txt_pwdhint1" />
  }

  if (!values.get('confirmedPassword')) {
    errors.confirmedPassword = <FormattedMessage id="import_title_name_cfmpwd" />
  }

  if (values.get('confirmedPassword') !== values.get('password')) {
    errors.confirmedPassword = <FormattedMessage id="import_txtbox_txt_pwdhint2" />
  }

  if (!values.get('privateKey')) {
    errors.privateKey = <FormattedMessage id="import_txtbox_txt_ownhint" />
  } else if (!validateText(values.get('privateKey'))) {
    errors.privateKey = <FormattedMessage id="import_txtbox_txt_invalidown" />
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
          title: messages[locale].import_nav_title_terms,
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
    const error = eosAccount.get('error')
    const disabled = invalid || pristine || loading || unsignAgreement

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            placeholder={messages[locale].import_title_plchd_privtk}
            name="privateKey"
            component={TextAreaField}
            normalize={normalizeText}
          />
          <Field
            label={<FormattedMessage id="import_title_name_pwd" />}
            tips={messages[locale].import_title_tips_pwd}
            placeholder={messages[locale].import_title_plchd_pwd}
            name="password"
            component={PasswordField}
            rightContent={<PasswordStrength strength={getPasswordStrength(password)} />}
          />
          <Field
            placeholder={messages[locale].import_title_plchd_cfmpwd}
            name="confirmedPassword"
            component={PasswordField}
          />
          <Field
            placeholder={messages[locale].import_title_name_pswht}
            name="passwordHint"
            component={TextField}
          />
          <View style={styles.terms}>
            <TouchableOpacity style={styles.termsBtn} onPress={this.signAgreement}>
              <Ionicons name="ios-checkmark-circle" size={24} color={unsignAgreement ? Colors.textColor_181_181_181 : Colors.textColor_89_185_226} />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.text14}>
              {messages[locale].import_txt_title_agrm}{' '}
              <Text numberOfLines={1} onPress={this.checkTerms} style={[styles.text14, { textDecorationLine: 'underline', color: Colors.textColor_89_185_226 }]}>
                {messages[locale].import_txt_title_term}
              </Text>
            </Text>
          </View>
          <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text={<FormattedMessage id="import_button_name_nxt" />} />
          <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearEOSAccountError} />
        </FormContainer>
      </IntlProvider>
    )
  }
}
