import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import FastImage from 'react-native-fast-image'

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    currencySymbol: state.currency.symbol,
    identity: state.identity
  })
)

export default class Profile extends Component {
  subscription = Navigation.events().bindComponent(this)

  toLanguageSetting = () => {
    /* Navigation.push(this.props.componentId, {
     *   component: {
     *     name: 'BitPortal.LanguageSetting',
     *     options: {
     *       topBar: {
     *         title: {
     *           text: this.props.intl.formatMessage({ id: 'top_bar_title_language_setting' })
     *         }
     *       }
     *     }
     *   }
     * })*/
  }

  toCurrencySetting = () => {
    /* Navigation.push(this.props.componentId, {
     *   component: {
     *     name: 'BitPortal.CurrencySetting',
     *     options: {
     *       topBar: {
     *         title: {
     *           text: this.props.intl.formatMessage({ id: 'top_bar_title_currency_setting' })
     *         }
     *       }
     *     }
     *   }
     * })*/
  }

  toContacts = () => {
    /* Navigation.push(this.props.componentId, {
     *   component: {
     *     name: 'BitPortal.Contacts',
     *     options: {
     *       topBar: {
     *         title: {
     *           text: this.props.intl.formatMessage({ id: 'top_bar_title_contacts' })
     *         }
     *       }
     *     }
     *   }
     * })*/
  }

  toMyIdentity = () => {
    /* Navigation.push(this.props.componentId, {
     *   component: {
     *     name: 'BitPortal.MyIdentity',
     *     options: {
     *       topBar: {
     *         title: {
     *           text: this.props.intl.formatMessage({ id: 'top_bar_title_my_identity' })
     *         }
     *       }
     *     }
     *   }
     * })*/
  }

  toAddIdentity = () => {
    /* Navigation.showModal({
     *   stack: {
     *     children: [{
     *       component: {
     *         name: 'BitPortal.AddIdentity'
     *       }
     *     }]
     *   }
     * })*/
  }

  toAboutUs = () => {
    /* Navigation.push(this.props.componentId, {
     *   component: {
     *     name: 'BitPortal.WebView',
     *     passProps: {
     *       url: 'https://www.bitportal.io/',
     *       id: 99999
     *     }
     *   },
     *   options: {
     *     topBar: {
     *       title: {
     *         text: 'BitPortal 官网'
     *       },
     *       leftButtons: [
     *         {
     *           id: 'cancel',
     *           text: '返回'
     *         }
     *       ]
     *     }
     *   }
     * })*/
  }

  toHelpCenter = () => {
    /* Navigation.push(this.props.componentId, {
     *   component: {
     *     name: 'BitPortal.WebView',
     *     passProps: {
     *       url: 'https://www.bitportal.io/help/',
     *       id: 99999
     *     }
     *   },
     *   options: {
     *     topBar: {
     *       title: {
     *         text: 'BitPortal 帮助中心'
     *       },
     *       leftButtons: [
     *         {
     *           id: 'cancel',
     *           text: '返回'
     *         }
     *       ]
     *     }
     *   }
     * })*/
  }

  componentDidMount() {

  }

  componentDidAppear() {

  }

  render() {
    const { identity, locale, currencySymbol, intl } = this.props
    const hasIdentity = !!identity.id

    return (
      <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <View style={{ width: '100%', height: 172 }}>
          <FastImage
            source={require('resources/images/profile_background_android.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      </View>
    )
  }
}
