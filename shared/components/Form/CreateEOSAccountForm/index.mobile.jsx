import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { FormContainer, TextField, PasswordField, SubmitButton } from 'components/Form'
import { normalizeEOSAccountName } from 'utils/normalize'
import * as walletActions from 'actions/wallet'
import * as eosAccountActions from 'actions/eosAccount'

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
  submit = (data) => {
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
          label="BitPortal Wallet Password"
          name="password"
          component={PasswordField}
        />
        <SubmitButton disabled={disabled} loading={loading} onPress={handleSubmit(this.submit)} text="Create" />
      </FormContainer>
    )
  }
}
