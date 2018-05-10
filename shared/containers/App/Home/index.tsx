/* @jsx */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { IntlProvider, FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import * as tickerActions from 'actions/ticker'
import * as intlActions from 'actions/intl'
import { exchangeTickerSelector } from 'selectors/ticker'
import Eos from 'eosjs'
import keygen from 'eos/keygen'
import Keystore from 'eos/keystore'
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

  async componentDidMount() {
    const sessionConfig = {
      timeoutInMin: 30,
      uriRules: {
        owner: '.*',
        active: '.*',
        'active/**': '.*'
      }
    }

    console.log(keygen)
    const keystore = Keystore('eosio.token', sessionConfig)

    const eos = Eos.Localnet({
      keyProvider: '5JiJdyqw1iwNN3vZ1mHyYz1M4bZUiDEC6p1N7NDtwiEDc2bxzua',
      httpEndpoint: 'http://localhost:8888'
    })
    const account = await eos.getAccount('eosio.token')
    keystore.deriveKeys({
      parent: '5JiJdyqw1iwNN3vZ1mHyYz1M4bZUiDEC6p1N7NDtwiEDc2bxzua',
      saveKeyMatches: ['owner', 'active'],
      accountPermissions: account.permissions
    })
    console.log(keystore.getKeyPaths())
    console.log(keystore.getPublicKeys())
    console.log(keystore.getPrivateKeys())
    console.log(keystore.getKeys())
    /* eos.newaccount({
     *   creator: 'eosio',
     *   name: 'account1',
     *   owner: initaPublic,
     *   active: initaPublic,
     *   recovery: 'eosio'
     * })*/

    /* const account = await eos.getCurrencyBalance({ code: 'eosiox.token', account: 'eosio.token' })
     * console.log(account)*/
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
