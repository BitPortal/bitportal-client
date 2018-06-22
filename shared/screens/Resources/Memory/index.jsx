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
import Progress from '../Progress'

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
    const percent = (activeEOSAccount.get('ram_quota') - activeEOSAccount.get('ram_usage'))/activeEOSAccount.get('ram_quota')
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
              <View style={styles.progressContaner}>
                <Progress percent={percent} colors={Colors.ramColor} />
                <View style={[styles.totalContainer, styles.between]}>
                  <Text style={styles.text14}><FormattedMessage id="memory_title_name_total" /></Text>
                  <Text style={styles.text14}>{activeEOSAccount.get('ram_quota')} byte</Text>
                </View>
              </View>

              <View style={styles.tipsContainer}>
                <Text style={styles.text16}><FormattedMessage id="memory_title_name_tips" /></Text>
                <Text style={[styles.text14, {marginTop: 15}]}><FormattedMessage id="memory_title_name_tip1" /></Text>
                <Text style={[styles.text14, {marginTop: 10}]}><FormattedMessage id="memory_title_name_tip2" /></Text>
                <Text style={[styles.text14, {marginTop: 10}]}><FormattedMessage id="memory_title_name_tip3" /></Text>
              </View>

            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }

}
