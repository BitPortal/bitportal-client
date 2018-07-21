import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text } from 'react-native'
import { Field, reduxForm } from 'redux-form/immutable'
import { FormContainer, TextField, TextAreaField, SubmitButton } from 'components/Form'
import { normalizeText, normalizeEOSAccountName } from 'utils/normalize'
import * as transferActions from 'actions/transfer'
import { eosAccountSelector } from 'selectors/eosAccount'
import { eosAssetBalanceSelector } from 'selectors/balance'
import styles from './styles'

const validate = (values) => {
  const errors = {}
  if (!values.get('name')) {
    errors.name = 'Please input account name'
  }

  if (!values.get('amount')) {
    errors.amount = 'Please input amount'
  } else if (!!values.get('amount') && values.get('amount') <= 0) {
    errors.amount = 'Amount must be more than 0'
  }

  return errors
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    transfer: state.transfer,
    eosAccount: eosAccountSelector(state),
    eosAssetBalance: eosAssetBalanceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transferActions
    }, dispatch)
  })
)

@reduxForm({ form: 'transferAssetsForm', validate })

export default class TransferAssetsForm extends Component {
  submit = (data) => {
    const fromAccount = this.props.eosAccount.get('account_name')
    console.log(data.set('fromAccount', fromAccount).toJS())
  }

  render() {
    const { handleSubmit, invalid, pristine, eosAssetBalance } = this.props
    const disabled = invalid || pristine
    const symbol = eosAssetBalance && eosAssetBalance.get('symbol')
    const balance = eosAssetBalance && eosAssetBalance.get('balance')

    return (
      <FormContainer>
        <Field
          label="Account Name"
          name="toAccount"
          component={TextField}
          normalize={normalizeEOSAccountName}
        />
        <Field
          label="Amount"
          name="quantity"
          component={TextField}
          keyboardType="numeric"
          info={balance && <Text style={styles.balance}>Balance: {balance} {symbol}</Text>}
        />
        <Field
          name="memo"
          placeholder="Memo..."
          component={TextAreaField}
        />
        <SubmitButton disabled={disabled} onPress={handleSubmit(this.submit)} text="Next" />
      </FormContainer>
    )
  }
}
