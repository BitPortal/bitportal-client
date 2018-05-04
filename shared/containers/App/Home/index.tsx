/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { IntlProvider, FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { generateBIP44Address } from 'bitcoin'
import * as tickerActions from 'actions/ticker'
import * as intlActions from 'actions/intl'
import { exchangeTickerSelector } from 'selectors/ticker'
import Eos from 'eosjs'
import messages from './messages'
import style from './style.css'

interface Props extends RouteComponentProps<void> {
  locale: Locale
  actions: typeof tickerActions & typeof intlActions
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
      ...tickerActions,
      ...intlActions
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
    // this.props.actions.getTickersRequested({ exchange: 'BITTREX', quote_asset: 'BTC', limit: 20, sort: 'quote_volume' })
    const eos = Eos.Localnet({ httpEndpoint: 'http://13.58.45.36:8888' })
    eos.getBlock(1).then((result: any) => { console.log(result) })
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
