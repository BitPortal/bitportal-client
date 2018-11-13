import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { FormattedMessage, IntlProvider, FormattedNumber } from 'react-intl'
import { Navigation } from 'react-native-navigation'
import FastImage from 'react-native-fast-image'
import * as simpleWalletActions from 'actions/simpleWallet'
import * as transferActions from 'actions/transfer'
import DappTransactionForm from 'components/Form/DappTransactionForm'
import Prompt from 'components/Prompt'
import Loading from 'components/Loading'
import Alert from 'components/Alert'
import TransferCard from 'screens/Assets/AssetsTransfer/TransferCard'

import { eosAccountNameSelector } from 'selectors/eosAccount'

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

@connect(
  state => ({
    locale: state.intl.get('locale'),
    // loading: state.simpleWallet.get('loading'),
    loading: state.transfer.get('loading'),
    wallet: state.wallet.get('classicWalletList'),
    eosAccountName: eosAccountNameSelector(state),
    // error: state.simpleWallet.get('error'),
    error: state.transfer.get('error'),
    // loaded: state.simpleWallet.get('loaded'),
    loaded: state.transfer.get('loaded'),
    showModal: state.transfer.get('showModal')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...simpleWalletActions,
        ...transferActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class SimpleWalletTransaction extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    quantity: null,
    symbol: null,
    toAccount: null,
    memo: null,
    showPasswordPrompt: false
  }

  componentWillUnmount() {
    this.props.actions.clearTransferError()
  }

  successMessage = success => {
    if (!success) return null
    else if (success) return messages.scan_simplewallet_signin_auth_success
  }

  submitSWTransfer = password => {
    const { fromAccount, quantity, symbol, toAccount, memo, contract, callback } = this.state

    this.props.actions.transferRequested({
      fromAccount,
      password,
      quantity,
      symbol,
      toAccount,
      memo,
      contract,
      callback,
      componentId: this.props.componentId
    })
  }

  onCancel = () => {
    Navigation.pop(this.props.componentId)
  }

  showPasswordPrompt = () => {
    this.setState({ showPasswordPrompt: true })
  }

  dismissPasswordPrompt = () => {
    this.setState({ showPasswordPrompt: false })
  }

  showModal = () => {
    // const { activeAsset } = this.props
    const { symbol, amount, to, desc, contract, from, callback } = this.props.payload
    this.setState({ quantity: amount, fromAccount: from, toAccount: to, memo: desc, symbol, contract, callback }, () => {
      this.props.actions.openTransferModal()
    })
    // this.props.actions.openTransferModal()
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

  showPasswordPrompt = () => {
    this.setState({ showPasswordPrompt: true })
  }

  closePasswordPrompt = () => {
    this.setState({ showPasswordPrompt: false })
  }

  render() {
    const {
      locale,
      payload,
      payload: { dappIcon, dappName, amount, symbol, precision },
      loading,
      error,
      loaded,
      showModal
    } = this.props

    console.log('transaction props', this.props, loaded)
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={
              <CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />
            }
            title={messages[locale].scan_simplewallet_trade_title_order}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                <FastImage style={styles.icon} source={{ uri: dappIcon }} />
                <Text style={[styles.text16, { fontWeight: 'bold' }]}>{dappName}</Text>
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.amountWrapper}>
                  <Text style={[styles.text14, { paddingBottom: 10 }]}>
                    <FormattedMessage id="scan_simplewallet_trade_label_amount" />
                  </Text>
                  <Text style={styles.text22}>
                    {
                      <FormattedNumber
                        value={amount}
                        maximumFractionDigits={precision}
                        minimumFractionDigits={precision}
                      />
                    }{' '}
                    {`${symbol}`}
                  </Text>
                </View>
              </View>
              <View style={styles.contentContainer}>
                <DappTransactionForm payload={payload} onCancel={this.onCancel} onSubmit={this.showModal} />
                <Alert
                  message={errorMessages(error, messages[locale])}
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
                  transfer={this.showPasswordPrompt}
                />
                <Prompt
                  isVisible={this.state.showPasswordPrompt}
                  title={messages[locale].general_popup_label_password}
                  negativeText={messages[locale].general_popup_button_cancel}
                  positiveText={messages[locale].general_popup_button_confirm}
                  type="secure-text"
                  callback={this.submitSWTransfer}
                  dismiss={this.dismissPasswordPrompt}
                />
                <Loading isVisible={loading} text={messages[locale].send_button_send} />
              </View>
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
