

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { IntlProvider, FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import * as walletActions from 'actions/wallet'
import * as tickerActions from 'actions/ticker'
import * as intlActions from 'actions/intl'
import { exchangeTickerSelector } from 'selectors/ticker'
import { hot } from 'react-hot-loader'
import test from 'components/Form/ImportEOSAccountForm/messages'
import messages from './messages'
import style from './style.css'

interface Props extends RouteComponentProps<void> {
  locale: Locale
  actions: typeof tickerActions & typeof intlActions & typeof walletActions
  ticker: any
  wallet: any
}

interface State {
  price: any
}

@hot(module)

@connect(
  (state: any) => ({
    locale: state.intl.get('locale'),
    ticker: exchangeTickerSelector(state),
    wallet: state.wallet
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
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
    // this.props.actions.syncWalletRequested()
    // this.props.actions.getTickersRequested({ exchange: 'BINANCE' })
  }

  render() {
    const { locale, ticker } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <div className={style.home}>
          <div>
            Welcome to BitPortal! {test[locale].import_title_name_bpnm}
          </div>
          {ticker.map((item: any) =>
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
