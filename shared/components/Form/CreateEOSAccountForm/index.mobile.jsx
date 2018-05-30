/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { FormContainer, FieldItem, FieldInput, TextField, PasswordField, SubmitButton } from 'components/Form'
import PasswordStrength from 'components/PasswordStrength'
import { normalizeEOSAccountName } from 'utils/normalize'
import { getPasswordStrength } from 'utils'
import * as walletActions from 'actions/wallet'
import * as eosAccountActions from 'actions/eosAccount'

const validate = (values, props) => {
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
  constructor(props, context) {
    super(props, context)
    this.submit = this.submit.bind(this)
  }

  submit(data) {
    const bpid = this.props.wallet.get('data').get('bpid')
    this.props.actions.createEOSAccountRequested(data.set('bpid', bpid).toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, eosAccount } = this.props
    const loading = eosAccount.get('loading')
    const disabled = invalid || pristine || loading

    return (
      <FormContainer>
        <Field
          label="EOS Account Name"
          name="eosAccountName"
          component={TextField}
          normalize={normalizeEOSAccountName}
        />
        <Field
          label="Bitportal Wallet Password"
          name="password"
          component={PasswordField}
        />
        <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text="Create" />
      </FormContainer>
    )
  }
}
