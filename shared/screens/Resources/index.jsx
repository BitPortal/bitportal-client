/* @tsx */

import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { eosAccountSelector } from 'selectors/eosAccount'
import { formatMemorySize, formatCycleTime } from 'utils/format'
import ResourcesCard from './ResourcesCard'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    eosAccount: eosAccountSelector(state)
  }),
  null,
  null,
  { withRef: true }
)

export default class Resources extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  check = (type) => {
    switch (type) {
      case 'ram':
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.Memory'
          }
        })
        break
      case 'bw':
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.Bandwidth'
          }
        })
        break
      case 'cpu':
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.CPU'
          }
        })
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
            title={messages[locale].reslist_title_name_resources}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
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
                available={formatMemorySize(activeEOSAccount.get('ram_quota') - activeEOSAccount.get('ram_usage'))}
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
