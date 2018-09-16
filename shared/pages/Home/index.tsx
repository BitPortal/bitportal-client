import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import * as walletActions from 'actions/wallet'
import * as tickerActions from 'actions/ticker'
import * as intlActions from 'actions/intl'
import { exchangeTickerSelector } from 'selectors/ticker'
import { hot } from 'react-hot-loader'
import messages from './messages'
import style from './style.css'

interface Props extends RouteComponentProps<void> {
  locale: Locale
  actions: typeof tickerActions & typeof intlActions & typeof walletActions
  ticker: any
  wallet: any
}

interface State {
  eosAccountName: any
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
  state = {
    eosAccountName: null
  }

  reload = () => {
    window.location.reload()
  }

  componentDidMount() {
    document.addEventListener('bitportalapi', () => {
      const bitportal = window.bitportal
      window.bitportal = null

      /* bitportal.getEOSTransaction({
       *   id: 'a61d51877fff5731df1fdb67dab879085af1d49c43f20698bf3be8f193ea5506'
       * }).then((data: any) => {
       *   alert(JSON.stringify(data))
       * }).catch((error: any) => {
       *   alert(JSON.stringify(error))
       * })*/
      /* bitportal.voteEOSProducers({
       *   voter: 'terencegehui',
       *   producers: ['eosasia11111', 'eosecoeoseco', 'eoshuobipool', 'eosasia11111', 'eosecoeoseco', 'eoshuobipool', 'eosasia11111', 'eosecoeoseco', 'eoshuobipool', 'eosasia11111', 'eosecoeoseco', 'eoshuobipool', 'eosasia11111', 'eosecoeoseco', 'eoshuobipool']
       * }).then((data: any) => {
       *   alert(JSON.stringify(data))
       * }).catch((error: any) => {
       *   alert(JSON.stringify(error))
       * })*/
      /* bitportal.transferEOSAsset({
       *   amount: '0.01',
       *   symbol: 'EOS',
       *   contract: 'eosio.token',
       *   from: 'terencegehui',
       *   to: 'mythicalmind',
       *   precision: 4
       * }).then((data: any) => {
       *   alert(JSON.stringify(data))
       * }).catch((error: any) => {
       *   alert(JSON.stringify(error))
       * })*/
      /* bitportal.getAppInfo().then((data: any) => {
       *   alert(JSON.stringify(data))
       * }).catch((error: any) => {
       *   alert(JSON.stringify(error))
       * })*/
      bitportal.pushEOSAction({
        actions: [
          {
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
              actor: 'aaaabbbbcccc',
              permission: 'active'
            }],
            data: {
              from: 'aaaabbbbcccc',
              to: 'itokenpocket',
              quantity: '1.3000 EOS',
              memo: 'something to say'
            }
          },
          {
            account: 'eosio',
            name: 'delegatebw',
            authorization: [
              {
                actor: 'aaaabbbbcccc',
                permission: 'active'
              }
            ],
            data: {
              from: 'aaaabbbbcccc',
              receiver: 'itokenpocket',
              stake_net_quantity: '0.0100 EOS',
              stake_cpu_quantity: '0.0100 EOS',
              transfer: 0
            }
          }
        ]
      }).then((data: any) => {
        alert(JSON.stringify(data))
      }).catch((error: any) => {
        alert(JSON.stringify(error))
      })
      /* bitportal.eosAuthSign({
       *   account: 'terencegehui',
       *   publicKey: 'EOS7HJqPYpjaiMvPo5b5cv8ZCvFGKDLdgjXUzL9tyFG3kgAjoLMfE',
       *   signData: 'hello, world'
       * }).then((data: any) => {
       *   alert(JSON.stringify(data))
       * }).catch((error: any) => {
       *   alert(JSON.stringify(error))
       * })*/
    })
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <div className={style.home}>
          <div>
            Welcome to BitPortal! {this.state.eosAccountName}
          </div>
          <div>
            <a onClick={this.reload}>reload</a>
          </div>
        </div>
      </IntlProvider>
    )
  }
}
