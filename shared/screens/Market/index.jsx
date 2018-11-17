import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as tickerActions from 'actions/ticker'
import * as tokenActions from 'actions/token'
import { exchangeTickerSelector, sortFilterSelector } from 'selectors/ticker'
import { bindActionCreators } from 'redux'
// import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'

const { Section, Item } = TableView

@connect(
  state => ({
    locale: state.intl.get('locale'),
    ticker: exchangeTickerSelector(state),
    loading: state.ticker.get('loading'),
    exchangeFilter: state.ticker.get('exchangeFilter'),
    sortFilter: sortFilterSelector(state),
    quoteAssetFilter: state.ticker.get('quoteAssetFilter'),
    baseAsset: state.ticker.get('baseAsset'),
    searchTerm: state.ticker.get('searchTerm')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...tickerActions,
        ...tokenActions
      },
      dispatch
    )
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

  onSelect = () => {
    console.log('onSelect')
  }

  render() {
    return (
      <TableView
        style={{ flex: 1, backgroundColor: 'white' }}
        canRefresh
      >
        <Section>
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="-0.252"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="-0.252"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="-0.252"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="-0.252"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="-0.252"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="-0.252"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="-0.252"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="0.1492"
            componentId={this.props.componentId}
          />
          <Item
            reactModuleForCell="MarketTableViewCell"
            height={60}
            price="567.00 USD"
            symbol="BTC"
            name="Bitcoin"
            change="-0.252"
            componentId={this.props.componentId}
          />
        </Section>
      </TableView>
    )
  }
}
