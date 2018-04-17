/* @jsx */

import React, { Component } from 'react'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import messages from './messages'
import style from './style.css'

interface Props extends RouteComponentProps<void> {
  locale: Locale
}

@connect(
  (state: any) => ({
    locale: state.intl.get('locale')
  })
)

export default class Home extends Component<Props, {}> {
  async componentDidMount() {
    const { fib } = await import('sample/hello.wasm')
    console.log(fib(0))
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <div className={style.home}>
          BitPortal {locale}
        </div>
      </IntlProvider>
    )
  }
}
