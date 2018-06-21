/* @tsx */
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { eosAccountSelector } from 'selectors/eosAccount'
import messages from './messages'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    eosAccount: eosAccountSelector(state)
  })
)

export default class Memory extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  render() {
    const { locale, eosAccount } = this.props
    const activeEOSAccount = eosAccount.get('data')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale]['memory_title_name_memory']}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >

            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }

}
