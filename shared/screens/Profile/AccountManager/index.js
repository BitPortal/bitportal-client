/* @tsx */
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import TotalAssetsCard from 'components/TotalAssetsCard'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'

@connect(
  (state) => ({
    locale: state.intl.get('locale')
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
    this.push({ screen: 'BitPortal.ExportEntrance' })
  }

  render() {
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title="EOS-1"
            leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
            rightButton={ <CommonRightButton iconName="ios-trash" onPress={() => this.deleteAccount()} /> }
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <TotalAssetsCard totalAssets={425321132.21} accountName={'meon'} disabled={true} />
              <SettingItem leftItemTitle={<FormattedMessage id="act_sec_title_change" />} onPress={() => this.resetPassword()} extraStyle={{ marginTop: 10 }} />
              <SettingItem leftItemTitle={<FormattedMessage id="act_sec_title_export" />} onPress={() => this.exportAccount()} extraStyle={{ marginTop: 10 }} />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }

}
