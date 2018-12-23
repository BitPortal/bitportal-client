import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, ScrollView, Clipboard } from 'react-native'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import * as keystoreActions from 'actions/keystore'
import { logoutRequested, clearLogoutError } from 'actions/wallet'
import { WALLET_MGT_EXPORT, WALLET_MGT_RESET_PW, WALLET_MGT_LOGOUT } from 'constants/analytics'
import { onEventWithLabel } from 'utils/analytics'
import { FLOATING_CARD_BORDER_RADIUS } from 'utils/dimens'
import { EOSToolsDappSelector } from 'selectors/dApp'
import { loadInjectSync } from 'utils/inject'
import Loading from 'components/Loading'
import Alert from 'components/Alert'
import Prompt from 'components/Prompt'
import Toast from 'components/Toast'
import messages from 'resources/messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.general_error_popup_text_password_incorrect
    default:
      return messages.export_private_key_error_popup_text_failed
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    exporting: state.keystore.get('exporting'),
    error: state.keystore.get('error'),
    loggingOut: state.wallet.get('loggingOut'),
    logoutError: state.wallet.get('logoutError'),
    eosToolsDapp: EOSToolsDappSelector(state)
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

export default class AccountDetails extends Component {
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

  copy = (content) => {
    Clipboard.setString(content)
    Toast(messages[this.props.locale].webview_copied_to_clipboard+ ': '+ content, 1000, 0)
  }

  changePrivateKey = () => {
    const { eosToolsDapp } = this.props
    const item = eosToolsDapp
    const inject = loadInjectSync()
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappWebView',
        passProps: {
          uri: item.get('url'),
          iconUrl: item.get('icon_url'),
          title: item.get('display_name').get(this.props.locale) || item.get('display_name').get('en'),
          inject,
          item,
          name: item.get('name')
        }
      }
    })
  }

  resetPassword = () => {
    // Umeng analutics
    onEventWithLabel(WALLET_MGT_RESET_PW, '管理钱包 - 重置密码')
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ResetPassword'
      }
    })
  }

  exportAccount = (password) => {
    // Umeng analutics
    onEventWithLabel(WALLET_MGT_EXPORT, '管理钱包 - 导出私钥')
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
    onEventWithLabel(WALLET_MGT_LOGOUT, '管理钱包 - 登出')
    this.props.actions.logoutRequested({
      password,
      componentId: this.props.componentId,
      origin: this.props.origin,
      bpid: this.props.bpid,
      eosAccountName: this.props.eosAccountName,
      coin: this.props.coin,
      permission: this.props.permission,
      publicKey: this.props.publicKey
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

  routeToWhiteListDetails = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WhiteListDetails',
        passProps: {
          eosAccountName: this.props.eosAccountName
        }
      }
    })
  }

  render() {
    const { locale, exporting, error, loggingOut, logoutError, accountInfo } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={accountInfo.get('eosAccountName')}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <SettingItem
                leftItemTitle={messages[locale].add_eos_create_friend_assistance_label_account+': '}
                rightImageName={'md-copy'}
                iconSize={20}
                rightItemTitle={accountInfo.get('eosAccountName')}
                onPress={() => this.copy(accountInfo.get('eosAccountName'))}
                extraStyle={{
                  marginTop: 10,
                  borderTopLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                  borderTopRightRadius: FLOATING_CARD_BORDER_RADIUS
                }}
              />
              <SettingItem
                leftItemTitle={messages[locale].wallet_details_label_private_key+': '}
                rightImageName={'md-copy'}
                iconSize={20}
                rightItemTitle={`${accountInfo.get('publicKey').slice(0, 6)}....${accountInfo.get('publicKey').slice(-6)}`}
                onPress={() => this.copy(accountInfo.get('publicKey'))}
              />
              <SettingItem
                leftItemTitle={messages[locale].general_nav_assets+':'}
                rightItemTitle={accountInfo.get('balance') + ' EOS'}
                disabled={true}
              />
              <SettingItem
                leftItemTitle={messages[locale].wallet_details_label_permission+':'}
                rightItemTitle={accountInfo.get('permission').toLowerCase()}
                disabled={true}
                extraStyle={{
                  borderBottomLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                  borderBottomRightRadius: FLOATING_CARD_BORDER_RADIUS
                }}
              />

              <SettingItem
                leftItemTitle={messages[locale].wallet_mgmt_button_export_private_key}
                onPress={this.showExportPrompt}
                extraStyle={{
                  marginTop: 10,
                  borderTopLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                  borderTopRightRadius: FLOATING_CARD_BORDER_RADIUS
                }}
              />
              <SettingItem
                leftItemTitle={messages[locale].wallet_mgmt_button_change_private_key}
                onPress={this.changePrivateKey}
              />
              <SettingItem
                leftItemTitle={messages[locale].wallet_mgmt_button_change_password}
                onPress={this.resetPassword}
              />
              <SettingItem
                leftItemTitle={messages[locale].wallet_mgmt_button_whitelist_detail}
                onPress={this.routeToWhiteListDetails}
                extraStyle={{
                  borderBottomLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                  borderBottomRightRadius: FLOATING_CARD_BORDER_RADIUS
                }}
              />
              <SettingItem
                leftItemTitle={messages[locale].wallet_mgmt_button_sign_out}
                rightItemTitle=" "
                onPress={this.showLogoutPrompt}
                extraStyle={{ 
                  marginTop: 10, 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: FLOATING_CARD_BORDER_RADIUS
                }}
                leftTitleStyle={{ color: Colors.textColor_255_76_118 }}
              />
              <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearKeystoreError} delay={500} />
              <Alert message={errorMessages(logoutError, messages[locale])} dismiss={this.props.actions.clearLogoutError} delay={500} />
              <Prompt
                isVisible={this.state.showExportPrompt}
                title={messages[locale].general_popup_label_password}
                negativeText={messages[locale].general_popup_button_cancel}
                positiveText={messages[locale].general_popup_button_confirm}
                type="secure-text"
                callback={this.exportAccount}
                dismiss={this.dismissExportPrompt}
              />
              <Prompt
                isVisible={this.state.showLogoutPrompt}
                title={messages[locale].general_popup_label_password}
                message={messages[locale].logout_text_warning}
                negativeText={messages[locale].general_popup_button_cancel}
                positiveText={messages[locale].general_popup_button_confirm}
                type="secure-text"
                callback={this.logout}
                dismiss={this.dismissLogoutPrompt}
              />
            </ScrollView>
          </View>
          <Loading isVisible={exporting} text={messages[locale].export_private_key_text_exporting} />
          <Loading isVisible={loggingOut} text={messages[locale].logout_text_logging_out} />
        </View>
      </IntlProvider>
    )
  }
}
