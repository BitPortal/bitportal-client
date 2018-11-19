import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { change } from 'redux-form/immutable'
import * as balanceActions from 'actions/balance'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { tokenBalanceAllDataSelector } from 'selectors/balance'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import TransferAssetsForm from 'components/Form/TransferAssetsForm'
import { checkCamera } from 'utils/permissions'
import Loading from 'components/Loading'
import Alert from 'components/Alert'
import assert from 'assert'

import messages from 'resources/messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) {
    return null
  }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    default:
      return messages.send_error_popup_asset_unavailable
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    transfer: state.transfer,
    tokenBalance: tokenBalanceAllDataSelector(state),
    userEOSAccountName: eosAccountNameSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        change,
        ...balanceActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class AssetsTransfer extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = { error: null }

  scanner = async () => {
    if (this.props.entry === 'scanner') {
      Navigation.pop(this.props.componentId)
    } else {
      const authorized = await checkCamera(this.props.locale)
      if (authorized) {
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.QRCodeScanner',
            passProps: {
              entry: 'form'
            }
          }
        })
      }
    }
  }

  transferAsset = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionRecord'
      }
    })
  }

  componentDidMount() {
    const qrInfo = this.props.qrInfo
    const entry = this.props.entry

    this.handleDeepLink()

    if (entry === 'scanner' && qrInfo) {
      const qrEOSAccountName = qrInfo.eosAccountName
      const qrQuantity = qrInfo.amount

      if (qrEOSAccountName) this.props.actions.change('transferAssetsForm', 'toAccount', qrEOSAccountName)
      if (qrQuantity) this.props.actions.change('transferAssetsForm', 'quantity', qrQuantity)
    }
  }

  handleDeepLink = () => {
    if (this.props.asset) {
      try {
        const deepLinkAsset = this.props.tokenBalance
          .get(this.props.userEOSAccountName)
          .filter(e => e.get('symbol') === this.props.asset)
          .get(0)
        assert(deepLinkAsset, 'invalid asset!')
        this.props.actions.setActiveAsset(deepLinkAsset)
      } catch (e) {
        this.setState({ error: errorMessages(e, messages[this.props.locale]) })
      }
    }
    if (this.props.accountName) this.props.actions.change('transferAssetsForm', 'toAccount', this.props.accountName)
    if (this.props.amount) this.props.actions.change('transferAssetsForm', 'quantity', this.props.amount)
    if (this.props.memo) this.props.actions.change('transferAssetsForm', 'memo', this.props.memo)
  }

  render() {
    const { locale, transfer, accountName, amount, memo } = this.props
    const loading = transfer.get('loading')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].send_title_send}
            leftButton={
              <CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />
            }
            rightButton={<CommonRightButton iconName="md-qr-scanner" onPress={() => this.scanner()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TransferAssetsForm
                componentId={this.props.componentId}
                accountName={accountName}
                amount={amount}
                memo={memo}
              />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
          <Alert
            message={errorMessages(this.state.error, messages[locale])}
            dismiss={() => Navigation.pop(this.props.componentId)}
            delay={500}
          />
        </View>
      </IntlProvider>
    )
  }
}
