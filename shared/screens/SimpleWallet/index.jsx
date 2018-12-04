import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Navigation } from 'react-native-navigation'
import FastImage from 'react-native-fast-image'
import * as simpleWalletActions from 'actions/simpleWallet'
import DappAuthForm from 'components/Form/DappAuthForm'
import Prompt from 'components/Prompt'
import Loading from 'components/Loading'
import Alert from 'components/Alert'

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
    default:
      return messages.scan_simplewallet_signin_auth_failed
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    loading: state.simpleWallet.get('loading'),
    activeWallet: state.wallet.get('data'),
    eosAccountName: eosAccountNameSelector(state),
    error: state.simpleWallet.get('error'),
    loaded: state.simpleWallet.get('loaded')
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
export default class SimpleWalletAuth extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = { showPasswordPrompt: false }

  componentWillUnmount() {
    this.props.actions.clearSWError()
  }

  successMessage = success => {
    if (!success) return null
    else if (success) return messages.scan_simplewallet_signin_auth_success
  }

  submitSWAuth = password => {
    const { uuID, loginUrl, protocol, version } = this.props.payload
    const { eosAccountName, activeWallet } = this.props
    const timestamp = Math.floor(Date.now() / 1000)
    const ref = 'BitPortal'
    this.props.actions.loginSWAuthRequested({
      timestamp,
      eosAccountName,
      uuID,
      ref,
      loginUrl,
      password,
      activeWallet,
      protocol,
      version
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

  render() {
    const {
      locale,
      payload,
      payload: { dappIcon, dappName },
      loading,
      error,
      loaded
    } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          title={messages[locale].scan_simplewallet_signin_title_authorize}
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              <View style={{ padding: 15 }}>
                <FastImage style={styles.icon} source={{ uri: dappIcon }} />
                <Text style={styles.text14}>{dappName}</Text>
              </View>
              <DappAuthForm payload={payload} onCancel={this.onCancel} onSubmit={this.showPasswordPrompt} />
              <Alert
                message={errorMessages(error, messages[locale])}
                dismiss={this.props.actions.clearSWError}
                delay={500}
              />
              <Alert
                message={loaded ? messages[locale].scan_simplewallet_signin_auth_success : 'alert'}
                dismiss={() => {
                  Navigation.popToRoot(this.props.componentId)
                }}
                delay={1000}
              />

              <Prompt
                isVisible={this.state.showPasswordPrompt}
                title={messages[locale].general_popup_label_password}
                negativeText={messages[locale].general_popup_button_cancel}
                positiveText={messages[locale].general_popup_button_confirm}
                type="secure-text"
                callback={this.submitSWAuth}
                dismiss={this.dismissPasswordPrompt}
              />
            </View>
          </ScrollView>
        </View>
        <Loading isVisible={loading} text={messages[locale].scan_simplewallet_signin_popup_authorizing} />
      </View>
    )
  }
}
