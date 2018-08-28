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
    const { locale, token } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <AccordionPanel title={messages[locale].details}>
          <View
            style={{
              paddingHorizontal: 25,
              marginLeft: 4
            }}
          >
            {/* {!token.get('circulating_supply') && !token.get('total_supply') ? (
              // && Object.keys(rest).length === 0
              <Text style={styles.text14}>{messages[locale].details_null}</Text>
            ) : null} */}
            {token.get('circulating_supply') && (
              <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                <Text style={styles.text14}>
                  <FormattedMessage id="circulating_supply" />
                </Text>
                <Text style={styles.text14}>
                  <FormattedNumber value={token.get('circulating_supply')} />
                </Text>
              </View>
            )}
            {token.get('total_supply') && (
              <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                <Text style={styles.text14}>
                  <FormattedMessage id="total_supply" />
                </Text>
                <Text style={styles.text14}>
                  <FormattedNumber value={token.get('total_supply')} />
                </Text>
              </View>
            )}
            {token.keySeq().map(
              item => (item !== 'total_supply'
                && item !== 'circulating_supply'
                && MARKET_DETAIL_KEYS.includes(item) ? (
                  <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                    <Text style={styles.text14}>
                      <FormattedMessage id={item} />
                    </Text>
                    <Text style={styles.text14}>{token.get(item)}</Text>
                  </View>
                ) : null)
            )}
          </View>
        </AccordionPanel>
      </IntlProvider>
    )
  }
}
