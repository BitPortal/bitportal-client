/* @tsx */

import { FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'

@connect(
  (state) => ({
    rate: state.currency.get('rate')
  })
)

export const CurrencyText = ({ rate, value, ...extraProps }) => (
  <FormattedNumber  value={value*rate} {...extraProps} />
)