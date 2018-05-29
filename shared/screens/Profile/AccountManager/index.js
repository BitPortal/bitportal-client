/* @tsx */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, AlertIOS } from 'react-native'
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
import messages from './messages'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    exporting: state.keystore.get('exporting')
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...keystoreActions,
    }, dispatch)
  })
)

export default class AccountList extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  deleteAccount = () => {

  }

  resetPassword = () => {
    this.push({ screen: 'BitPortal.ResetPassword' })
  }

  exportAccount = () => {
    AlertIOS.prompt(
      '请输入密码',
      null,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Submit',
          onPress: (text) => this.props.actions.exportEOSKeyRequested({
            password: text,
            origin: this.props.origin,
            bpid: this.props.bpid,
            eosAccountName: this.props.eosAccountName
          })
        }
      ],
      'secure-text'
    )
  }

  render() {
    const { locale, name, eosAccountName, exporting } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={name}
            leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
            rightButton={ <CommonRightButton iconName="ios-trash" onPress={() => this.deleteAccount()} /> }
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <TotalAssetsCard totalAssets={0} accountName={eosAccountName} disabled={true} />
              <SettingItem leftItemTitle={<FormattedMessage id="act_sec_title_change" />} onPress={() => this.resetPassword()} extraStyle={{ marginTop: 10 }} />
              <SettingItem leftItemTitle={<FormattedMessage id="act_sec_title_export" />} onPress={() => this.exportAccount()} extraStyle={{ marginTop: 10 }} />
              {!!exporting && <ActivityIndicator size="large" color="white" />}
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }

}
