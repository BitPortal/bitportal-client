import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text } from 'react-native'
import { IntlProvider } from 'react-intl'
import { Field, reduxForm } from 'redux-form/immutable'
import { FormContainer, TextField, TextAreaField, SubmitButton } from 'components/Form'
import { normalizeText, normalizeEOSAccountName, normalizeUnitByFraction, normalizeMemo } from 'utils/normalize'
import { validateEOSAccountName } from 'utils/validate'
import * as transferActions from 'actions/transfer'
import * as eosAccountActions from 'actions/eosAccount'
import { eosAccountSelector } from 'selectors/eosAccount'
import { eosAssetBalanceSelector } from 'selectors/balance'
import TransferCard from 'screens/Assets/AssetsTransfer/TransferCard'
import Prompt from 'components/Prompt'
import Alert from 'components/Alert'
import messages from './messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    default:
      return 'Transfer Failed!'
  }
}

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
  return new Promise((resolve, reject) => {
    props.actions.validateEOSAccountRequested({ field: 'toAccount', value: values.get('toAccount'), resolve, reject })
  })
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
  state = {
    showModal: false,
    quantity: null,
    symbol: null,
    toAccount: null,
    memo: null,
    showPrompt: false
  }

  showModal = (data) => {
    const { eosAssetBalance } = this.props
    const symbol = eosAssetBalance && eosAssetBalance.get('symbol')
    this.setState({ showModal: true, quantity: data.get('quantity'), toAccount: data.get('toAccount'), memo: data.get('memo'), symbol }, () => {
      this.props.actions.openTransferModal()
    })
  }

  closeModal = () => {
    this.props.actions.closeTransferModal()
    this.setState({
      showModal: false,
      quantity: null,
      symbol: null,
      toAccount: null,
      memo: null
    })
  }

  showPrompt = () => {
    this.setState({ showPrompt: true })
  }

  closePrompt = () => {
    this.setState({ showPrompt: false })
  }

  submit = (password) => {
    const fromAccount = this.props.eosAccount.getIn(['data', 'account_name'])

    this.props.actions.transferRequested({
      fromAccount,
      password,
      quantity: this.state.quantity,
      symbol: this.state.symbol,
      toAccount: this.state.toAccount,
      memo: this.state.memo,
      componentId: this.props.componentId
    })
  }

  render() {
    const { handleSubmit, invalid, pristine, eosAssetBalance, transfer, locale } = this.props
    const disabled = invalid || pristine
    const symbol = eosAssetBalance && eosAssetBalance.get('symbol')
    const balance = eosAssetBalance && eosAssetBalance.get('balance')
    const error = transfer.get('error')
    const showModal = transfer.get('showModal')

    return (
      <IntlProvider messages={messages[locale]}>
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
            normalize={normalizeMemo}
          />
          <SubmitButton disabled={disabled} onPress={handleSubmit(this.showModal)} text="Next" />
          <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearTransferError} delay={500} />
          <TransferCard
            isVisible={showModal}
            dismiss={this.closeModal}
            quantity={this.state.quantity}
            toAccount={this.state.toAccount}
            memo={this.state.memo}
            symbol={this.state.symbol}
            transfer={this.showPrompt}
            loading={transfer.get('loading')}
          />
          <Prompt
            isVisible={this.state.showPrompt}
            title="Please input password"
            negativeText="cancel"
            positiveText="confirm"
            type="secure-text"
            callback={this.submit}
            dismiss={this.closePrompt}
          />
        </FormContainer>
      </IntlProvider>
    )
  }
}
