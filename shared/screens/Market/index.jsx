import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import { tickerSelector } from 'selectors/ticker'
import * as tickerActions from 'actions/ticker'

const { Section, Item } = TableView

@injectIntl

@connect(
  state => ({
    getTicker: state.getTicker,
    ticker: tickerSelector(state)
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

  render() {
    const { ticker, intl, getTicker } = this.props
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
              price={intl.formatNumber(item.price_usd, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              symbol={item.symbol}
              name={item.name}
              currency="$"
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
