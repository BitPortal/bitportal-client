import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text } from 'react-native'
import { Field, reduxForm } from 'redux-form/immutable'
import { FormContainer, TextField, TextAreaField, SubmitButton } from 'components/Form'
import { normalizeText, normalizeEOSAccountName, normalizeUnitByFraction } from 'utils/normalize'
import { validateEOSAccountName } from 'utils/validate'
import * as transferActions from 'actions/transfer'
import * as eosAccountActions from 'actions/eosAccount'
import { eosAccountSelector } from 'selectors/eosAccount'
import { eosAssetBalanceSelector } from 'selectors/balance'
import styles from './styles'

const validate = (values, props) => {
  const { eosAssetBalance } = props
  const balance = eosAssetBalance && eosAssetBalance.get('balance')

  const errors = {}

  if (!values.get('toAccount')) {
    errors.toAccount = 'Please input account name'
  } else if (!validateEOSAccountName(values.get('toAccount'))) {
    errors.toAccount = 'Invalid eos account name'
  }

  if (!values.get('quantity')) {
    errors.quantity = 'Please input amount'
  } else if (!!values.get('quantity') && values.get('quantity') <= 0) {
    errors.quantity = 'Amount must be more than 0'
  } else if (balance && +values.get('quantity') > +balance) {
    errors.quantity = 'You don\'t have enought balance'
  }

  return errors
}

const asyncValidate = (values, dispatch, props, blurredField) => {
  if (blurredField === 'toAccount') {
    return new Promise((resolve, reject) => {
      props.actions.validateEOSAccountRequested({ field: blurredField, value: values.get(blurredField), resolve, reject })
    })
  } else {
    return new Promise(resolve => resolve())
  }
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
      ...transferActions,
      ...eosAccountActions
    }, dispatch)
  })
)

@reduxForm({ form: 'transferAssetsForm', validate, asyncValidate, asyncBlurFields: ['toAccount'] })

export default class TransferAssetsForm extends Component {
  submit = (data) => {
    this.props.blur('toAccount')
    const fromAccount = this.props.eosAccount.getIn(['data', 'account_name'])
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
          normalize={normalizeUnitByFraction(4)}
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
