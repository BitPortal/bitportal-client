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
import DelegateBandwidthForm from 'components/Form/DelegateBandwidthForm'
import { formatCycleTime } from 'utils/format'
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
    const percent = activeEOSAccount.get('cpu_limit').get('available')/activeEOSAccount.get('cpu_limit').get('max')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale]['cpu_title_name_cpu']}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <View style={styles.progressContaner}>
                <Progress percent={percent} colors={Colors.cpuColor} />
                <View style={[styles.totalContainer, styles.between]}>
                  <Text style={styles.text14}><FormattedMessage id="cpu_title_name_total" /></Text>
                  <Text style={styles.text14}>
                    {formatCycleTime(activeEOSAccount.get('cpu_limit').get('available'))}
                    /{formatCycleTime(activeEOSAccount.get('cpu_limit').get('max'))}
                  </Text>
                </View>
                <View style={[styles.totalContainer, styles.between, {marginTop: 0}]}>
                  <Text style={styles.text14}><FormattedMessage id="cpu_title_name_unstaking" /></Text>
                  <Text style={styles.text14}>
                    
                  </Text>
                </View>
              </View>
              <DelegateBandwidthForm resource="cpu" />
              <View style={styles.tipsContainer}>
                <Text style={styles.text16}><FormattedMessage id="cpu_title_name_tips" /></Text>
                <Text style={[styles.text14, {marginTop: 15}]}><FormattedMessage id="cpu_title_name_tip1" /></Text>
                <Text style={[styles.text14, {marginTop: 10}]}><FormattedMessage id="cpu_title_name_tip2" /></Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
