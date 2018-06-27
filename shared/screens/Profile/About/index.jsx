/* @tsx */
import React from 'react'
import { Text, View, ScrollView, Image } from 'react-native'
import BaseScreen from 'components/BaseScreen'
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
  })
)

export default class About extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  changePage = (page) => {
    const { locale } = this.props
    switch (page) {
      case 'TermsOfService':
        this.props.navigator.push({
          screen: 'BitPortal.TermsOfService',
          passProps: {
            title: messages[locale].abt_sec_title_tou,
            uri: BITPORTAL_API_TERMS_URL
          }
        })
        break
      case 'UpdateLogs':
        this.props.navigator.push({
          screen: 'BitPortal.TermsOfService',
          passProps: {
            title: messages[locale].abt_sec_title_update,
            uri: BITPORTAL_API_UPDATE_LOG_URL
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
    this.props.navigator.push({
      screen: 'BitPortal.Welcome',
      passProps: {
        from: 'about'
      }
    })
  }

  render() {
    const { locale, versionInfo } = this.props
    const loading = versionInfo.get('loading')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].abt_title_name_about}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            >
              <View style={styles.content}>
                <View style={[styles.image, { borderRadius: 15 }]}>
                  <Image style={styles.image} source={Images.logo} resizeMode="contain" />
                </View>
                <Text style={[styles.text12, { marginTop: 10 }]}>
                  <FormattedMessage id="abt_subttl_txt_version" />
                    : {VersionNumber.appVersion}
                </Text>
                <Text multiline={true} style={[styles.text14, { marginTop: 20 }]}>
                  <FormattedMessage id="abt_describe_txt_des" />
                </Text>
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