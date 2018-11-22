import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import BPImage from 'components/BPNativeComponents/BPImage'
import { Navigation } from 'react-native-navigation'
import Images from 'resources/images'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import VersionNumber from 'react-native-version-number'
import { bindActionCreators } from 'redux'
import * as versionActions from 'actions/version'
import { BITPORTAL_API_TERMS_URL, BITPORTAL_API_UPDATE_LOG_URL } from 'constants/env'
import Loading from 'components/Loading'
import { isNewest, showIsLast } from 'utils/update'
import { MediafaxUrls } from 'constants/mediafax'
import { validateUrl } from 'utils/validate'
import messages from 'resources/messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    version: state.version
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...versionActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class About extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  changePage = (page) => {
    const { locale } = this.props
    switch (page) {
      case 'TermsOfService':
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.DappWebView',
            passProps: {
              title: messages[locale].about_us_button_tos,
              uri: BITPORTAL_API_TERMS_URL
            }
          }
        })
        break
      case 'UpdateLogs':
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.DappWebView',
            passProps: {
              title: messages[locale].about_us_button_update_log,
              uri: BITPORTAL_API_UPDATE_LOG_URL
            }
          }
        })
        break
      default:
    }
  }

  getVersionInfo = () => {
    if (isNewest()) {
      const data = this.props.version.get('data')
      const locale = this.props.locale
      showIsLast(data, locale)
    } else {
      this.props.actions.getVersionInfoRequested()
    }
  }

  goCheckGuide = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.Welcome',
        passProps: {
          from: 'about'
        }
      }
    })
  }

  browseMedia = (title) => {
    if (validateUrl(MediafaxUrls[title])) {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.DappWebView',
          passProps: {
            title,
            uri: MediafaxUrls[title]
          }
        }
      })
    } else {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.DappWebView',
          passProps: {
            title,
            name: MediafaxUrls[title]
          }
        }
      })
    }
  }

  render() {
    const { locale, version } = this.props
    const loading = version.get('loading')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].profile_button_about_us}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            >
              <View style={styles.content}>
                <View style={[styles.image, { borderRadius: 15 }]}>
                  <BPImage style={styles.image} source={Images.about_logo} resizeMode="contain" />
                </View>
                <Text style={[styles.text12, { marginTop: 10 }]}>
                  <FormattedMessage id="profile_text_version" />
                    : {VersionNumber.appVersion}
                </Text>
                <Text multiline={true} style={[styles.text14, { marginTop: 20 }]}>
                  <FormattedMessage id="about_us_text_bitportal" />
                </Text>
              </View>
              <SettingItem
                extraStyle={{ marginTop: 10 }}
                onPress={() => this.changePage('TermsOfService')}
                leftItemTitle={<FormattedMessage id="about_us_button_tos" />}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="about_us_button_update_log" />}
                onPress={() => this.changePage('UpdateLogs')}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="about_us_button_update_check" />}
                onPress={this.getVersionInfo}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="about_us_button_product_intro" />}
                onPress={this.goCheckGuide}
              />
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
