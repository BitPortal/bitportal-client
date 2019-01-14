import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import * as intlActions from 'actions/intl'
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
    locale: state.intl.get('locale')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...intlActions
    }, dispatch)
  })
)

export default class Home extends Component<Props, State> {
  bitportal: any

  componentDidMount() {
    console.log('loaded')
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <div className={styles.home}>
          <div>
            Welcome to BitPortal!
          </div>
        </div>
      </IntlProvider>
    )
  }
}
