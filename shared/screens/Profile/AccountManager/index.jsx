/* @tsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, ScrollView, Platform } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import * as keystoreActions from 'actions/keystore'
import { logoutRequested, clearLogoutError } from 'actions/wallet'
import Loading from 'components/Loading'
import Alert from 'components/Alert'
import Dialogs from 'components/Dialog'
import DialogAndroid from 'components/DialogAndroid'
import messages from './messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.actexport_popup_ivps
    default:
      return messages.actexport_popup_faex
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    exporting: state.keystore.get('exporting'),
    error: state.keystore.get('error'),
    loggingOut: state.wallet.get('loggingOut'),
    logoutError: state.wallet.get('logoutError')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...keystoreActions,
      logoutRequested,
      clearLogoutError
    }, dispatch)
  }),
  null,
  { withRef : true }
)

export default class AccountList extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    isVisible: false,
    password: '',
    type: ''
  }

  deleteAccount = () => {

  }

  resetPassword = () => {
    this.push({ screen: 'BitPortal.ResetPassword' })
  }

  exportAccount = (password) => {
    this.props.actions.exportEOSKeyRequested({
      password,
      origin: this.props.origin,
      bpid: this.props.bpid,
      eosAccountName: this.props.eosAccountName
    })
  }

  logout = (password) => {
    this.props.actions.logoutRequested({
      password,
      origin: this.props.origin,
      bpid: this.props.bpid,
      eosAccountName: this.props.eosAccountName,
      coin: this.props.coin,
    })
  }

  handleExport = async () => {
    const messagesInfo = messages[this.props.locale]
    if (Platform.OS === 'android') {
      this.setState({ isVisible: true, type: 'exportAccount' })
    } else {
      const { action, text } = await Dialogs.prompt(
        messagesInfo.actexport_popup_name,
        '',
        {
          positiveText: messagesInfo.actexport_popup_ent,
          negativeText: messagesInfo.actexport_popup_can
        }
      )
      if (action === Dialogs.actionPositive) {
        this.exportAccount(text)
      }
    }
  }

  handleLogout = async () => {
    const messagesInfo = messages[this.props.locale]
    if (Platform.OS === 'android') {
      this.setState({ isVisible: true, type: 'logout' })
    } else {
      const { action, text } = await Dialogs.prompt(
        messagesInfo.actexport_popup_name,
        messagesInfo.logout_popup_warning,
        {
          positiveText: messagesInfo.actexport_popup_ent,
          positiveTextStyle: 'destructive',
          negativeText: messagesInfo.actexport_popup_can
        }
      )
      if (action === Dialogs.actionPositive) {
        this.logout(text)
      }
    }
  }

  handleConfirm = () => {
    const { type, password } = this.state
    this.setState({ isVisible: false }, () => {
      if (type === 'logout') this.logout(password)
      else this.exportAccount(password)
    })
  }

  render() {
    const { locale, name, exporting, error, loggingOut, logoutError } = this.props
    const { type } = this.state

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={name}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              {/* <TotalAssetsCard totalAssets={0} accountName={eosAccountName} disabled={true} /> */}
              {/* <SettingItem leftItemTitle={<FormattedMessage id="act_sec_title_change" />} onPress={() => this.resetPassword()} extraStyle={{ marginTop: 10 }} /> */}
              <SettingItem
                leftItemTitle={<FormattedMessage id="act_sec_title_export" />}
                onPress={this.handleExport}
                extraStyle={{ marginTop: 10 }}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="act_sec_title_logout" />}
                onPress={this.handleLogout}
                extraStyle={{ marginTop: 10 }}
                leftTitleStyle={{ color: Colors.textColor_255_76_118 }}
              />
              {
                Platform.OS === 'android' &&
                <DialogAndroid
                  tilte={messages[locale].actexport_popup_name}
                  content={type === 'logout' ? messages[locale].logout_popup_warning : ''}
                  positiveText={messages[locale].actexport_popup_ent}
                  negativeText={messages[locale].actexport_popup_can}
                  onChange={password => this.setState({ password })}
                  isVisible={this.state.isVisible}
                  handleCancel={() => this.setState({ isVisible: false })}
                  handleConfirm={this.handleConfirm}
                />
              }
              <Loading isVisible={exporting} text={messages[locale].logout_popup_exporting} />
              <Loading isVisible={loggingOut} text={messages[locale].logout_popup_deleting} />
              <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearError} delay={500} />
              <Alert message={errorMessages(logoutError, messages[locale])} dismiss={this.props.actions.clearLogoutError} delay={500} />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
