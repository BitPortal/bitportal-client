import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
// import { View } from 'react-native'
import { connect } from 'react-redux'
import TableView from 'react-native-tableview'
import * as currencyActions from 'actions/currency'

const { Section, Item } = TableView

@connect(
  state => ({
    currencySymbol: state.currency.symbol,
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
        largeTitle: {
          visible: false
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  setCurrency = (symbol) => {
    this.props.actions.setCurrency(symbol)
  }

  render() {
    const { currencySymbol } = this.props

    return (
      <TableView
        style={{ flex: 1 }}
        tableViewStyle={TableView.Consts.Style.Grouped}
      >
        <Section />
        <Section>
          <Item
            accessoryType={currencySymbol === 'USD' ? TableView.Consts.AccessoryType.Checkmark : TableView.Consts.AccessoryType.None}
            onPress={this.setCurrency.bind(this, 'USD')}
          >
            USD
          </Item>
          <Item
            accessoryType={currencySymbol === 'CNY' ? TableView.Consts.AccessoryType.Checkmark : TableView.Consts.AccessoryType.None}
            onPress={this.setCurrency.bind(this, 'CNY')}
          >
            CNY
          </Item>
        </Section>
      </TableView>
    )
  }
}
