import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, ScrollView } from 'react-native'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import * as keystoreActions from 'actions/keystore'
import { logoutRequested, clearLogoutError } from 'actions/wallet'
import { WALLET_MGT_EXPORT, WALLET_MGT_RESET_PW, WALLET_MGT_LOGOUT } from 'constants/analytics'
import { onEventWithLabel } from 'utils/analytics'
import Loading from 'components/Loading'
import Alert from 'components/Alert'
import Prompt from 'components/Prompt'
import messages from './messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.act_export_popup_ivps
    default:
      return messages.act_export_popup_faex
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
  { withRef: true }
)

export default class AccountList extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    showExportPrompt: false,
    showLogoutPrompt: false
  }

  resetPassword = () => {
    // Umeng analutics
    onEventWithLabel(WALLET_MGT_RESET_PW, "管理钱包 - 重置密码")
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ResetPassword'
      }
    })
  }

  exportAccount = (password) => {
    // Umeng analutics
    onEventWithLabel(WALLET_MGT_EXPORT, "管理钱包 - 导出私钥")
    this.props.actions.exportEOSKeyRequested({
      password,
      componentId: this.props.componentId,
      origin: this.props.origin,
      bpid: this.props.bpid,
      eosAccountName: this.props.eosAccountName
    })
  }

  logout = (password) => {
    // Umeng analutics
    onEventWithLabel(WALLET_MGT_LOGOUT, "管理钱包 - 登出")
    this.props.actions.logoutRequested({
      password,
      componentId: this.props.componentId,
      origin: this.props.origin,
      bpid: this.props.bpid,
      eosAccountName: this.props.eosAccountName,
      coin: this.props.coin
    })
  }

  showExportPrompt = () => {
    this.setState({ showExportPrompt: true })
  }

  dismissExportPrompt = () => {
    this.setState({ showExportPrompt: false })
  }

  showLogoutPrompt = () => {
    this.setState({ showLogoutPrompt: true })
  }

  dismissLogoutPrompt = () => {
    this.setState({ showLogoutPrompt: false })
  }

  render() {
    const { locale, exporting, error, loggingOut, logoutError } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].act_card_title_nav}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <SettingItem
                leftItemTitle={<FormattedMessage id="act_sec_title_export" />}
                onPress={this.showExportPrompt}
                extraStyle={{ marginTop: 10 }}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="act_sec_title_rspsw" />}
                onPress={this.resetPassword}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="act_sec_title_logout" />}
                onPress={this.showLogoutPrompt}
                extraStyle={{ marginTop: 10 }}
                leftTitleStyle={{ color: Colors.textColor_255_76_118 }}
              />
              <Loading isVisible={exporting} text={messages[locale].logout_popup_exporting} />
              <Loading isVisible={loggingOut} text={messages[locale].logout_popup_deleting} />
              <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearKeystoreError} delay={500} />
              <Alert message={errorMessages(logoutError, messages[locale])} dismiss={this.props.actions.clearLogoutError} delay={500} />
              <Prompt
                isVisible={this.state.showExportPrompt}
                title={messages[locale].act_export_popup_name}
                negativeText={messages[locale].act_export_popup_can}
                positiveText={messages[locale].act_export_popup_ent}
                type="secure-text"
                callback={this.exportAccount}
                dismiss={this.dismissExportPrompt}
              />
              <Prompt
                isVisible={this.state.showLogoutPrompt}
                title={messages[locale].act_export_popup_name}
                message={messages[locale].logout_popup_warning}
                negativeText={messages[locale].act_export_popup_can}
                positiveText={messages[locale].act_export_popup_ent}
                type="secure-text"
                callback={this.logout}
                dismiss={this.dismissLogoutPrompt}
              />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
