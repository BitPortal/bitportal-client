/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { IntlProvider, FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { generateBIP44Address } from 'bitcoin'
import * as tickerActions from 'actions/ticker'
import { exchangeTickerSelector } from 'selectors/ticker'
import messages from './messages'
import style from './style.css'

interface Props extends RouteComponentProps<void> {
  locale: Locale
  actions: any
  ticker: any
}

interface State {
  price: any
}

@connect(
  (state: any) => ({
    locale: state.intl.get('locale'),
    ticker: exchangeTickerSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...tickerActions
    }, dispatch)
  })
)

export default class Home extends Component<Props, State> {
  constructor(props: Props, context?: {}) {
    super(props, context)
    this.state = {
      price: null
    }
  }

  componentDidMount() {
    console.log(generateBIP44Address({ coin_type: 194, account: 0, change: 0, address_index: 0 }))
    setInterval(() => {
      this.props.actions.getTickersRequested({ exchange: 'BITTREX', quote_asset: 'BTC', limit: 20, sort: 'quote_volume' })
    }, 1000)
  }

  render() {
    const { locale, ticker } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <div className={style.home}>
          {ticker.get('data').map((item: any) =>
            <div key={`${item.get('exchange')}_${item.get('market')}`}>
              {`${item.get('market')}:`}
              <FormattedNumber
                value={item.get('price_last')}
                maximumFractionDigits={8}
                minimumFractionDigits={8}
              /> |
              <FormattedNumber
                value={item.get('quote_volume')}
                maximumFractionDigits={2}
                minimumFractionDigits={2}
              />
            </div>
           )}
        </div>
      </IntlProvider>
    )
  }
}
