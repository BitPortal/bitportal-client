import React, { Component } from 'react'
import { connect } from 'react-redux'
import TableView, { HeaderTitle } from 'screens/Market/TableView'
import * as tickerActions from 'actions/ticker'
import * as tokenActions from 'actions/token'
import { exchangeTickerSelector, sortFilterSelector } from 'selectors/ticker'
import { bindActionCreators } from 'redux'
import { View, InteractionManager } from 'react-native'
import Modal from 'react-native-modal'
import { Navigation } from 'react-native-navigation'
import { EXCHANGES, EXCHANGE_NAMES, QUOTE_ASSETS } from 'constants/market'
import NavigationBar, { ListButton } from 'components/NavigationBar'
import SearchBar from 'components/SearchBar'
import { IntlProvider } from 'react-intl'
import {
  MAEKRT_LIST_SELECTED,
  QUOTES_LIST_SELECTED,
  MARKET_TOKEN_DETAIL
} from 'constants/analytics'
import { onEventWithLabel } from 'utils/analytics'
import messages from 'resources/messages'
import ExchangeList from './ExchangeList'
import { Quotes } from './Quotes'
import styles from './styles'

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
  }),
  null,
  { withRef: true }
)
export default class Market extends Component {
  state = {
    coinName: '',
    isVisible: false,
    activeQuoteAsset: null
  }

  searchCoin = (coinName) => {
    this.setState({ coinName })
  }

  selectExchange = () => {
    this.setState({ isVisible: true })
  }

  changeExchange = (exchange) => {
    //Umeng analytics
    onEventWithLabel(MAEKRT_LIST_SELECTED, exchange)
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isVisible: false, activeQuoteAsset: null }, () => {
        this.props.actions.selectTickersByExchange(exchange)
      })
    })
  }

  changeQuote = (quote) => {
    //Umeng analytics
    onEventWithLabel(QUOTES_LIST_SELECTED, quote)
    this.setState({ activeQuoteAsset: quote }, () => {
      InteractionManager.runAfterInteractions(() => {
        this.props.actions.selectTickersByQuoteAsset(quote)
      })
    })
  }

  pressListItem = (item) => {
    //Umeng analytics
    onEventWithLabel(MARKET_TOKEN_DETAIL, '行情 - token详情')
    const baseAsset = item.get('base_asset')
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.selectCurrentPair(item)
      this.props.actions.selectBaseAsset(baseAsset)
      this.props.actions.getTokenDetailRequested({ symbol: baseAsset })
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.MarketDetails',
          passProps: { item }
        }
      })
    })
  }

  onRefresh = () => {
    this.props.actions.getTickersRequested({
      exchange: this.props.exchangeFilter,
      quote_asset: this.props.quoteAssetFilter,
      sort: this.props.sortFilter,
      limit: 200
    })
  }

  closeExchangeList = () => {
    this.setState({ isVisible: false })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.loading !== this.props.loading
      || nextProps.locale !== this.props.locale
      || nextProps.exchangeFilter !== this.props.exchangeFilter
      || nextProps.sortFilter !== this.props.sortFilter
      || nextProps.quoteAssetFilter !== this.props.quoteAssetFilter
      || nextState.isVisible !== this.state.isVisible
      || nextState.coinName !== this.state.coinName
      || nextState.activeQuoteAsset !== this.state.activeQuoteAsset
      || nextState.searchTerm !== this.props.searchTerm
    )
  }

  componentDidAppear() {
    this.onRefresh()
  }

  onChangeText = (text) => {
    this.props.actions.setSearchTerm(text)
  }

  render() {
    const {
      ticker,
      locale,
      loading,
      exchangeFilter,
      quoteAssetFilter,
      searchTerm
    } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={
              <ListButton
                label={EXCHANGE_NAMES[exchangeFilter]}
                onPress={this.selectExchange}
              />
            }
            rightButton={
              <SearchBar
                searchTerm={searchTerm}
                onChangeText={text => this.onChangeText(text)}
                clearSearch={() => {
                  this.props.actions.setSearchTerm('')
                }}
              />
            }
          />
          <Quotes
            onPress={this.changeQuote}
            quote={this.state.activeQuoteAsset || quoteAssetFilter}
            quoteList={QUOTE_ASSETS[exchangeFilter]}
          />
          <HeaderTitle messages={messages[locale]} />
          <TableView
            refreshing={loading}
            onRefresh={this.onRefresh}
            data={ticker}
            onPress={this.pressListItem}
          />
          <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ margin: 0 }}
            isVisible={this.state.isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            backdropOpacity={0.3}
          >
            <ExchangeList
              exchangeList={EXCHANGES}
              activeExchange={exchangeFilter}
              changeExchange={this.changeExchange}
              dismissModal={this.closeExchangeList}
            />
          </Modal>
        </View>
      </IntlProvider>
    )
  }
}
