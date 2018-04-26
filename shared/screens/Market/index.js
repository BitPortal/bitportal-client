/* @tsx */

import React, { Component } from 'react'
import styles from './styles'
import { connect } from 'react-redux'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'
import SearchItem from 'screens/Market/SearchItem'
import TableView from 'screens/Market/TableView'
import BaseScreen from 'components/BaseScreen'
import { selectCoin } from 'actions/drawer'
import * as tickerActions from 'actions/ticker'
import { exchangeTickerSelector } from 'selectors/ticker'
import { bindActionCreators } from 'redux'
import NavigationBar, { LeftButton, RightButton } from 'components/NavigationBar'
import { Text, View, TouchableOpacity } from 'react-native'

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
      text: null
    }
    this.interval = null
  }

  searchCoin = () => {
    this.props.navigator.push({
      screen: 'BitPortal.Search',
      animationType: 'fade',
      navigatorStyle: {
        navBarHidden: true
      }
    })
  }

  openDrawer = () => {
    this.props.navigator.toggleDrawer({ side: 'left', animated: true, to: 'open' })
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
        <NavigationBar
          leftButton={
            <LeftButton iconName="md-menu" title={this.props.market} onPress={() => this.openDrawer()}/>
                     }
          rightButton={(
              <RightButton onPress={() => {}} />
            )}
        />
        <SearchItem onPress={() => this.searchCoin()} />
        <TableView
          data={this.props.ticker.get('data')}
          onPress={(e) => this.pressListItem(e)}
        />
      </View>
    )
  }
}
