import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { View, Text, TouchableNativeFeedback, FlatList, Image } from 'react-native'
import { connect } from 'react-redux'
import * as currencyActions from 'actions/currency'
import { currencySymbolSelector, currencyListSelector } from 'selectors/currency'

@connect(
  state => ({
    currencySymbol: currencySymbolSelector(state),
    currencyList: currencyListSelector(state),
    wallet: state.wallet
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...currencyActions
    }, dispatch)
  })
)

export default class CurrencySetting extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '货币单位'
        },
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { currencySymbol } = nextProps

    return { extendedState: { currencySymbol } }
  }

  state ={
    extendedState: {
      currencySymbol: this.props.currencySymbol
    }
  }

  setCurrency = (symbol) => {
    this.props.actions.setCurrency(symbol)
  }

  componentDidMount() {
    this.props.actions.getCurrencyRates.requested()
  }

  renderItem = ({ item }) => {
    return (
      <TouchableNativeFeedback onPress={this.setCurrency.bind(this, item.key)} background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, height: 48 }}>
          {this.state.extendedState.currencySymbol === item.key ? <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, marginRight: 30 }} /> : <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, marginRight: 30 }} />}
          <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{item.text}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const { currencySymbol, currencyList } = this.props

    const items = Object.keys(currencyList).map(item => ({
      key: item,
      text: `${item} (${currencyList[item].sign})`
    }))

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          data={items}
          renderItem={this.renderItem}
          extendedState={this.state.extendedState}
        />
      </View>
    )
  }
}
