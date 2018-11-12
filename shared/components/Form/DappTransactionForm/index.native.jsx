import React, { Component } from 'react'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { FormContainer, TextField, TextAreaField, SubmitButton, Button } from 'components/Form'
import { eosAccountSelector, eosAccountNameSelector } from 'selectors/eosAccount'
import * as simpleWalletActions from 'actions/simpleWallet'
import { IntlProvider, FormattedMessage } from 'react-intl'
import messages from 'resources/messages'

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
@reduxForm({ form: 'DappTransactionForm', validate })
export default class DappTransactionForm extends Component {
  isExpired = () => Math.floor(Date.now() / 1000) > this.props.payload.expired

  render() {
    console.log('DappTransactionForm eosaccountselector', this.props.eosAccount, this.props.eosAccountName, this.props)
    const {
      locale,
      payload: { from, to, contract, desc, dappData }
    } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={messages[locale].scan_simplewallet_trade_label_drawee}
            name="dappTransactionDrawee"
            component={TextField}
            props={{ value: from, editable: false }}
          />
          <Field
            label={messages[locale].scan_simplewallet_trade_label_payee}
            name="dappTransactionPayee"
            component={TextField}
            props={{ value: to, editable: false }}
          />
          <Field
            label={messages[locale].scan_simplewallet_trade_label_contract}
            name="dappTransactionContract"
            component={TextField}
            props={{ value: contract, editable: false }}
          />
          <Field
            label={messages[locale].scan_simplewallet_trade_label_memo}
            name="dappTransactionMemo"
            component={TextAreaField}
            props={{ value: dappData, editable: false }}
          />
          {desc ? (
            <Field
              label={messages[locale].scan_simplewallet_trade_label_desc}
              name="dappTransactionDesc"
              component={TextAreaField}
              props={{ value: desc, editable: false }}
            />
          ) : null}

          <View style={{ paddingTop: 0, paddingBottom: 10 }} />

          <Button
            style={{ backgroundColor: 'red' }}
            text={<FormattedMessage id="scan_simplewallet_signin_button_cancel" />}
            onPress={this.props.onCancel}
          />
          <SubmitButton
            disabled={this.isExpired()}
            text={
              <FormattedMessage
                id={
                  this.isExpired() ? 'scan_simplewallet_signin_popup_expiredcode' : 'scan_simplewallet_trade_continue'
                }
              />
            }
            onPress={this.props.onSubmit}
          />
        </FormContainer>
      </IntlProvider>
    )
  }
}
