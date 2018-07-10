/* @tsx */
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation'
import styles from './styles'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { eosAccountSelector } from 'selectors/eosAccount'
import DelegateBandwidthForm from 'components/Form/DelegateBandwidthForm'
import { formatMemorySize } from 'utils/format'
import messages from './messages'
import Progress from '../Progress'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    eosAccount: eosAccountSelector(state)
  }),
  null,
  null,
  { withRef: true }
)

export default class Memory extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  render() {
    const { locale, eosAccount } = this.props
    const activeEOSAccount = eosAccount.get('data')
    const percent = activeEOSAccount.get('net_limit').get('available')/activeEOSAccount.get('net_limit').get('max')
    const eosBalance = (activeEOSAccount && activeEOSAccount.get('core_liquid_balance')) 
    const refund = activeEOSAccount.get('refund_request') ? activeEOSAccount.get('refund_request').get('net_amount') : '0.0000 EOS'
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale]['bdwidth_title_name_bandwidth']}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <View style={styles.progressContaner}>
                <Progress percent={percent} />
                <View style={[styles.totalContainer, styles.between]}>
                  <Text style={styles.text14}><FormattedMessage id="bdwidth_title_name_total" /></Text>
                  <Text style={styles.text14}>
                    {formatMemorySize(activeEOSAccount.get('net_limit').get('available'))}
                    /{formatMemorySize(activeEOSAccount.get('net_limit').get('max'))}
                  </Text>
                </View>
                <View style={[styles.totalContainer, styles.between, {marginTop: 0}]}>
                  <Text style={styles.text14}><FormattedMessage id="bdwidth_title_name_unstaking" /></Text>
                  <Text style={styles.text14}>
                    {refund}
                  </Text>
                </View>
              </View>
              <DelegateBandwidthForm resource="net" />
              <View style={styles.tipsContainer}>
                <Text style={styles.text16}><FormattedMessage id="bdwidth_title_name_tips" /></Text>
                <Text style={[styles.text14, {marginTop: 15}]}><FormattedMessage id="bdwidth_title_name_tip1" /></Text>
                <Text style={[styles.text14, {marginTop: 10}]}><FormattedMessage id="bdwidth_title_name_tip2" /></Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
