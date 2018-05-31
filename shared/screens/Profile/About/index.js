/* @tsx */
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'
import VersionNumber from 'react-native-version-number'
import { BITPORTAL_API_TERMS_URL, BITPORTAL_API_UPDATE_LOG_URL } from 'constants/env'

@connect(
  (state) => ({
    locale: state.intl.get('locale')
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
          screen: `BitPortal.TermsOfService`,
          passProps: {
            title: messages[locale]['abt_sec_title_tou'],
            uri: BITPORTAL_API_TERMS_URL
          }
        })
        break
      case 'UpdateLogs':
        this.props.navigator.push({ 
          screen: `BitPortal.TermsOfService`,
          passProps: {
            title: messages[locale]['abt_sec_title_update'],
            uri: BITPORTAL_API_UPDATE_LOG_URL
          }
        })
      default:
        return
    }
    
  }

  render() {
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar 
            title={messages[locale]['abt_title_name_about']}
            leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
          />
          <View style={styles.scrollContainer}>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }} 
            >
              <View style={styles.content}>
                <Image style={styles.image} source={Images.logo} resizeMode="center" />
                <Text style={[styles.text12, { marginTop: 10 }]}> 
                  <FormattedMessage id="abt_subttl_txt_version" />
                    : {VersionNumber.appVersion} 
                </Text>
                {/* <Text multiline={true} style={[styles.text14, { marginTop: 20 }]}> 
                  <FormattedMessage id="abt_describe_txt_des" />
                </Text>  */}
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
              <SettingItem leftItemTitle={<FormattedMessage id="abt_sec_title_check" />} onPress={() => {}} />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }

}
