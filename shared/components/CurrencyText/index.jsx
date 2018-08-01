import { FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Text } from 'react-native'

@connect(
  state => ({
    rate: state.currency.get('rate'),
    symbol: state.currency.get('symbol')
  })
)

export default class CurrencyText extends Component {
  render() {
    const { symbol, rate, value, ...extraProps } = this.props

    return (
      <Text>
        {symbol === 'USD' ? '$' : '\u00A5'}
        <FormattedNumber 
          value={value * rate} 
          maximumFractionDigits={2} 
          minimumFractionDigits={2} 
          {...extraProps} 
        />
      </Text>
    )
  }
}
