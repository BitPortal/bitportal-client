/* @tsx */

import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import ResourcesCard from './ResourcesCard'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { eosAccountSelector } from 'selectors/eosAccount'
import { formatMemorySize, formatCycleTime } from 'utils/format'
import messages from './messages'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    eosAccount: eosAccountSelector(state)
  })
)

export default class Resources extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  check = (type) => {
    switch (type) {
      case 'ram':
        this.props.navigator.push({ screen: 'BitPortal.Memory' })
        break
      case 'bw':
        this.props.navigator.push({ screen: 'BitPortal.Bandwidth' })
        break
      case 'cpu':
        this.props.navigator.push({ screen: 'BitPortal.CPU' })
        break
      default:
        break
    }
  }

  render() {
    const { locale, eosAccount } = this.props
    const activeEOSAccount = eosAccount.get('data')

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale]['reslist_title_name_resources']}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <ResourcesCard
                colors={Colors.cpuColor}
                onPress={() => this.check('cpu')}
                title={<FormattedMessage id="reslist_title_name_cpu" />}
                availableText={<FormattedMessage id="reslist_title_name_ava" />}
                available={formatCycleTime(activeEOSAccount.get('cpu_limit').get('available'))}
                totalText={<FormattedMessage id="reslist_title_name_bwttl" />}
                total={formatCycleTime(activeEOSAccount.get('cpu_limit').get('max'))}
                usageText={<FormattedMessage id="reslist_title_name_usgttl" />}
                usage={formatCycleTime(activeEOSAccount.get('cpu_limit').get('used'))}
                delegateText={<FormattedMessage id="reslist_title_name_delegate" />}
                delegate={activeEOSAccount.get('total_resources').get('cpu_weight')}
              />
              <ResourcesCard
                onPress={() => this.check('bw')}
                title={<FormattedMessage id="reslist_title_name_bw" />}
                availableText={<FormattedMessage id="reslist_title_name_ava" />}
                available={formatMemorySize(activeEOSAccount.get('net_limit').get('available'))}
                totalText={<FormattedMessage id="reslist_title_name_bwttl" />}
                total={formatMemorySize(activeEOSAccount.get('net_limit').get('max'))}
                usageText={<FormattedMessage id="reslist_title_name_usgttl" />}
                usage={formatMemorySize(activeEOSAccount.get('net_limit').get('used'))}
                delegateText={<FormattedMessage id="reslist_title_name_delegate" />}
                delegate={activeEOSAccount.get('total_resources').get('net_weight')}
              />
              <ResourcesCard
                colors={Colors.ramColor}
                onPress={() => this.check('ram')}
                title={<FormattedMessage id="reslist_title_name_ram" />}
                availableText={<FormattedMessage id="reslist_title_name_ava" />}
                available={formatMemorySize(activeEOSAccount.get('ram_quota')-activeEOSAccount.get('ram_usage'))}
                totalText={<FormattedMessage id="reslist_title_name_ramttl" />}
                total={formatMemorySize(activeEOSAccount.get('ram_quota'))}
                usageText={<FormattedMessage id="reslist_title_name_usgttl" />}
                usage={formatMemorySize(activeEOSAccount.get('ram_usage'))}
              />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
