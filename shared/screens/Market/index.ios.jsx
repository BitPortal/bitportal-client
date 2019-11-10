import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator } from 'react-native'
import { tickerWidthSearchSelector } from 'selectors/ticker'
import { currencySelector } from 'selectors/currency'
import * as tickerActions from 'actions/ticker'
import MarketView from './MarketView'

@injectIntl

@connect(
  state => ({
    getTicker: state.getTicker,
    ticker: tickerWidthSearchSelector(state),
    currency: currencySelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...tickerActions
    }, dispatch)
  })
)

export default class Market extends Component {
  onRefresh = () => {
    // this.props.actions.getTicker.refresh()
  }

  render() {
    const { ticker, intl, getTicker, currency } = this.props
    const refreshing = getTicker.refreshing
    const loading = getTicker.loading

    return (
      <MarketView
        style={{ flex: 1}}
        onRefresh={this.onRefresh}
        data={ticker.map(item => ({
          key: item.name,
          price: currency.sign + intl.formatNumber(item.price_usd * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          symbol: item.symbol,
          name: item.name,
          change: (item.percent_change_24h > 0 ? '+' : '') + intl.formatNumber(item.percent_change_24h, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%',
          trend: item.percent_change_24h == 0 ? '0' : (item.percent_change_24h > 0 ? '1' : '-1'),
          imageUrl: `https://cdn.bitportal.io/tokenicon/128/color/${item.symbol.toLowerCase()}.png`
        }))}
      />
    )
  }
}
