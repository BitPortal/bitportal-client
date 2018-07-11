/* @tsx */

import React, { Component } from 'react'
import { Text,Image, View, ScrollView, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Images from 'resources/images'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import VersionNumber from 'react-native-version-number'
import { bindActionCreators } from 'redux'
import * as versionInfoActions from 'actions/versionInfo'
import { BITPORTAL_API_TERMS_URL, BITPORTAL_API_UPDATE_LOG_URL } from 'constants/env'
import Loading from 'components/Loading'
import { isNewest, showIsLast } from 'utils/update'
import { Mediafax, MediafaxIcons, MediafaxUrls } from 'constants/mediafax'
import { validateUrl } from 'utils/validate'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    versionInfo: state.versionInfo
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...versionInfoActions
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
            name: 'BitPortal.BPWebView',
            passProps: {
              title: messages[locale].abt_sec_title_tou,
              uri: BITPORTAL_API_TERMS_URL
            }
          }
        })
        break
      case 'UpdateLogs':
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.BPWebView',
            passProps: {
              title: messages[locale].abt_sec_title_update,
              uri: BITPORTAL_API_UPDATE_LOG_URL
            }
          }
        })
        break
      default:
    }
  }

  getVersionInfo = () => {
    if (isNewest) {
      const data = this.props.versionInfo.get('data')
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
          name: `BitPortal.BPWebView`,
          passProps: {
            title,
            uri: MediafaxUrls[title]
          }
        }
      })
    } else {
      Navigation.push(this.props.componentId, {
        component: {
          name: `BitPortal.BPWebView`,
          passProps: {
            title,
            name: MediafaxUrls[title]
          }
        }
      })
    }
  }

  render() {
    const { locale, versionInfo } = this.props
    const loading = versionInfo.get('loading')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].abt_title_name_about}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            >
              <View style={styles.content}>
                <View style={[styles.image, { borderRadius: 15 }]}>
                  <Image style={styles.image} source={Images.about_logo} resizeMode="contain" />
                </View>
                <Text style={[styles.text12, { marginTop: 10 }]}>
                  <FormattedMessage id="abt_subttl_txt_version" />
                    : {VersionNumber.appVersion}
                </Text>
                <Text multiline={true} style={[styles.text14, { marginTop: 20 }]}>
                  <FormattedMessage id="abt_describe_txt_des" />
                </Text>
                <View style={styles.mediaContainer}>
                  {Mediafax.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => this.browseMedia(item)} style={[styles.border, { marginHorizontal: 5, marginVertical: 5 }]}>
                      <View style={[styles.border, styles.center, {flexDirection: 'row'}]}>
                        <Image source={MediafaxIcons[item]} style={{ marginLeft: -2, marginRight: 4, width: 16, height: 16 }} />
                        <Text style={styles.text14}>
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <SettingItem
                extraStyle={{ marginTop: 10 }}
                onPress={() => this.changePage('TermsOfService')}
                leftItemTitle={<FormattedMessage id="abt_sec_title_tou" />}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="abt_sec_title_update" />}
                onPress={() => this.changePage('UpdateLogs')}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="abt_sec_title_check" />}
                onPress={this.getVersionInfo}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="abt_sec_title_guide" />}
                onPress={this.goCheckGuide}
              />
            </ScrollView>
            <Loading isVisible={loading} />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
