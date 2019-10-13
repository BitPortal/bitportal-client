import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import * as currencyActions from 'actions/currency'
import { currencySymbolSelector, currencyListSelector } from 'selectors/currency'
import CurrencyView from './CurrencyView'

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
  componentDidMount() {
    this.props.actions.getCurrencyRates.requested()
  }

  onCurrencySelected = (event) => {
    const currency = event.nativeEvent.currency
    if (currency && currency !== this.props.currency) {
      this.props.actions.setCurrency(currency)
    }
    event.persist()
  }

  render() {
    const { currencySymbol, currencyList } = this.props

    return (
      <CurrencyView
        style={{ flex: 1 }}
        onCurrencySelected={this.onCurrencySelected}
        data={Object.keys(currencyList).map(item =>
          ({
            title: `${item} (${currencyList[item].sign})`,
            accessoryType: currencySymbol === item ? '3' : '0',
            currency: item
          })
        )}
      />
    )
  }
}
