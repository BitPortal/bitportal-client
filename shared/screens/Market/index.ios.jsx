import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import { tickerWidthSearchSelector } from 'selectors/ticker'
import { currencySelector } from 'selectors/currency'
import * as tickerActions from 'actions/ticker'
import { DarkModeContext } from 'utils/darkMode'

const { Section, Item } = TableView

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
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('quota')
        },
        /* searchBar: true,
         * searchBarHiddenWhenScrolling: true,
         * searchBarPlaceholder: 'Search'*/
      }
    }
  }
  static contextType = DarkModeContext
  subscription = Navigation.events().bindComponent(this)

  state = {
    getTickerLoading: false,
    getTickerLoaded: false,
    getTickerError: false,
    tickerCount: 0,
    searchBarFocused: false,
    firstAppeared: false
  }

  tableViewRef = React.createRef()

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.getTicker.loading !== prevState.getTickerLoading
      || nextProps.getTicker.loaded !== prevState.getTickerLoaded
      || nextProps.getTicker.error !== prevState.getTickerError
      || (nextProps.ticker && nextProps.ticker.length) !== prevState.tickerCount
    ) {
      return {
        getTickerLoading: nextProps.getTicker.loading,
        getTickerLoaded: nextProps.getTicker.loaded,
        getTickerError: nextProps.getTicker.error,
        tickerCount: (nextProps.ticker && nextProps.ticker.length)
      }
    } else {
      return null
    }
  }

  searchBarUpdated({ text, isFocused }) {
    this.setState({ searchBarFocused: isFocused })

    if (this.tableViewRef) {
      this.tableViewRef.scrollToIndex({ index: 0, section: 0, animated: true })
    }

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
    // const { ticker } = this.props

    /* if (ticker && ticker.length) {
     *   setTimeout(() => {
     *     Navigation.mergeOptions(this.props.componentId, {
     *       topBar: {
     *         searchBar: true,
     *         searchBarHiddenWhenScrolling: true,
     *         searchBarPlaceholder: 'Search'
     *       }
     *     })
     *   })
     * }*/

    this.setState({ firstAppeared: true })
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.getTickerLoaded !== this.state.getTickerLoaded
      || prevState.firstAppeared !== this.state.firstAppeared
    ) {
      if (this.state.getTickerLoaded) {
        setTimeout(() => {
          Navigation.mergeOptions(this.props.componentId, {
            topBar: {
              searchBar: true,
              searchBarHiddenWhenScrolling: true,
              searchBarPlaceholder: 'Search'
            }
          })
        })
      }
    }
  }

  render() {
    const { ticker, intl, getTicker, currency } = this.props
    const refreshing = getTicker.refreshing
    const loading = getTicker.loading

    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    if (loading && !ticker.length) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginTop: 80 }}>
            <ActivityIndicator size="small" color="#666666" />
      <Text style={{ marginTop: 10, color: '#666666' }}>{t(this,'loading_quota')}</Text>
          </View>
        </View>
      )
    }

    return (
      <TableView
        ref={(ref) => { this.tableViewRef = ref }}
        style={{ flex: 1 }}
        canRefresh={this.state.firstAppeared}
        refreshing={refreshing && !this.state.searchBarFocused && this.state.getTickerLoaded}
        onRefresh={this.state.searchBarFocused ? () => {} : this.onRefresh}
        reactModuleForCell="MarketTableViewCell"
        headerTextColor={isDarkMode ? 'white' : 'black'}
      >
        <Section>
          {ticker.map(item =>
            <Item
              key={`${item.name}/${item.symbol}`}
              height={60}
              price={intl.formatNumber(item.price_usd * currency.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              symbol={item.symbol}
              name={item.name}
              currency={currency.sign}
              change={intl.formatNumber(item.percent_change_24h, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              componentId={this.props.componentId}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              isDarkMode={isDarkMode}
            />
          )}
        </Section>
      </TableView>
    )
  }
}
