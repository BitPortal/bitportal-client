/* @jsx */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { exchangeTickerSelector } from 'selectors/ticker'
import BaseScreen from 'components/BaseScreen'
import * as chartActions from 'actions/chart'
import { EXCHANGE_NAMES } from 'constants/market'
import CoinInfoCard from './CoinInfoCard'
import MarketList from './MarketList'
import ChartWrapper from './ChartWrapper'
import styles from './styles'

const ButtonElement = ({ Title, onPress }) => (
  <TouchableOpacity style={[styles.btn, styles.center]} onPress={() => onPress()}>
    <Text style={styles.text14}>
      {Title}
    </Text>
  </TouchableOpacity>
)

@connect(
  state => ({
    ticker: exchangeTickerSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...chartActions
    }, dispatch)
  })
)

export default class MarketDetails extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  changeMarket = (data) => {
    console.log(JSON.stringify(data))
  }

  changeRoute = (screen) => {
    this.props.navigator.push({ screen: `BitPortal.${screen}` })
  }

  componentDidMount() {
    this.props.actions.getChartRequested({
      symbol_id: 'BITSTAMP_SPOT_BTC_USD',
      period_id: '1HRS',
      limit: 24
    })
  }

  render() {
    const { ticker } = this.props

    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          title={`${EXCHANGE_NAMES[ticker.get('exchangeFilter')]} / ${ticker.get('baseAsset')}`}
        />
        <View style={styles.scrollContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <CoinInfoCard />
            <ChartWrapper />
            <MarketList changeMarket={e => this.changeMarket(e)} />
          </ScrollView>
        </View>
        <View style={[styles.btnContainer, styles.spaceAround]}>
          <ButtonElement Title="Token Details" onPress={() => this.changeRoute('TokenDetails')} />
          <ButtonElement Title="Fund Flow" onPress={() => this.changeRoute('FundFlow')} />
          <ButtonElement Title="Alerts" onPress={() => this.changeRoute('Alerts')} />
        </View>
      </View>
    )
  }
}