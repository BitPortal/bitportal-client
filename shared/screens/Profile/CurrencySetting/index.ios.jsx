import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
// import { View } from 'react-native'
import { connect } from 'react-redux'
import TableView from 'react-native-tableview'
import * as currencyActions from 'actions/currency'
import { currencySymbolSelector, currencyListSelector } from 'selectors/currency'

const { Section, Item } = TableView

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

  componentDidMount() {
    this.props.actions.getCurrencyRates.requested()
  }

  render() {
    const { currencySymbol, currencyList } = this.props

    return (
      <TableView
        style={{ flex: 1 }}
        tableViewStyle={TableView.Consts.Style.Grouped}
      >
        <Section />
        <Section>
          {Object.keys(currencyList).map(item =>
            <Item
              key={item}
              accessoryType={currencySymbol === item ? TableView.Consts.AccessoryType.Checkmark : TableView.Consts.AccessoryType.None}
              onPress={this.setCurrency.bind(this, item)}
            >
              {`${item} (${currencyList[item].sign})`}
            </Item>
           )}
        </Section>
      </TableView>
    )
  }
}
