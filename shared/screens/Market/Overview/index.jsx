import React, { Component } from 'react'
import { View, InteractionManager } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { sortFilterSelector, tickerSelector } from 'selectors/ticker'
import * as tokenActions from 'actions/token'
import * as tickerActions from 'actions/ticker'
import * as chartActions from 'actions/chart'
import MarketList from './MarketList'
import MarketBar from './MarketBar'

@connect(
  state => ({
    sortFilter: sortFilterSelector(state),
    exchangeFilter: state.ticker.get('exchangeFilter'),
    ticker: tickerSelector(state),
    chartType: state.chart.get('chartType')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...tokenActions,
        ...tickerActions,
        ...chartActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
class Overview extends Component {
  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.getTickersRequested({})
    })
  }

  pressListItem = item => {
    //Umeng analytics
    const symbol = item.get('symbol')
    const { chartType } = this.props
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.getTokenDetailRequested({
        symbol
      })
      this.props.actions.selectCurrentSymbol(symbol)
      this.props.actions.getChartRequested({ symbol, chartType })
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.TokenPage',
          passProps: { item }
        }
      })
    })
  }

  render() {
    const { ticker } = this.props
    return (
      <View>
        <MarketBar />
        <MarketList data={ticker} onPress={this.pressListItem} />
      </View>
    )
  }
}

export default Overview
