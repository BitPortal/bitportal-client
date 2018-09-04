import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Text, View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, FormattedNumber, IntlProvider } from 'react-intl'
import {
  ramQuotaSelector,
  ramAvailableSelector,
  ramAvailablePercentSelector
} from 'selectors/eosAccount'
import { ramPriceSelector } from 'selectors/ram'
import TradeRAMForm from 'components/Form/TradeRAMForm'
import * as ramActions from 'actions/ram'
import { formatMemorySize } from 'utils/format'
import Loading from 'components/Loading'
import styles from './styles'
import messages from 'resources/messages'
import Progress from '../Progress'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    ram: state.ram,
    ramQuota: ramQuotaSelector(state),
    ramAvailable: ramAvailableSelector(state),
    ramAvailablePercent: ramAvailablePercentSelector(state),
    ramPrice: ramPriceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...ramActions
    }, dispatch)
  }),
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

  componentDidMount() {
    this.props.actions.getRAMMarketRequested()
  }

  checkRamPrice = () => {
    const uri = 'https://eosmonitor.io/'
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.BPWebView',
        passProps: {
          title: uri,
          needLinking: true,
          uri
        }
      }
    })
  }

  render() {
    const { locale, ram, ramQuota, ramAvailable, ramAvailablePercent, ramPrice } = this.props
    const buying = ram.get('buying')
    const selling = ram.get('selling')
    const loading = buying || selling
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].memory_title_name_memory}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <View style={styles.progressContaner}>
                <Progress percent={ramAvailablePercent} colors={Colors.ramColor} />
                <View style={[styles.totalContainer, styles.between]}>
                  <Text style={styles.text14}><FormattedMessage id="memory_title_name_total" /></Text>
                  <Text style={styles.text14}>
                    {formatMemorySize(ramAvailable)}
                    /{formatMemorySize(ramQuota)}
                  </Text>
                </View>
                <View style={[styles.totalContainer, styles.between, { marginTop: 0 }]}>
                  <Text style={styles.text14}><FormattedMessage id="memory_title_name_ramprice" /></Text>
                  <Text onPress={this.checkRamPrice} style={styles.text14}>
                    <Text style={{ color: Colors.textColor_89_185_226, textDecorationLine: 'underline' }}>
                      <FormattedNumber
                        value={+ramPrice * 1024}
                        maximumFractionDigits={4}
                        minimumFractionDigits={4}
                      />
                    </Text>
                    {' '}EOS/KB
                  </Text>
                </View>
              </View>
              <TradeRAMForm />
              <View style={styles.tipsContainer}>
                <Text style={styles.text16}><FormattedMessage id="memory_title_name_tips" /></Text>
                <Text style={[styles.text14, { marginTop: 15 }]}><FormattedMessage id="memory_title_name_tip1" /></Text>
                <Text style={[styles.text14, { marginTop: 10 }]}><FormattedMessage id="memory_title_name_tip2" /></Text>
                <Text style={[styles.text14, { marginTop: 10 }]}><FormattedMessage id="memory_title_name_tip3" /></Text>
              </View>
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
