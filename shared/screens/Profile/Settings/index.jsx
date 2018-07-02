/* @tsx */

import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef : true }
)

export default class Setting extends Component {
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
    Navigation.push(this.props.componentId, {
      component: {
        name: `BitPortal.${page}`
      }
    })
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].sts_title_name_settings}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
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
