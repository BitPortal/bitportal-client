/* @tsx */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Text, View, ScrollView, TouchableOpacity, AlertIOS } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import TotalAssetsCard from 'components/TotalAssetsCard'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import * as keystoreActions from 'actions/keystore'
import { logoutRequested, clearLogoutError } from 'actions/wallet'
import Loading from 'components/Loading'
import Alert from 'components/Alert'
import messages from './messages'
import Dialog from './Dialog'

export const errorMessages = (error) => {
  if (!error) return null

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return 'Invalid password!'
    default:
      return 'Export failed!'
  }
}

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    exporting: state.keystore.get('exporting'),
    error: state.keystore.get('error'),
    loggingOut: state.wallet.get('loggingOut'),
    logoutError: state.wallet.get('logoutError')
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...keystoreActions,
      logoutRequested,
      clearLogoutError
    }, dispatch)
  })
)

export default class AccountList extends BaseScreen {

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

  exportAccount = () => {
    this.setState({ isVisible: true })
  }

  logout = async () => {
    this.setState({ isVisible: true })
  }

  handleConfirm = () => {
    const { type, password } = this.state
    this.setState({ isVisible: false }, () => {
      if (type == 'logout') {
        this.props.actions.logoutRequested({
          password,
          origin: this.props.origin,
          bpid: this.props.bpid,
          eosAccountName: this.props.eosAccountName,
          coin: this.props.coin,
        })
      } else {  
        this.props.actions.exportEOSKeyRequested({
          password,
          origin: this.props.origin,
          bpid: this.props.bpid,
          eosAccountName: this.props.eosAccountName
        })
      }
    })
  }

  render() {
    const { locale, name, eosAccountName, exporting, error, loggingOut, logoutError } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={name}
            leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
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
                onPress={() => this.setState({ isVisible: true, type: 'exportAccount' })} 
                extraStyle={{ marginTop: 10 }} 
              />
              
              <SettingItem 
                leftItemTitle={<FormattedMessage id="act_sec_title_logout" />} 
                onPress={() => this.setState({ isVisible: true, type: 'logout' })} 
                extraStyle={{ marginTop: 10 }} 
              />
              
              <Dialog 
                tilte="请输入密码"
                content="" 
                onChange={password => this.setState({ password })}
                isVisible={this.state.isVisible}
                handleCancel={() => this.setState({ isVisible: false })} 
                handleConfirm={this.handleConfirm} 
              />

              <Loading isVisible={exporting} text="Exporting" />
              <Loading isVisible={loggingOut} text="Logging Out" />
              <Alert message={errorMessages(error)} dismiss={this.props.actions.clearError} delay={500} />
              <Alert message={errorMessages(logoutError)} dismiss={this.props.actions.clearLogoutError} delay={500} />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
