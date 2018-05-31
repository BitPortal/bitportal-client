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
import { Text, View, InteractionManager } from 'react-native'
import Modal from 'react-native-modal'
import ExchangeList from './ExchangeList'
import { Quotes } from './Quotes'
import { EXCHANGES, EXCHANGE_NAMES, QUOTE_ASSETS } from 'constants/market'
import NavigationBar, { ListButton, CommonRightButton } from 'components/NavigationBar'

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
  selectExchange = () => {
    this.setState({ isVisible: true })
  }

  // 选择交易所
  changeExchange = (exchange) => {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isVisible: false }, () => {
        this.props.actions.selectTickersByExchange(exchange)
      })
    })
  }

  // 选择货币单位
  changeQuote = (quote) => {
    this.props.actions.selectTickersByQuoteAsset(quote)
  }

  // 点击查看币种行情
  pressListItem = (item) => {
    // this.props.actions.selectBaseAsset(item.get('base_asset'))
    // this.props.navigator.push({ screen: 'BitPortal.MarketDetails' })
  }

  // 刷新数据
  onRefresh = () => {
    this.props.actions.getTickersRequested({
      exchange: this.props.ticker.get('exchangeFilter'),
      quote_asset: this.props.ticker.get('quoteAssetFilter'),
      sort: this.props.ticker.get('sortFilter'),
      limit: 200
    })
  }

  didAppear() {
    this.onRefresh()
  }

  render() {
    const { ticker } = this.props
    const loading = ticker.get('loading')

    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<ListButton label={EXCHANGE_NAMES[ticker.get('exchangeFilter')]} onPress={() => this.selectExchange()} />}
        />
        <Quotes
          onPress={(e) => this.changeQuote(e)}
          quote={ticker.get('quoteAssetFilter')}
          quoteList={QUOTE_ASSETS[ticker.get('exchangeFilter')]}
        />
        <HeaderTitle />
        <TableView
          refreshing={loading}
          onRefresh={() => this.onRefresh()}
          data={this.props.ticker.get('data')}
          onPress={(e) => this.pressListItem(e)}
        />
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          style = {{  margin: 0 }}
          isVisible={this.state.isVisible}
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          backdropOpacity={0.3}
        >
          <ExchangeList
            exchangeList={EXCHANGES}
            activeExchange={ticker.get('exchangeFilter')}
            changeExchange={(e) => this.changeExchange(e)}
            dismissModal={() => this.setState({ isVisible: false })}
          />
        </Modal>
      </View>
    )
  }
}
