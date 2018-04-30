/* @tsx */

import React, { Component } from 'react'
import styles from './styles'
import { connect } from 'react-redux'
import SearchItem from 'screens/Market/SearchItem'
import TableView, { HeaderTitle } from 'screens/Market/TableView'
import BaseScreen from 'components/BaseScreen'
import * as marketActions from 'actions/drawer'
import * as tickerActions from 'actions/ticker'
import { exchangeTickerSelector } from 'selectors/ticker'
import { bindActionCreators } from 'redux'
import { Text, View, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import Exchange from 'screens/Exchange'
import { Header, Quotes } from './Header'
import { exchanges, quotes } from 'utils/exchanges'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    market: state.drawer.get('selectedExchange'),
    quote:  state.drawer.get('selectedQuote'),
    sortType: state.drawer.get('sortType'),
    ticker: exchangeTickerSelector(state)
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...tickerActions,
      ...marketActions
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
    this.interval = null
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
      this.props.actions.startToRefreshTicker()
      this.props.actions.selectExchange(exchange)
    })
  }

  // 选择货币单位
  changeQuote = (quote) => {
    this.props.actions.startToRefreshTicker()
    this.props.actions.selectQuote(quote)
  }

  // 点击查看币种行情
  pressListItem = (item) => {
    this.props.actions.selectCoin(item.key)
    this.props.navigator.push({ screen: 'BitPortal.MarketDetails' })
  }

  // 等待拉取数据中
  onRefresh = () => {

  }

  // 定时拉取行情
  componentDidMount() {
    this.interval = setInterval(() => {
      this.props.actions.getTickersRequested({
        exchange: this.props.market.toLocaleUpperCase(),
        quote_asset: this.props.quote,
        limit: 20,
        sort: this.props.sortType
      })
    }, 3000)
  }

  componentWillUnMount() {
    clearInterval(this.interval)
  }

  render() {
    // console.log('### ---- 88', this.props.ticker.get('data'))
    const { ticker } = this.props
    return (
      <View style={styles.container}>
        <Header 
          market={this.props.market} 
          selectMarket={() => this.selectMarket()} 
          searchCoin={() => this.searchCoin()} 
        />
        <Quotes 
          onPress={(e) => this.changeQuote(e)} 
          quote={this.props.quote} 
          quoteList={quotes[this.props.market.toLocaleUpperCase()]} 
        />
        <HeaderTitle />
        <TableView
          isRefreshing={ticker.get('isRefreshing')}
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
            exchangeList={exchanges} 
            changeExchange={(e) => this.changeExchange(e)} 
            onPress={() => this.setState({ isVisible: false })} 
          />
        </Modal>
      </View>
    )
  }
}
