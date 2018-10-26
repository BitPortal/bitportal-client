import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Text, View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { FormattedMessage, FormattedNumber, IntlProvider } from 'react-intl'
import { ramQuotaSelector, ramAvailableSelector, ramAvailablePercentSelector } from 'selectors/eosAccount'
import { ramPriceSelector } from 'selectors/ram'
import TradeRAMForm from 'components/Form/TradeRAMForm/index.new'

import * as ramActions from 'actions/ram'
import { formatMemorySize } from 'utils/format'
import Loading from 'components/Loading'
import messages from 'resources/messages'
import DescriptionPanel from 'components/DescriptionPanel'
import styles from './styles'
import ResourceBar from '../ResourceBar'

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
    actions: bindActionCreators(
      {
        ...ramActions
      },
      dispatch
    )
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
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
            >
              <View style={styles.progressContaner}>
                <ResourceBar percent={ramAvailablePercent} colors={Colors.ramColor} />
                <View style={[styles.totalContainer, styles.between]}>
                  <Text style={styles.text14}>
                    <FormattedMessage id="resource_label_available_total" />
                  </Text>
                  <Text style={styles.text14}>
                    {formatMemorySize(ramAvailable)}/{formatMemorySize(ramQuota)}
                  </Text>
                </View>
                <View style={[styles.totalContainer, styles.between, { marginTop: 0 }]}>
                  <Text style={styles.text14}>
                    <FormattedMessage id="resource_ram_label_price" />
                  </Text>
                  <Text onPress={this.checkRamPrice} style={styles.text14}>
                    <Text
                      style={{
                        color: Colors.textColor_89_185_226,
                        textDecorationLine: 'underline'
                      }}
                    >
                      <FormattedNumber value={+ramPrice * 1024} maximumFractionDigits={4} minimumFractionDigits={4} />
                    </Text>{' '}
                    EOS/KB
                  </Text>
                </View>
              </View>
              <TradeRAMForm />
              <DescriptionPanel
                title={messages[locale].resource_label_tips}
                description={`${messages[locale].resource_ram_text_tips}`}
              />
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
