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
import { onEventWithLabel } from 'utils/analytics'
import { ASSETS_EOS_RESOURCE_CPU, ASSETS_EOS_RESOURCE_NET, ASSETS_EOS_RESOURCE_RAM } from 'constants/analytics'
import messages from 'resources/messages'
import ResourcesCard from './ResourcesCard'
import styles from './styles'

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
        onEventWithLabel(ASSETS_EOS_RESOURCE_RAM, ' 资产 - EOS资源管理 - 内存容量')
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.Memory'
          }
        })
        break
      case 'bw':
        onEventWithLabel(ASSETS_EOS_RESOURCE_NET, ' 资产 - EOS资源管理 - 网络带块 ')
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.Bandwidth'
          }
        })
        break
      case 'cpu':
        onEventWithLabel(ASSETS_EOS_RESOURCE_CPU, ' 资产 - EOS资源管理 - 计算资源 ')
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
            title={messages[locale].profile_button_resource}
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
                title={<FormattedMessage id="resource_label_cpu" />}
                availableText={<FormattedMessage id="resource_label_available" />}
                available={formatCycleTime(cpuLimitAvailable)}
                totalText={<FormattedMessage id="resource_label_total" />}
                total={formatCycleTime(cpuLimitMax)}
                usageText={<FormattedMessage id="resource_label_used" />}
                usage={formatCycleTime(cpuLimitUsed)}
                delegateText={<FormattedMessage id="resource_label_staked" />}
                delegate={totalResourcesCPUWeight}
              />
              <ResourcesCard
                onPress={() => this.check('bw')}
                title={<FormattedMessage id="resource_label_net" />}
                availableText={<FormattedMessage id="resource_label_available" />}
                available={formatMemorySize(netLimitAvailable)}
                totalText={<FormattedMessage id="resource_label_total" />}
                total={formatMemorySize(netLimitMax)}
                usageText={<FormattedMessage id="resource_label_used" />}
                usage={formatMemorySize(netLimitUsed)}
                delegateText={<FormattedMessage id="resource_label_staked" />}
                delegate={totalResourcesNETWeight}
              />
              <ResourcesCard
                colors={Colors.ramColor}
                onPress={() => this.check('ram')}
                title={<FormattedMessage id="resource_label_ram" />}
                availableText={<FormattedMessage id="resource_label_available" />}
                available={formatMemorySize(ramAvailable)}
                totalText={<FormattedMessage id="resource_label_total" />}
                total={formatMemorySize(ramQuota)}
                usageText={<FormattedMessage id="resource_label_used" />}
                usage={formatMemorySize(ramUsage)}
              />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
