import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text } from 'react-native'
import { IntlProvider } from 'react-intl'
import { Field, reduxForm, formValueSelector, change } from 'redux-form/immutable'
import { Navigation } from 'react-native-navigation'
import { FormContainer, TextField, TextAreaField, SubmitButton } from 'components/Form'
import { normalizeUnitByFraction } from 'utils/normalize'
import { validateEOSAccountName } from 'utils/validate'
import * as transferActions from 'actions/transfer'
import * as eosAccountActions from 'actions/eosAccount'
import * as balanceActions from 'actions/balance'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { activeAssetSelector, activeAssetBalanceSelector } from 'selectors/balance'
import { eosPriceSelector } from 'selectors/ticker'
import TransferCard from 'screens/Assets/AssetsTransfer/TransferCard'
import Prompt from 'components/Prompt'
import Alert from 'components/Alert'
import ContactIcon from 'components/FormRightContent/TransferContact'
import CurrencyUnit from 'components/FormRightContent/TransferCurrency'
import messages from 'resources/messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) {
    return null
  }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.general_error_popup_text_password_incorrect
    case 'EOS System Error':
      return messages.resource_error_popup_text_eos_system_error
    default:
      return messages.send_error_popup_text_send_failed
  }
}

export const errorMessageDetail = error => {
  if (!error || typeof error !== 'object') {
    return null
  }

  return error.detail
}

const validate = (values, props) => {
  const { activeAssetBalance } = props
  const balance = activeAssetBalance

  const errors = {}

  if (!values.get('toAccount')) {
    errors.toAccount = messages[props.locale].send_error_text_account_name
  } else if (values.get('toAccount') && validateEOSAccountName(values.get('toAccount'))) {
    errors.toAccount = messages[props.locale].send_error_text_account_name_invalid
  }

  if (!values.get('quantity')) {
    errors.quantity = messages[props.locale].send_error_text_amount
  } else if (!!values.get('quantity') && values.get('quantity') <= 0) {
    errors.quantity = messages[props.locale].send_error_text_amount_invalid
  } else if (balance && +values.get('quantity') > +balance) {
    errors.quantity = messages[props.locale].send_error_text_balance_insufficient
  }

  return errors
}

const asyncValidate = (values, dispatch, props) =>
  new Promise((resolve, reject) => {
    props.actions.validateEOSAccountRequested({
      field: 'toAccount',
      value: props.toAccount,
      errorMessage: messages[props.locale].send_error_popup_text_account_not_exist,
      resolve,
      reject
    })
  })

@connect(
  state => ({
    locale: state.intl.get('locale'),
    transfer: state.transfer,
    activeAsset: activeAssetSelector(state),
    activeAssetBalance: activeAssetBalanceSelector(state),
    eosPrice: eosPriceSelector(state),
    quantity: formValueSelector('transferAssetsForm')(state, 'quantity'),
    toAccount: formValueSelector('transferAssetsForm')(state, 'toAccount'),
    eosAccountName: eosAccountNameSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...transferActions,
        ...eosAccountActions,
        ...balanceActions,
        change
      },
      dispatch
    )
  })
)
@reduxForm({ form: 'transferAssetsForm', validate, asyncValidate, asyncBlurFields: ['toAccount'] })
export default class TransferAssetsForm extends Component {
  state = {
    quantity: null,
    symbol: null,
    toAccount: null,
    memo: null,
    showPrompt: false
  }

  showModal = data => {
    const { activeAsset } = this.props
    const symbol = activeAsset.get('symbol')
    this.setState(
      { quantity: data.get('quantity'), toAccount: data.get('toAccount'), memo: data.get('memo'), symbol },
      () => {
        this.props.actions.openTransferModal()
      }
    )
  }

  closeModal = () => {
    this.props.actions.closeTransferModal()
    this.setState({
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

  fillToAccount = eosAccountName => {
    this.props.actions.change('transferAssetsForm', 'toAccount', eosAccountName)
  }

  getContactInfo = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.Contacts',
        passProps: {
          onRowPress: this.fillToAccount
        }
      }
    })
  }

  submit = password => {
    const fromAccount = this.props.eosAccountName

    this.props.actions.transferRequested({
      fromAccount,
      password,
      quantity: this.state.quantity,
      symbol: this.state.symbol,
      toAccount: this.state.toAccount,
      memo: this.state.memo,
      contract: this.props.activeAsset.get('contract'),
      componentId: this.props.componentId
    })
  }

  componentDidMount() {
    const { activeAsset, eosAccountName } = this.props
    this.props.actions.getEOSAssetBalanceRequested({
      code: activeAsset.get('contract'),
      eosAccountName,
      symbol: activeAsset.get('symbol')
    })
  }

  render() {
    const {
      handleSubmit,
      invalid,
      pristine,
      activeAsset,
      activeAssetBalance,
      eosPrice,
      quantity,
      transfer,
      locale,
      accountName,
      amount,
      memo
    } = this.props
    const disabled = invalid || pristine
    const symbol = activeAsset.get('symbol')
    const balance = activeAssetBalance
    const error = transfer.get('error')
    const showModal = transfer.get('showModal')
    const price = symbol === 'EOS' ? eosPrice : 0
    const contract = activeAsset.get('contract')

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={messages[locale].send_label_account_name}
            name="toAccount"
            component={TextField}
            rightContent={<ContactIcon onPress={this.getContactInfo} />}
            props={{ value: accountName }}
          />
          <Field
            label={messages[locale].send_label_amount}
            name="quantity"
            component={TextField}
            rightContent={<CurrencyUnit quantity={+quantity * +price} />}
            keyboardType="numeric"
            normalize={normalizeUnitByFraction(4)}
            info={
              balance && (
                <Text style={styles.balance}>
                  {messages[locale].send_label_balance} {balance} {symbol}
                </Text>
              )
            }
            props={{ value: amount }}
          />
          <Field
            label={messages[locale].send_label_contract}
            name="contract"
            component={TextField}
            props={{ value: contract, editable: false }}
          />
          <Field
            name="memo"
            placeholder={messages[locale].send_text_memo}
            component={TextAreaField}
            props={{ value: memo }}
          />
          <SubmitButton
            disabled={disabled}
            onPress={handleSubmit(this.showModal)}
            text={messages[locale].send_button_send}
          />
          <Alert
            message={errorMessages(error, messages[locale])}
            subMessage={errorMessageDetail(error)}
            dismiss={this.props.actions.clearTransferError}
            delay={500}
          />
          <TransferCard
            isVisible={showModal}
            dismiss={this.closeModal}
            quantity={this.state.quantity}
            toAccount={this.state.toAccount}
            memo={this.state.memo}
            symbol={this.state.symbol}
            transfer={this.showPrompt}
          />
          <Prompt
            isVisible={this.state.showPrompt}
            type="secure-text"
            callback={this.submit}
            dismiss={this.closePrompt}
          />
        </FormContainer>
      </IntlProvider>
    )
  }
}
