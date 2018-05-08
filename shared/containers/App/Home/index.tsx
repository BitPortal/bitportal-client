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
import { Keystore, Keygen } from 'eosjs-keygen'
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
    const sessionConfig = {
      timeoutInMin: 30,
      uriRules: {
        owner: '/account_recovery',
        active: '/(transfer|contracts)',
        'active/**': '/producers'
      }
    }

    const keystore = Keystore('myaccount1', sessionConfig)
    console.log(keystore)

    const ecc = Eos.modules.ecc

    Keygen.generateMasterKeys().then(async (keys: any) => {
      console.log(keys)

      const eos = Eos.Localnet({
        httpEndpoint: 'http://35.229.209.212:8888',
        keyProvider: ecc.seedPrivate(keys.masterPrivateKey)
      })

      console.log(eos)
      await eos.newaccount({
        creator: 'eosio',
        name: 'myaccount1',
        owner: ecc.privateToPublic(ecc.seedPrivate(keys.masterPrivateKey)),
        active: ecc.privateToPublic(ecc.seedPrivate(keys.masterPrivateKey)),
        recovery: 'eosio'
      })

      /* eos.getAccount('eosio').then((account: any) => {
       *   keystore.deriveKeys({
       *     parent: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
       *     accountPermissions: account.permissions
       *   })
       *   console.log(account)
       * })*/
    })
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
