import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import {
  cpuLimitAvailableSelector,
  cpuLimitMaxSelector,
  cpuLimitUsedSelector,
  totalResourcesCPUWeightSelector,
  netLimitAvailableSelector,
  netLimitMaxSelector,
  netLimitUsedSelector,
  totalResourcesNETWeightSelector,
  ramQuotaSelector,
  ramUsageSelector,
  ramAvailableSelector
} from 'selectors/eosAccount'
import { formatMemorySize, formatCycleTime } from 'utils/format'
import ResourcesCard from './ResourcesCard'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    cpuLimitAvailable: cpuLimitAvailableSelector(state),
    cpuLimitMax: cpuLimitMaxSelector(state),
    cpuLimitUsed: cpuLimitUsedSelector(state),
    totalResourcesCPUWeight: totalResourcesCPUWeightSelector(state),
    netLimitAvailable: netLimitAvailableSelector(state),
    netLimitMax: netLimitMaxSelector(state),
    netLimitUsed: netLimitUsedSelector(state),
    totalResourcesNETWeight: totalResourcesNETWeightSelector(state),
    ramQuota: ramQuotaSelector(state),
    ramUsage: ramUsageSelector(state),
    ramAvailable: ramAvailableSelector(state)
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
    const {
      locale,
      cpuLimitAvailable,
      cpuLimitMax,
      cpuLimitUsed,
      totalResourcesCPUWeight,
      netLimitAvailable,
      netLimitMax,
      netLimitUsed,
      totalResourcesNETWeight,
      ramQuota,
      ramUsage,
      ramAvailable
    } = this.props

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
                available={formatCycleTime(cpuLimitAvailable)}
                totalText={<FormattedMessage id="reslist_title_name_bwttl" />}
                total={formatCycleTime(cpuLimitMax)}
                usageText={<FormattedMessage id="reslist_title_name_usgttl" />}
                usage={formatCycleTime(cpuLimitUsed)}
                delegateText={<FormattedMessage id="reslist_title_name_delegate" />}
                delegate={totalResourcesCPUWeight}
              />
              <ResourcesCard
                onPress={() => this.check('bw')}
                title={<FormattedMessage id="reslist_title_name_bw" />}
                availableText={<FormattedMessage id="reslist_title_name_ava" />}
                available={formatMemorySize(netLimitAvailable)}
                totalText={<FormattedMessage id="reslist_title_name_bwttl" />}
                total={formatMemorySize(netLimitMax)}
                usageText={<FormattedMessage id="reslist_title_name_usgttl" />}
                usage={formatMemorySize(netLimitUsed)}
                delegateText={<FormattedMessage id="reslist_title_name_delegate" />}
                delegate={totalResourcesNETWeight}
              />
              <ResourcesCard
                colors={Colors.ramColor}
                onPress={() => this.check('ram')}
                title={<FormattedMessage id="reslist_title_name_ram" />}
                availableText={<FormattedMessage id="reslist_title_name_ava" />}
                available={formatMemorySize(ramAvailable)}
                totalText={<FormattedMessage id="reslist_title_name_ramttl" />}
                total={formatMemorySize(ramQuota)}
                usageText={<FormattedMessage id="reslist_title_name_usgttl" />}
                usage={formatMemorySize(ramUsage)}
              />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
