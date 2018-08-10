import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { TouchableOpacity, Text, View, LayoutAnimation } from 'react-native'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { IntlProvider } from 'react-intl'
import { FormContainer, TextField, PasswordField, TextAreaField, SubmitButton } from 'components/Form'
import { normalizeEOSAccountName, normalizeText } from 'utils/normalize'
import { BITPORTAL_API_TERMS_URL } from 'constants/env'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import PasswordStrength from 'components/PasswordStrength'
import Alert from 'components/Alert'
import { validateEOSAccountName } from 'utils/validate'
import { getPasswordStrength } from 'utils'
import * as walletActions from 'actions/wallet'
import * as eosAccountActions from 'actions/eosAccount'
import messages from './messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Account name already exists':
      return messages.act_fid_error_extact
    case 'Invalid private key!':
      return messages.act_fid_error_privatekey
    default:
      return messages.act_fid_error_failed
  }
}

const validate = (values, props) => {
  const errors = {}
  const { locale } = props

  if (!values.get('eosAccountName')) {
    errors.eosAccountName = messages[locale].act_fid_empty_name
  }

  if (!!values.get('eosAccountName') && !validateEOSAccountName(values.get('eosAccountName'))) {
    errors.eosAccountName = messages[locale].act_fid_plachd_name
  }

  if (!values.get('password')) {
    errors.password = messages[locale].act_fid_empty_psd
  }

  if (!values.get('confirmedPassword')) {
    errors.confirmedPassword = messages[locale].act_fid_empty_rptpsd
  }

  if (values.get('confirmedPassword') !== values.get('password')) {
    errors.confirmedPassword = messages[locale].act_fid_error_rptpsd
  }

  if (!values.get('inviteCode')) {
    errors.inviteCode = messages[locale].act_fid_empty_invicode
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
  state = {
    unsignAgreement: true,
    hasPrivateKey: false
  }

  showPrivateKey = () => {
    this.setState(prevState => ({ hasPrivateKey: !prevState.hasPrivateKey }))
  }

  signAgreement = () => {
    this.setState(prevState => ({ unsignAgreement: !prevState.unsignAgreement }))
  }

  checkTerms = () => {
    const { locale } = this.props

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.BPWebView',
        passProps: {
          title: messages[locale].act_fid_title_terms,
          uri: BITPORTAL_API_TERMS_URL
        }
      }
    })
  }

  importAccount = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AccountImport'
      }
    })
  }

  submit = (data) => {
    const componentId = this.props.componentId
    this.props.actions.createEOSAccountRequested(data.set('componentId', componentId).delete('confirmedPassword').toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, eosAccount, locale, password } = this.props
    const { unsignAgreement, hasPrivateKey } = this.state
    const loading = eosAccount.get('loading')
    const disabled = invalid || pristine || loading || unsignAgreement
    const error = eosAccount.get('error')

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={messages[locale].act_fid_title_name}
            name="eosAccountName"
            component={TextField}
            placeholder={messages[locale].act_fid_plachd_name}
            tips={messages[locale].act_fid_tips_name}
            normalize={normalizeEOSAccountName}
          />
          <Field
            label={messages[locale].act_fid_title_password}
            tips={messages[locale].act_fid_tips_password}
            placeholder={messages[locale].act_fid_plachd_password}
            name="password"
            component={PasswordField}
            rightContent={<PasswordStrength strength={getPasswordStrength(password)} />}
          />
          <Field
            placeholder={messages[locale].act_fid_plachd_repeat}
            name="confirmedPassword"
            component={PasswordField}
          />
          <Field
            placeholder={messages[locale].act_fid_plachd_pswtp}
            name="passwordHint"
            component={TextField}
          />
          <Field
            label={messages[locale].act_fid_title_invcd}
            tips={messages[locale].act_fid_tips_invcd}
            placeholder={messages[locale].act_fid_plachd_invcd}
            name="inviteCode"
            component={TextField}
          />
          {
            hasPrivateKey && (
              <Field
                placeholder={messages[locale].act_fid_plachd_key}
                name="privateKey"
                normalize={normalizeText}
                component={TextAreaField}
              />
            )
          }
          <TouchableOpacity style={styles.privateKeyBtn} onPress={this.showPrivateKey}>
            <Text style={styles.text14}>
              {hasPrivateKey ? messages[locale].act_btn_title_close : messages[locale].act_btn_title_key}
            </Text>
          </TouchableOpacity>
          <View style={styles.terms}>
            <TouchableOpacity style={styles.termsBtn} onPress={this.signAgreement}>
              <Ionicons name="ios-checkmark-circle" size={24} color={unsignAgreement ? Colors.textColor_181_181_181 : Colors.textColor_89_185_226} />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.text14}>
              {messages[locale].act_btn_title_agrm}{' '}
              <Text numberOfLines={1} onPress={this.checkTerms} style={[styles.text14, { textDecorationLine: 'underline', color: Colors.textColor_89_185_226 }]}>
                {messages[locale].act_btn_title_term}
              </Text>
            </Text>
          </View>
          <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text={messages[locale].act_button_text_create} />
          <Text onPress={this.importAccount} style={[styles.text14, { marginVertical: 20, color: Colors.textColor_89_185_226 }]}>
            {messages[locale].act_btn_title_import}
          </Text>
          <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearEOSAccountError} />
        </FormContainer>
      </IntlProvider>
    )
  }
}
