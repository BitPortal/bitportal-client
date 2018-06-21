/* @tsx */

import React, { Component } from 'react'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { Text, View, ScrollView, Switch } from 'react-native'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class Setting extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    enableTouchID: false
  }

  switchTouchID = () => {
    this.setState({ enableTouchID: !this.state.enableTouchID })
  }

  changeSettings = (page) => {
    this.props.navigator.push({ screen: `BitPortal.${page}` })
  }

  render() {
    const { enableTouchID } = this.state
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].sts_title_name_settings}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SettingItem leftItemTitle={<FormattedMessage id="sts_sec_title_language" />} onPress={() => this.changeSettings('Languages')} extraStyle={{ marginTop: 10 }} />
              <SettingItem leftItemTitle={<FormattedMessage id="sts_sec_title_currency" />} onPress={() => this.changeSettings('Currencies')} />
              {/* <SettingItem leftItemTitle={<FormattedMessage id="sts_sec_title_theme" />} onPress={() => {}} /> */}
              {/* <View style={[styles.itemContainer, styles.between, { marginTop: 10 }]}>
                <Text style={[styles.text16, { marginLeft: -2 }]}> Touch ID </Text>
                <Switch value={enableTouchID} onValueChange={(e) => this.switchTouchID()} />
              </View> */}
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
