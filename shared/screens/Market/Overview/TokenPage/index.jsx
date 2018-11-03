import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tokenActions from 'actions/token'
import * as chartActions from 'actions/chart'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView, InteractionManager } from 'react-native'
import TokenCard from './TokenCard'
import TokenChart from './TokenChart'
import TokenDetails from './TokenDetails'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    listedExchange: state.ticker.get('listedExchange'),
    loading: state.ticker.get('loading'),
    baseAsset: state.ticker.get('baseAsset'),
    chartType: state.chart.get('chartType')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...tokenActions,
        ...chartActions
      },
      dispatch
    )
  }),
  null,
  {
    withRef: true
  }
)
export default class TokenPage extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  UNSAFE_componentWillMount() {
    const symbol = this.props.item.get('symbol')
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.getTokenDetailRequested({
        symbol
      })
      this.props.actions.getChartRequested({
        symbol,
        chartType: this.props.chartType
      })
    })
  }

  componentWillUnmount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.clearChart({})
    })
  }

  render() {
    const { item } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          title={item.get('symbol')}
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TokenCard ticker={item} />
            <TokenChart />
            <TokenDetails ticker={item} />
          </ScrollView>
        </View>
      </View>
    )
  }
}