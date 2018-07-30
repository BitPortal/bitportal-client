import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { LayoutAnimation, TouchableOpacity, Text, View } from 'react-native'
import { Field, reduxForm } from 'redux-form/immutable'
import { IntlProvider } from 'react-intl'
import { FormContainer, TextField, PasswordField, TextAreaField, SubmitButton } from 'components/Form'
import { normalizeEOSAccountName } from 'utils/normalize'
import { BITPORTAL_API_TERMS_URL } from 'constants/env'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import * as walletActions from 'actions/wallet'
import * as eosAccountActions from 'actions/eosAccount'
import messages from './messages'
import styles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.get('eosAccountName')) {
    errors.eosAccountName = 'Please input EOS account name'
  }

  if (!values.get('password')) {
    errors.password = 'Please input bitportal wallet password'
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    eosAccount: state.eosAccount
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

  UNSAFE_componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  showPrivateKey = () => {
    this.setState({ hasPrivateKey: !this.state.hasPrivateKey })
  }

  signAgreement = () => {
    this.setState({ unsignAgreement: !this.state.unsignAgreement })
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
    const bpid = this.props.wallet.get('data').get('bpid')
    this.props.actions.createEOSAccountRequested(data.set('bpid', bpid).toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, eosAccount, locale } = this.props
    const { unsignAgreement, hasPrivateKey } = this.state
    const loading = eosAccount.get('loading')
    const disabled = invalid || pristine || loading || unsignAgreement

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={messages[locale].act_fid_title_name}
            name="eosAccountName"
            component={TextField}
            tips={messages[locale].act_fid_tips_name}
            normalize={normalizeEOSAccountName}
          />
          <Field
            label={messages[locale].act_fid_title_password}
            tips={messages[locale].act_fid_tips_password}
            placeholder={messages[locale].act_fid_plachd_password}
            name="password"
            component={PasswordField}
          />
          <Field
            placeholder={messages[locale].act_fid_plachd_repeat}
            name="confirmPassword"
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
            name="invitationCode"
            component={TextField}
          />
          {
            hasPrivateKey &&
            <Field
              placeholder={messages[locale].act_fid_plachd_key}
              name="privateKey"
              component={TextAreaField}
            />
          }

          <TouchableOpacity style={styles.privateKeyBtn} onPress={this.showPrivateKey}>
            <Text style={styles.text14}>
              { hasPrivateKey ? messages[locale].act_btn_title_close: messages[locale].act_btn_title_key }
            </Text>
          </TouchableOpacity>

          <View style={styles.terms}>
            <TouchableOpacity style={styles.termsBtn} onPress={this.signAgreement}>
              {
                unsignAgreement 
                ? <Ionicons name="ios-checkmark-circle" size={24} color={Colors.textColor_181_181_181} />
                : <Ionicons name="ios-checkmark-circle" size={24} color={Colors.textColor_89_185_226} />
              }
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.text14}>
              {messages[locale].act_btn_title_agrm}{' '}
              <Text onPress={this.checkTerms} style={[styles.text14, { textDecorationLine: 'underline', color: Colors.textColor_89_185_226 }]}>
                {messages[locale].act_btn_title_term}
              </Text>
            </Text>
          </View>
          
          <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text={messages[locale].act_button_text_create} />
          <Text onPress={this.importAccount} style={[styles.text14, { marginVertical: 20, color: Colors.textColor_89_185_226 }]}>
            {messages[locale].act_btn_title_import}
          </Text>
        </FormContainer>
      </IntlProvider>
    )
  }
}
