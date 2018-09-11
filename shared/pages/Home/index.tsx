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
       *   producers: ['eosasia11111', 'eosecoeoseco', 'eoshuobipool']
       * }).then((data: any) => {
       *   alert(JSON.stringify(data))
       * }).catch((error: any) => {
       *   alert(JSON.stringify(error))
       * })*/
      /* bitportal.transferEOSAsset({
       *   amount: '0.0001',
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

      bitportal.getCurrentWallet().then((data: any) => {
        alert(JSON.stringify(data))
      }).catch((error: any) => {
        alert(JSON.stringify(error))
      })
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
        </div>
      </IntlProvider>
    )
  }
}
