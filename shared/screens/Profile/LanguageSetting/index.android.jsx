import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Text, TouchableNativeFeedback, FlatList, Image } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import * as intlActions from 'actions/intl'
import { injectIntl, FormattedMessage } from 'react-intl'
import messages from 'resources/messages'

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
  static get options() {
    return {
      topBar: {}
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { locale } = nextProps

    return { extendedState: { locale } }
  }

  state ={
    extendedState: {
      locale: this.props.locale
    }
  }

  setLocale = (locale) => {
    this.props.actions.setLocale(locale)
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: messages[locale].top_bar_title_language_setting
        }
      }
    })
  }

  renderItem = ({ item }) => {
    return (
      <TouchableNativeFeedback onPress={this.setLocale.bind(this, item.key)} background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, height: 48 }}>
          {this.state.extendedState.locale === item.key ? <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, marginRight: 30 }} /> : <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, marginRight: 30 }} />}
          <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{item.text}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const { locale } = this.props

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          data={[
            { key: 'en', text: 'English' },
            { key: 'zh', text: '中文' }
          ]}
          renderItem={this.renderItem}
          extendedState={this.state.extendedState}
        />
      </View>
    )
  }
}
