/* @tsx */

import React, { Component } from 'react'
import styles from './styles'
import { connect } from 'react-redux'
import Colors from 'resources/colors'
import SearchItem from 'screens/Market/SearchItem'
import TableView from 'screens/Market/TableView'
import BaseScreen from 'components/BaseScreen'
import { selectCoin } from 'actions/drawer'
import * as tickerActions from 'actions/ticker'
import { exchangeTickerSelector } from 'selectors/ticker'
import { bindActionCreators } from 'redux'
import { Text, View, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    market: state.drawer.get('selectedMarket'),
    ticker: exchangeTickerSelector(state)
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...tickerActions,
      selectCoin
    }, dispatch)
  })
)

export default class Market extends BaseScreen {

  constructor(props, context) {
    super(props, context)
    this.state = {
      text: null,
      coinName: ''
    }
    this.interval = null
  }

  searchCoin = (coinName) => {
    this.setState({ coinName })
  }

  selectMarket = () => {
    this.props.navigator.showLightBox({
      screen: "BitPortal.Exchange",
      style: {
        backgroundColor: "rgba(0,0,0,1)", 
        tapBackgroundToDismiss: true 
      },
      adjustSoftInput: "resize"
     });
  }

  pressListItem = (item) => {
    this.props.actions.selectCoin(item.key)
    this.props.navigator.setDrawerEnabled({ side: 'left', enabled: false })
    this.props.navigator.push({ screen: 'BitPortal.MarketDetails' })
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.props.actions.getTickersRequested({
        exchange: 'BINANCE',
        quote_asset: 'USDT',
        sort: 'quote_volume_24h',
        limit: 20
      })
    }, 1000)
  }

  componentWillUnMount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => {this.selectMarket()}} style={styles.navButton}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.text24}> { this.props.market } </Text>
              <View style={{ transform: [{ rotateZ: '90deg' }], marginLeft: 5, marginTop: 3 }}>
                <Ionicons name="md-play" size={10} color={Colors.bgColor_FFFFFF} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <SearchItem value={this.state.coinName} onChangeText={(e) => this.searchCoin(e)} />
        <TableView
          data={this.props.ticker.get('data')}
          onPress={(e) => this.pressListItem(e)}
        />
      </View>
    )
  }
}
