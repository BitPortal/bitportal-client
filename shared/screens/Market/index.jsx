import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import { tickerSelector } from 'selectors/ticker'
import { currencySelector } from 'selectors/currency'
import * as tickerActions from 'actions/ticker'

const { Section, Item } = TableView

@injectIntl

@connect(
  state => ({
    getTicker: state.getTicker,
    ticker: tickerSelector(state),
    currency: currencySelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...tickerActions
    }, dispatch)
  })
)

export default class Market extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '行情'
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search'
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    getTickerLoading: false,
    getTickerError: false,
    tickerCount: 0
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.getTicker.loading !== prevState.getTickerLoading
      || nextProps.getTicker.error !== prevState.getTickerError
      || (nextProps.ticker && nextProps.ticker.length) !== prevState.tickerCount
    ) {
      return {
        getTickerLoading: nextProps.getTicker.loading,
        getTickerError: nextProps.getTicker.error,
        tickerCount: (nextProps.ticker && nextProps.ticker.length)
      }
    } else {
      return null
    }
  }

  searchBarUpdated({ text, isFocused }) {
    if (isFocused) {
      this.props.actions.handleTickerSearchTextChange(text)
    } else {
      this.props.actions.handleTickerSearchTextChange('')
    }
  }

  onSelect = () => {
    console.log('onSelect')
  }

  onRefresh = () => {
    this.props.actions.getTicker.refresh()
  }

  componentDidAppear() {
    this.props.actions.getTicker.requested()
  }

  componentDidUpdate(prevProps, prevState) {
    /* if (
     *   prevState.getTickerLoading !== this.state.getTickerLoading
     *   || prevState.getTickerError !== this.state.getTickerError
     *   || prevState.tickerCount !== this.state.tickerCount
     * ) {
     *   Navigation.mergeOptions(this.props.componentId, {
     *     topBar: {
     *       searchBar: !(this.state.getTickerLoading && !this.state.tickerCount),
     *       searchBarHiddenWhenScrolling: true,
     *       searchBarPlaceholder: 'Search'
     *     }
     *   })
     * }*/
  }

  render() {
    const { ticker, intl, getTicker, currency } = this.props
    const refreshing = getTicker.refreshing
    const loading = getTicker.loading

    if (loading && !ticker.length) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginTop: 80 }}>
            <ActivityIndicator size="small" color="#666666" />
            <Text style={{ marginTop: 10, color: '#666666' }}>加载行情</Text>
          </View>
        </View>
      )
    }

    return (
      <TableView
        style={{ flex: 1, backgroundColor: 'white' }}
        canRefresh
        refreshing={refreshing}
        onRefresh={this.onRefresh}
      >
        <Section>
          {ticker.map(item =>
            <Item
              key={`${item.name}/${item.symbol}`}
              reactModuleForCell="MarketTableViewCell"
              height={60}
              price={intl.formatNumber(item.price_usd * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              symbol={item.symbol}
              name={item.name}
              currency={currency.sign}
              change={intl.formatNumber(item.percent_change_24h, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              componentId={this.props.componentId}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
            />
           )}
        </Section>
      </TableView>
    )
  }
}
