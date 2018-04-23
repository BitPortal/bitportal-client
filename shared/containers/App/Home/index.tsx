/* @jsx */

import React, { Component } from 'react'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { generateBIP44Address } from 'bitcoin'
import { getTickers } from 'utils/api'
import messages from './messages'
import style from './style.css'

interface Props extends RouteComponentProps<void> {
  locale: Locale
}

interface State {
  price: any
}

@connect(
  (state: any) => ({
    locale: state.intl.get('locale')
  })
)

export default class Home extends Component<Props, State> {
  constructor(props: Props, context?: {}) {
    super(props, context)
    this.state = {
      price: null
    }
  }

  async componentDidMount() {
    console.log(generateBIP44Address({ coin_type: 194, account: 0, change: 0, address_index: 0 }))

    setInterval(async () => {
      const tickers = await getTickers()
      const price = tickers.filter((ticker: any) => ticker.s === 'ETHBTC')[0].c
      this.setState({ price })
    }, 1000)
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <div className={style.home}>
          Binance ETH/BTC: {this.state.price}
        </div>
      </IntlProvider>
    )
  }
}
