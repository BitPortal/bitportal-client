import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ActivityIndicator } from 'react-native'
import AccordionPanel from 'components/AccordionPanel'
import { EXCHANGE_NAMES, ASSET_FRACTION } from 'constants/market'
import { FormattedNumber } from 'react-intl'

import styles from './styles'
import messages from 'resources/messages'

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
export default class ListedExchange extends Component {
  render() {
    const { data, loading, locale } = this.props
    return (
      <AccordionPanel title={messages[locale].listed_exchange}>
        <View
          style={{
            paddingHorizontal: 25,
            marginLeft: 4
          }}
        >
          {loading ? (
            <View style={styles.loadingSymbol}>
              <ActivityIndicator />
            </View>
          ) : (
            data.map(item => (
              <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                <Text style={styles.text14}>
                  {' '}
                  {EXCHANGE_NAMES[item.get('exchange')]}{' '}
                </Text>
                <Text style={styles.text14}>
                  {' '}
                  {
                    <FormattedNumber
                      value={item.get('price_last')}
                      maximumFractionDigits={
                        ASSET_FRACTION[item.get('quote_asset')]
                      }
                      minimumFractionDigits={
                        ASSET_FRACTION[item.get('quote_asset')]
                      }
                    />
                  }
                  {` ${item.get('quote_asset')}`}{' '}
                </Text>
              </View>
            ))
          )}
        </View>
      </AccordionPanel>
    )
  }
}
