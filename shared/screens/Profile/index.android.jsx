import React, { Component } from 'react'
import { View, Text, Image, FlatList, TouchableNativeFeedback } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import { currencySymbolSelector } from 'selectors/currency'
import IdentityTableViewCell from 'components/TableViewCell/IdentityTableViewCell'

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    currencySymbol: currencySymbolSelector(state),
    identity: state.identity
  })
)

export default class Profile extends Component {
  subscription = Navigation.events().bindComponent(this)

  state = {
    activeTab: 'home'
  }

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

  switchTab(type) {
    this.setState({ activeTab: type }, () => {
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: false
          }
        }
      })
    })
  }

  toAddIdentity() {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.AddIdentity'
          }
        }]
      }
    })
  }

  render() {
    const { identity, locale, currencySymbol, intl } = this.props
    const hasIdentity = !!identity.id

    return (
      <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <View style={{ width: '100%', height: 172 }}>
          <FastImage
            source={require('resources/images/profile_background_android.png')}
            style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.50)', 'rgba(0,0,0,0.75)']}
            locations={[0, 0.3, 0.5, 0.75, 1]}
            style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
          />
          <Image
            source={require('resources/images/profile_placeholder_android.png')}
            style={{ width: 60, height: 60, position: 'absolute', left: 16, bottom: 76, backgroundColor: 'white', borderRadius: 30 }}
          />
          <TouchableNativeFeedback onPress={this.toAddIdentity} background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.4)', false)}>
            <View style={{ width: '100%', height: 60, position: 'absolute', left: 0, bottom: 8, paddingLeft: 16, paddingRight: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 30 }}>
              <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, color: 'white', fontWeight: '500' }}>{hasIdentity ? identity.name : intl.formatMessage({ id: 'identity_tableviewcell_identity' })}</Text>
                <Text style={{ fontSize: 14, color: 'white' }}>{hasIdentity ? identity.identifier : intl.formatMessage({ id: 'identity_tableviewcell_add_identity' })}</Text>
              </View>
              <Image
                source={require('resources/images/chevron_right.png')}
                style={{ width: 24, height: 24 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={{ paddingTop: 8 }}>
          <FlatList
            data={[{ key: 'home', text: '主页', type: 'home', active: this.state.activeTab === 'home' }, { key: 'contact', text: '联系人', type: 'contact', active: this.state.activeTab === 'contact' }, { key: 'settings', text: '设置', type: 'settings', active: this.state.activeTab === 'settings' }, { key: 'help', text: '帮助中心', type: 'help', active: this.state.activeTab === 'help' }, { key: 'aboutUs', text: '关于我们', type: 'aboutUs', active: this.state.activeTab === 'aboutUs' }]}
            renderItem={({ item }) => <IdentityTableViewCell key={item.key} data={item} onPress={this.switchTab.bind(this, item.type)} />}
          />
        </View>
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 16, borderTopWidth: 0.5, borderColor: 'rgba(0,0,0,0.54)' }}>
          <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.54)' }}>© 2019 BitPortal</Text>
        </View>
      </View>
    )
  }
}
