import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { FormContainer, TextField, SubmitButton, CancelButton } from 'components/Form'
import { eosAccountSelector, eosAccountNameSelector } from 'selectors/eosAccount'
import * as simpleWalletActions from 'actions/simpleWallet'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messages from 'resources/messages'
import styles from './styles'

const validate = () => {}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state),
    eosAccountName: eosAccountNameSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...simpleWalletActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
@reduxForm({ form: 'dappAuthForm', validate })
export default class DappAuthForm extends Component {
  isExpired = () => Math.floor(Date.now() / 1000) > this.props.payload.expired

  render() {
    const { locale, eosAccountName } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <View
            style={{
              width: '100%',
              paddingTop: 0,
              paddingBottom: 20
            }}
          >
            <Text style={[styles.text14, { color: 'white' }]}>
              <FormattedMessage id="scan_simplewallet_signin_label_authority" />
              {'\n\n●  '}
              <FormattedMessage id="scan_simplewallet_signin_text_login" />
              {'\n'}
            </Text>
            <Text style={styles.text14}>
              <FormattedMessage id="scan_simplewallet_signin_text_warning" />
            </Text>
          </View>
          <Field
            label={messages[locale].scan_simplewallet_signin_label_account}
            placeholder="placeholder"
            name="dappAccountSelect"
            component={TextField}
            props={{ value: eosAccountName, editable: false }}
          />
          {/* <Field
            label={messages[locale].scan_simplewallet_signin_label_account}
            name="dappAccountDropdown"
            component={Dropdown}
            props={{ options: ['Option1', 'Option2'] }}
          /> */}
          <SubmitButton
            disabled={this.isExpired()}
            text={
              <FormattedMessage
                id={
                  this.isExpired()
                    ? 'scan_simplewallet_signin_popup_expiredcode'
                    : 'scan_simplewallet_signin_button_confirm'
                }
              />
            }
            onPress={this.props.onSubmit}
          />
          <CancelButton
            style={{ backgroundColor: 'red' }}
            text={<FormattedMessage id="scan_simplewallet_signin_button_cancel" />}
            onPress={this.props.onCancel}
          />
        </FormContainer>
      </IntlProvider>
    )
  }
}
