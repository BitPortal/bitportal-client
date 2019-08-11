import React, { Component } from 'react'
import { View, Text, Image, FlatList, TouchableNativeFeedback } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import { currencySymbolSelector } from 'selectors/currency'
import IdentityTableViewCell from 'components/TableViewCell/IdentityTableViewCell'

const images = {
  language: require('resources/images/language_android.png'),
  currency: require('resources/images/currency_android.png')
}

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    currencySymbol: currencySymbolSelector(state),
    identity: state.identity
  })
)

export default class Settings extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '设置'
        },
        leftButtons: [
          {
            id: 'cancel',
            icon: require('resources/images/cancel_android.png'),
            color: 'white'
          }
        ]
      }
    }
  }

  navigationButtonPressed({ buttonId }) {
    switch (buttonId) {
      case 'cancel':
        Navigation.dismissModal(this.props.componentId)
        break
      default:
    }
  }

  toggleSideMenu() {
    Navigation.mergeOptions(this.props.componentId, {
      sideMenu: {
        left: {
          visible: true
        }
      }
    })
  }

  subscription = Navigation.events().bindComponent(this)

  state = {}

  componentDidMount() {

  }

  toLanguageSetting = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.LanguageSetting',
        options: {
          topBar: {
            title: {
              text: this.props.intl.formatMessage({ id: 'top_bar_title_language_setting' })
            }
          }
        }
      }
    })
  }

  toCurrencySetting = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CurrencySetting',
        options: {
          topBar: {
            title: {
              text: this.props.intl.formatMessage({ id: 'top_bar_title_currency_setting' })
            }
          }
        }
      }
    })
  }

  onPress = (type) => {
    if (type === 'language') {
      this.toLanguageSetting()
    } else if (type === 'currency') {
      this.toCurrencySetting()
    }
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableNativeFeedback onPress={this.onPress.bind(this, item.type)} background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, height: 60 }}>
          <FastImage
            source={images[item.type]}
            style={{ width: 24, height: 24, marginRight: 30 }}
          />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{item.text}</Text>
            {item.detail && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>{item.detail}</Text>}
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const { locale, currencySymbol } = this.props
    const localeName = locale === 'zh' ? '中文' : 'English'

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ paddingTop: 8 }}>
          <FlatList
            data={[
              { key: 'language', text: '语言设置', type: 'language', detail: localeName },
              { key: 'currency', text: '货币单位', type: 'currency', detail: currencySymbol }
            ]}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    )
  }
}
