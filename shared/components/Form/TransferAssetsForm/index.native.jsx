import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text } from 'react-native'
import { IntlProvider } from 'react-intl'
import { Field, reduxForm, formValueSelector, change } from 'redux-form/immutable'
import { Navigation } from 'react-native-navigation'
import { FormContainer, TextField, TextAreaField, SubmitButton } from 'components/Form'
import { normalizeEOSAccountName, normalizeUnitByFraction, normalizeMemo } from 'utils/normalize'
import * as transferActions from 'actions/transfer'
import * as eosAccountActions from 'actions/eosAccount'
import { eosAccountSelector } from 'selectors/eosAccount'
import { eosAssetBalanceSelector } from 'selectors/balance'
import { eosPriceSelector } from 'selectors/ticker'
import TransferCard from 'screens/Assets/AssetsTransfer/TransferCard'
import Prompt from 'components/Prompt'
import Alert from 'components/Alert'
import ContactIcon from 'components/FormRightContent/TransferContact'
import CurrencyUnit from 'components/FormRightContent/TransferCurrency'
import messages from './messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.snd_title_error_psw
    default:
      if (!~String(message).indexOf('net usage of transaction is too high')) {
        return messages.snd_title_error_hinet
      } else if (!~String(message).indexOf('cpu usage of transaction is too high')) {
        return messages.snd_title_error_hicpu
      }

      return messages.snd_txtbox_tras_err
  }
}

const validate = (values, props) => {
  const { eosAssetBalance } = props
  const balance = eosAssetBalance && eosAssetBalance.get('balance')

  const errors = {}

  if (!values.get('toAccount')) {
    errors.toAccount = messages[props.locale].snd_txtbox_acc_warning
  } else if (values.get('toAccount').length > 12) {
    errors.toAccount = messages[props.locale].snd_txtbox_acc_warning2
  }

  if (!values.get('quantity')) {
    errors.quantity = messages[props.locale].snd_txtbox_amn_warning
  } else if (!!values.get('quantity') && values.get('quantity') <= 0) {
    errors.quantity = messages[props.locale].snd_txtbox_amn_warning2
  } else if (balance && +values.get('quantity') > +balance) {
    errors.quantity = messages[props.locale].snd_txtbox_bls_warning
  }

  return errors
}

const asyncValidate = (values, dispatch, props) => new Promise((resolve, reject) => {
  props.actions.validateEOSAccountRequested({
    field: 'toAccount',
    value: props.toAccount,
    errorMessage: messages[props.locale].snd_title_error_invact,
    resolve,
    reject
  })
})

@connect(
  state => ({
    locale: state.intl.get('locale'),
    transfer: state.transfer,
    eosAccount: eosAccountSelector(state),
    eosAssetBalance: eosAssetBalanceSelector(state),
    eosPrice: eosPriceSelector(state),
    quantity: formValueSelector('transferAssetsForm')(state, 'quantity'),
    toAccount: formValueSelector('transferAssetsForm')(state, 'toAccount')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transferActions,
      ...eosAccountActions,
      change
    }, dispatch)
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

  showModal = (data) => {
    const { eosAssetBalance } = this.props
    const symbol = eosAssetBalance && eosAssetBalance.get('symbol')
    this.setState({ quantity: data.get('quantity'), toAccount: data.get('toAccount'), memo: data.get('memo'), symbol }, () => {
      this.props.actions.openTransferModal()
    })
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

  fillToAccount = (eosAccountName) => {
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
    const { handleSubmit, invalid, pristine, eosAssetBalance, eosPrice, quantity, transfer, locale } = this.props
    const disabled = invalid || pristine
    const symbol = eosAssetBalance && eosAssetBalance.get('symbol')
    const balance = eosAssetBalance && eosAssetBalance.get('balance')
    const error = transfer.get('error')
    const showModal = transfer.get('showModal')

    return (
      <IntlProvider messages={messages[locale]}>
        <FormContainer>
          <Field
            label={messages[locale].snd_title_name_accnm}
            name="toAccount"
            component={TextField}
            rightContent={<ContactIcon onPress={this.getContactInfo} />}
            normalize={normalizeEOSAccountName}
          />
          <Field
            label={messages[locale].snd_title_name_amt}
            name="quantity"
            component={TextField}
            rightContent={<CurrencyUnit quantity={+quantity * +eosPrice} />}
            keyboardType="numeric"
            normalize={normalizeUnitByFraction(4)}
            info={balance && <Text style={styles.balance}>{messages[locale].snd_title_name_bln} {balance} {symbol}</Text>}
          />
          <Field
            name="memo"
            placeholder={messages[locale].snd_txtbox_txt_rmk}
            component={TextAreaField}
            normalize={normalizeMemo}
          />
          <SubmitButton disabled={disabled} onPress={handleSubmit(this.showModal)} text={messages[locale].snd_button_name_nxt} />
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
            type="secure-text"
            callback={this.submit}
            dismiss={this.closePrompt}
          />
        </FormContainer>
      </IntlProvider>
    )
  }
}
