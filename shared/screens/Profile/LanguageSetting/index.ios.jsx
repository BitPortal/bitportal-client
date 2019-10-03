import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as intlActions from 'actions/intl'
import { injectIntl, FormattedMessage } from 'react-intl'
import messages from 'resources/messages'
import LanguageView from './LanguageView'

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...intlActions
    }, dispatch)
  })
)

export default class LanguageSetting extends Component {
  onLocaleSelected = (event) => {
    const locale = event.nativeEvent.locale
    if (locale && locale !== this.props.locale) {
      this.props.actions.setLocale(locale)
    }
    event.persist()
  }

  render() {
    const { locale } = this.props

    return (
      <LanguageView
        style={{ flex: 1 }}
        onLocaleSelected={this.onLocaleSelected}
        data={[
          {
            title: '中文',
            locale: 'zh',
            accessoryType: locale === 'zh' ? '3' : '0'
          },
          {
            title: 'English',
            locale: 'en',
            accessoryType: locale === 'en' ? '3' : '0'
          }
        ]}
      />
    )
  }
}
