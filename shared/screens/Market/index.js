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
import Modal from 'react-native-modal'
import Exchange from 'screens/Exchange'

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
      coinName: '',
      isVisible: false
    }
    this.interval = null
  }

  searchCoin = (coinName) => {
    this.setState({ coinName })
  }

  selectMarket = () => {
    this.setState({ isVisible: true })
  }

  pressListItem = (item) => {
    this.props.actions.selectCoin(item.key)
    this.props.navigator.setDrawerEnabled({ side: 'left', enabled: false })
    this.props.navigator.push({ screen: 'BitPortal.MarketDetails' })
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.props.actions.getTickersRequested({
        exchange: 'BITTREX',
        quote_asset: 'BTC',
        limit: 20,
        sort: 'quote_volume'
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
        {/* {<TableView
          data={this.props.ticker.get('data')}
          onPress={(e) => this.pressListItem(e)}
        />} */}
        <Modal isVisible={this.state.isVisible} backdropOpacity={0.1}>
          <Exchange onPress={() => this.setState({ isVisible: false })} />
        </Modal>
      </View>
    )
  }
}
