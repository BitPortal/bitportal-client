import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator, RefreshControl, ScrollView, Dimensions } from 'react-native'
import { Navigation } from 'components/Navigation'
import { tickerSelector, tickerSearchSelector } from 'selectors/ticker'
import { currencySelector } from 'selectors/currency'
import * as tickerActions from 'actions/ticker'
import * as uiActions from 'actions/ui'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import MarketTableViewCell from 'components/TableViewCell/MarketTableViewCell'
import FastImage from 'react-native-fast-image'
import Loading from 'components/Loading'
import Modal from 'react-native-modal'
import SearchBar from 'components/Form/SearchBar'

const dataProvider = new DataProvider((r1, r2) => r1.name !== r2.name || r1.price_usd !== r2.price_usd || r1.percent_change_24h !== r2.percent_change_24h)
const searchDataProvider = new DataProvider((r1, r2) => r1.name !== r2.name || r1.price_usd !== r2.price_usd || r1.percent_change_24h !== r2.percent_change_24h)

@injectIntl

@connect(
  state => ({
    getTicker: state.getTicker,
    ticker: tickerSelector(state),
    searchTicker: tickerSearchSelector(state),
    currency: currencySelector(state),
    ui: state.ui
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...tickerActions,
      ...uiActions
    }, dispatch)
  })
)

export default class Market extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '行情'
        }
      }
    }
  }

  // subscription = Navigation.events().bindComponent(this)

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
    dataSource: null,
    searchBarEnabled: false,
    searchTickerCount: 0,
    searchDataProvider: this.props.searchTicker.length ? searchDataProvider.cloneWithRows(this.props.searchTicker) : searchDataProvider,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.getTicker.loading !== prevState.getTickerLoading
      || nextProps.getTicker.refreshing !== prevState.refreshing
      || nextProps.getTicker.error !== prevState.getTickerError
      || (nextProps.ticker && nextProps.ticker.length) !== prevState.tickerCount
      || (nextProps.searchTicker && nextProps.searchTicker.length) !== prevState.searchTickerCount
    ) {
      return {
        tickerCount: (nextProps.ticker && nextProps.ticker.length),
        searchTickerCount: (nextProps.searchTicker && nextProps.searchTicker.length),
        getTickerLoading: nextProps.getTicker.loading,
        getTickerError: nextProps.getTicker.error,
        dataProvider: nextProps.ticker.length ? dataProvider.cloneWithRows(nextProps.ticker) : dataProvider,
        searchDataProvider: nextProps.searchTicker.length ? searchDataProvider.cloneWithRows(nextProps.searchTicker) : searchDataProvider,
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
    this.props.actions.handleTickerSearchTextChange('')
    this.props.actions.hideSearchBar()
  }

  searchBarUpdated = ({ text }) => {
    this.props.actions.handleTickerSearchTextChange(text)
  }

  searchBarCleared = () => {
    this.props.actions.handleTickerSearchTextChange('')
  }

  render() {
    const { ticker, intl, getTicker, currency, ui } = this.props
    const refreshing = getTicker.refreshing
    const loading = getTicker.loading

    if (loading && !ticker.length) {
      return (
        <Loading text="加载行情..." />
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Modal
          isVisible={ui.searchBarEnabled}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={100}
          backdropTransitionInTiming={100}
          animationOut="fadeOut"
          animationOutTiming={100}
          backdropTransitionOutTiming={100}
          style={{ margin: 0 }}
          onBackdropPress={this.onBackPress}
        >
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <SearchBar onBackPress={this.onBackPress} searchBarUpdated={this.searchBarUpdated} searchBarCleared={this.searchBarCleared} hasSearchResult={!!this.state.searchTickerCount} />
            <View style={{ height: 60 * this.state.searchTickerCount, width: '100%', paddingHorizontal: 8, maxHeight: (Dimensions.get('window').height - 16) }}>
              <View style={{ flex: 1, backgroundColor: 'white', borderBottomLeftRadius: 4, borderBottomRightRadius: 4, overflow: 'hidden' }}>
                {!!this.state.searchTickerCount && <RecyclerListView
                                                     style={{ backgroundColor: 'white', flex: 1 }}
                                                     layoutProvider={this.layoutProvider}
                                                     dataProvider={this.state.searchDataProvider}
                                                     rowRenderer={this.rowRenderer}
                                                   />}
              </View>
            </View>
          </View>
        </Modal>
        <RecyclerListView
          style={{ flex: 1, backgroundColor: 'white' }}
          layoutProvider={this.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.rowRenderer}
          scrollViewProps={{ refreshControl: <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} /> }}
        />
      </View>
    )
  }
}
