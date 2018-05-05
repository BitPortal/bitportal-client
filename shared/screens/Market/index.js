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
import Modal from 'react-native-modal'
import ExchangeList from './ExchangeList'
import { Header, Quotes } from './Header'
import { EXCHANGES, EXCHANGE_NAMES, QUOTE_ASSETS } from 'constants/market'
import Eos from 'react-native-eosjs'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
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
      this.list.list.scrollToOffset({ offset: 0, animated: false })
      this.list.list.scrollToOffset({ offset: -60, animated: true })
      this.props.actions.selectTickersByExchange(exchange)
    })
  }

  // 选择货币单位
  changeQuote = (quote) => {
    this.list.list.scrollToOffset({ offset: 0, animated: false })
    this.list.list.scrollToOffset({ offset: -60, animated: true })
    this.props.actions.selectTickersByQuoteAsset(quote)
  }

  // 点击查看币种行情
  pressListItem = (item) => {
    this.props.actions.selectBaseAsset(item.get('base_asset'))
    this.props.navigator.push({ screen: 'BitPortal.MarketDetails' })
  }

  // 刷新数据
  onRefresh = () => {
    this.props.actions.getTickersRequested({
      exchange: this.props.ticker.get('exchangeFilter'),
      quote_asset: this.props.ticker.get('quoteAssetFilter'),
      sort: this.props.ticker.get('sortFilter'),
      limit: 20
    })
  }

  async didAppear() {
    this.onRefresh()
    eos = Eos.Localnet({ httpEndpoint: 'http://13.58.45.36:8888' })
    console.log(await eos.getBlock(1))
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
          ref={(list) => this.list = list}
        />
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={this.state.isVisible}
          backdropOpacity={0.3}
        >
          <ExchangeList
            exchangeList={EXCHANGES}
            changeExchange={(e) => this.changeExchange(e)}
            onPress={() => this.setState({ isVisible: false })}
          />
        </Modal>
      </View>
    )
  }
}
