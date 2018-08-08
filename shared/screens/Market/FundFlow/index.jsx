import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import { SCREEN_WIDTH } from 'utils/dimens'
import { Logo, FlowInfo, ListedExchange } from './FundFlowComponents'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class TokenDetails extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    dataArr: [
      { market: 'Huobi.pro', fundFlow: '+ 95,938.03', occupy: '98%' },
      { market: 'Bitfinex ', fundFlow: '- 45,403.09', occupy: '22%' },
      { market: 'Bittrex  ', fundFlow: '+ 95,938.03', occupy: '55%' },
      { market: 'Binance  ', fundFlow: '- 45,403.09', occupy: '46%' }
    ]
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={
            <CommonButton iconName="md-arrow-back" title="Fund Flow" onPress={() => Navigation.pop(this.props.componentId)} />
          }
        />
        <View style={styles.scrollContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <Logo />
            <View style={{ width: SCREEN_WIDTH, height: 160, backgroundColor: Colors.bgColor_59_59_59 }} />
            <FlowInfo />
            <ListedExchange dataArr={this.state.dataArr} />
          </ScrollView>
        </View>
      </View>
    )
  }
}
