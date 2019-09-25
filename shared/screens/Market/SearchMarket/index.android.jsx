import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator, RefreshControl, ScrollView, Dimensions } from 'react-native'
import { Navigation } from 'components/Navigation'
import { tickerSelector } from 'selectors/ticker'
import { currencySelector } from 'selectors/currency'
import * as tickerActions from 'actions/ticker'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import MarketTableViewCell from 'components/TableViewCell/MarketTableViewCell'
import FastImage from 'react-native-fast-image'
import Loading from 'components/Loading'
import SearchBar from 'components/Form/SearchBar'

const dataProvider = new DataProvider((r1, r2) => r1.name !== r2.name || r1.price_usd !== r2.price_usd || r1.percent_change_24h !== r2.percent_change_24h)

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

export default class SearchMarket extends Component {
  static get options() {
    return {
      topBar: {
        height: 0,
        leftButtons: [],
      }
    }
  }

  componentDidAppear() {

  }

  subscription = Navigation.events().bindComponent(this)

  layoutProvider = new LayoutProvider(
    index => {
      return 0
    },
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 60
    }
  )

  state = {
    getTickerLoading: false,
    getTickerError: false,
    tickerCount: 0,
    dataProvider: this.props.ticker.length ? dataProvider.cloneWithRows(this.props.ticker) : dataProvider,
    refreshing: false,
    dataSource: null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.getTicker.loading !== prevState.getTickerLoading
      || nextProps.getTicker.refreshing !== prevState.refreshing
      || nextProps.getTicker.error !== prevState.getTickerError
      || (nextProps.ticker && nextProps.ticker.length) !== prevState.tickerCount
    ) {
      return {
        tickerCount: (nextProps.ticker && nextProps.ticker.length),
        getTickerLoading: nextProps.getTicker.loading,
        getTickerError: nextProps.getTicker.error,
        dataProvider: nextProps.ticker.length ? dataProvider.cloneWithRows(nextProps.ticker) : dataProvider,
        refreshing: nextProps.getTicker.refreshing
      }
    } else {
      return null
    }
  }

  onSelect = () => {
    console.log('onSelect')
  }

  onRefresh = () => {
    this.props.actions.getTicker.refresh()
  }

  componentDidMount() {
    this.props.actions.getTicker.requested()
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
  }

  rowRenderer = (type, data) => {
    const { intl, currency } = this.props

    return (<MarketTableViewCell intl={intl} currency={currency} data={data} />)
  }

  onRefresh = () => {
    this.props.actions.getTicker.refresh()
  }

  onBackPress = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  render() {
    const { ticker, intl, getTicker, currency } = this.props
    const refreshing = getTicker.refreshing
    const loading = getTicker.loading

    if (loading && !ticker.length) {
      return null
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SearchBar onBackPress={this.onBackPress} />
        <RecyclerListView
          style={{ flex: 1, backgroundColor: 'white' }}
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.rowRenderer}
        />
      </View>
    )
  }
}
