/* @tsx */

import React, { Component } from 'react'
import styles from './styles'
import { connect } from 'react-redux'
import SearchItem from 'screens/Market/SearchItem'
import TableView, { HeaderTitle } from 'screens/Market/TableView'
import BaseScreen from 'components/BaseScreen'
import * as tickerActions from 'actions/ticker'
import { exchangeTickerSelector } from 'selectors/ticker'
import { bindActionCreators } from 'redux'
import { Text, View, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import Exchange from 'screens/Exchange'
import { Header, Quotes } from './Header'
import { EXCHANGES, EXCHANGE_NAMES, QUOTE_ASSETS } from 'constants/market'

@connect(
  (state) => ({
    locale:   state.intl.get('locale'),
    ticker: exchangeTickerSelector(state)
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...tickerActions
    }, dispatch)
  })
)

export default class Market extends BaseScreen {
  constructor(props, context) {
    super(props, context)
    this.state = {
      text: null,
      coinName: '',
      isVisible: false
    }
  }

  // 搜索币种
  searchCoin = (coinName) => {
    this.setState({ coinName })
  }

  // 弹出交易所列表
  selectMarket = () => {
    this.setState({ isVisible: true })
  }

  // 选择交易所
  changeExchange = (exchange) => {
    this.setState({ isVisible: false }, () => {
      this.props.actions.selectTickersByExchange(exchange)
    })
  }

  // 选择货币单位
  changeQuote = (quote) => {
    this.props.actions.selectTickersByQuoteAsset(quote)
  }

  // 点击查看币种行情
  pressListItem = (item) => {
    // this.props.actions.selectCoin(item.get('base_asset'))
    this.props.navigator.push({ screen: 'BitPortal.MarketDetails' })
  }

  // 下拉刷新拉取数据中
  onRefresh = () => {
    this.props.actions.getTickersRequested({
      exchange: this.props.ticker.get('exchangeFilter'),
      quote_asset: this.props.ticker.get('quoteAssetFilter'),
      sort: this.props.ticker.get('sortFilter'),
      limit: 20
    })
  }

  componentDidMount() {
    this.props.actions.getTickersRequested({
      exchange: this.props.ticker.get('exchangeFilter'),
      quote_asset: this.props.ticker.get('quoteAssetFilter'),
      sort: this.props.ticker.get('sortFilter'),
      limit: 20
    })
  }

  render() {
    const { ticker } = this.props
    const loading = ticker.get('loading')

    return (
      <View style={styles.container}>
        <Header
          exchange={EXCHANGE_NAMES[ticker.get('exchangeFilter')]}
          selectMarket={() => this.selectMarket()}
          searchCoin={() => this.searchCoin()}
        />
        <Quotes
          onPress={(e) => this.changeQuote(e)}
          quote={ticker.get('quoteAssetFilter')}
          quoteList={QUOTE_ASSETS[ticker.get('exchangeFilter')]}
        />
        <HeaderTitle />
        <TableView
          isRefreshing={loading}
          onRefresh={() => this.onRefresh()}
          data={this.props.ticker.get('data')}
          onPress={(e) => this.pressListItem(e)}
        />
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={this.state.isVisible}
          backdropOpacity={0.3}
        >
          <Exchange
            exchangeList={EXCHANGES}
            changeExchange={(e) => this.changeExchange(e)}
            onPress={() => this.setState({ isVisible: false })}
          />
        </Modal>
      </View>
    )
  }
}
