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
import styles from './style.css'

interface Props extends RouteComponentProps<void> {
  locale: Locale
  actions: typeof tickerActions & typeof intlActions & typeof walletActions
  ticker: any
  wallet: any
}

interface State {
  loading: boolean
  bitportalLoaded: boolean
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
  bitportal: any

  state = {
    loading: false,
    bitportalLoaded: false
  }

  eosAuthSign = () => {
    this.setState({ loading: true })

    this.bitportal.eosAuthSign({
      account: 'terencegehui',
      publicKey: 'EOS7HJqPYpjaiMvPo5b5cv8ZCvFGKDLdgjXUzL9tyFG3kgAjoLMfE',
      signData: 'hello, world'
    }).then((data: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(data))
    }).catch((error: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(error))
    })
  }

  pushEOSAction = () => {
    this.setState({ loading: true })

    this.bitportal.pushEOSAction({
      actions: [
        {
          account: 'eosio.token',
          name: 'transfer',
          authorization: [{
            actor: 'terencegehui',
            permission: 'active'
          }],
          data: {
            from: 'terencegehui',
            to: 'mythicalmind',
            quantity: '0.0001 EOS',
            memo: 'dapp api test'
          }
        }
      ]
    }).then((data: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(data))
    }).catch((error: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(error))
    })
  }

  transferEOSAsset = () => {
    this.setState({ loading: true })

    this.bitportal.transferEOSAsset({
      amount: '0.0001',
      symbol: 'EOS',
      contract: 'eosio.token',
      from: 'terencegehui',
      to: 'mythicalmind',
      precision: 4
    }).then((data: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(data))
    }).catch((error: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(error))
    })
  }

  voteEOSProducers = () => {
    this.setState({ loading: true })

    this.bitportal.voteEOSProducers({
      voter: 'terencegehui',
      producers: [
        'eosasia11111',
        'eosecoeoseco',
        'eoshuobipool',
        'eoslaomaocom',
        'eos42freedom',
        'starteosiobp',
        'jedaaaaaaaaa',
        'eosfishrocks',
        'bitfinexeos1',
        'eoscannonchn'
      ]
    }).then((data: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(data))
    }).catch((error: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(error))
    })
  }

  getEOSTransaction = () => {
    this.setState({ loading: true })

    this.bitportal.getEOSTransaction({
      id: 'a61d51877fff5731df1fdb67dab879085af1d49c43f20698bf3be8f193ea5506'
    }).then((data: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(data))
    }).catch((error: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(error))
    })
  }

  getAppInfo = () => {
    this.setState({ loading: true })

    this.bitportal.getAppInfo().then((data: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(data))
    }).catch((error: any) => {
      this.setState({ loading: false })
      alert(JSON.stringify(error))
    })
  }

  componentDidMount() {
    document.addEventListener('bitportalapi', () => {
      this.bitportal = window.bitportal
      window.bitportal = null

      this.setState({ bitportalLoaded: false })
    })
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <div className={styles.home}>
          <div>
            Welcome to BitPortal!
          </div>
          <div>
            {this.state.loading && 'loading'}
          </div>
          <div>
            <a onClick={this.eosAuthSign}>eosAuthSign</a>
          </div>
          <div>
            <a onClick={this.pushEOSAction}>pushEOSAction</a>
          </div>
          <div>
            <a onClick={this.transferEOSAsset}>transferEOSAsset</a>
          </div>
          <div>
            <a onClick={this.voteEOSProducers}>voteEOSProducers</a>
          </div>
          <div>
            <a onClick={this.getEOSTransaction}>getEOSTransaction</a>
          </div>
          <div>
            <a onClick={this.getAppInfo}>getAppInfo</a>
          </div>
        </div>
      </IntlProvider>
    )
  }
}
