import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import AccordionPanel from 'components/AccordionPanel'
import { MARKET_DETAIL_KEYS } from 'constants/market'
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    token: state.token.get('data'),
    loading: state.token.get('loading')
  }),
  null,
  null,
  { withRef: true }
)

export default class Details extends Component {
  render() {
    const {
      circulating_supply,
      total_supply,
      ...rest
    } = this.props.token.toJS()
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <AccordionPanel title={messages[locale].details}>
          <View
            style={{
              paddingHorizontal: 25,
              marginLeft: 4
            }}
          >
            {!circulating_supply
            && !total_supply
            && Object.keys(rest).length === 0 ? (
              <Text style={styles.text14}>{messages[locale].details_null}</Text>
              ) : null}
            {circulating_supply && (
              <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                <Text style={styles.text14}>
                  <FormattedMessage id="circulating_supply" />
                </Text>
                <Text style={styles.text14}>
                  <FormattedNumber value={circulating_supply} />
                </Text>
              </View>
            )}
            {total_supply && (
              <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                <Text style={styles.text14}>
                  <FormattedMessage id="total_supply" />
                </Text>
                <Text style={styles.text14}>
                  <FormattedNumber value={total_supply} />
                </Text>
              </View>
            )}
            {Object.keys(rest).map(
              item => (MARKET_DETAIL_KEYS.includes(item) ? (
                <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                  <Text style={styles.text14}>
                    <FormattedMessage id={item} />
                  </Text>
                  <Text style={styles.text14}>{rest[item]}</Text>
                </View>
              ) : null)
            )}
          </View>
        </AccordionPanel>
      </IntlProvider>
    )
  }
}
