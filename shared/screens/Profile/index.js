/* @tsx */

import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonTitle, CommonRightButton } from 'components/NavigationBar'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'
import VersionNumber from 'react-native-version-number'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet
  })
)

export default class Profile extends BaseScreen {

  checkHistory = () => {
    this.push({ screen: "BitPortal.TransactionHistory" })
  }

  changePage = (page) => {
    let pageName = ''
    let passProps = {}
    switch (page) {
      case 'Account':
        pageName = 'AccountManager'
        passProps = this.props.wallet.get('data').toJS()
        break
      case 'Vote':
      case 'About':
      case 'Contacts':
      case 'Settings':
      case 'ContactUs':
        pageName = page
        break
      default:
        return
    }
    this.props.navigator.push({ screen: `BitPortal.${pageName}`, passProps })
  }

  render() {
    const { navigation, locale, wallet } = this.props
    const hasWallet = !!wallet.get('data').get('name')

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={ <CommonTitle title={<FormattedMessage id="profile_title_name_profile" />}/> }
            rightButton={ <CommonRightButton iconName="md-timer" onPress={() => this.checkHistory()} /> }
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }} >
              <SettingItem leftItemTitle={<FormattedMessage id="prf_sec_titile_vote" />} onPress={() => this.changePage('Vote')} />
              {/* <SettingItem leftItemTitle={<FormattedMessage id="prf_sec_titile_ctcts" />} onPress={() => this.changePage('Contacts')} extraStyle={{ marginTop: 10 }} /> */}
              <SettingItem leftItemTitle={<FormattedMessage id="prf_sec_titile_act" />} onPress={() => this.changePage('Account')}  />
              <SettingItem leftItemTitle={<FormattedMessage id="prf_sec_titile_sts" />} onPress={() => this.changePage('Settings')} extraStyle={{ marginTop: 10 }} />
              <SettingItem leftItemTitle={<FormattedMessage id="prf_sec_titile_abt" />} onPress={() => this.changePage('About')} />
              {/* <SettingItem leftItemTitle={<FormattedMessage id="prf_sec_titiled_ctus" />} onPress={() => this.changePage('ContactUs')} /> */}

              <Text style={[styles.text14, { marginTop: 25 }]}> <FormattedMessage id="profile_check_txt_version" /> {VersionNumber.appVersion} </Text>
              <Text style={[styles.text14, { marginTop: 5 }]}> <FormattedMessage id="profile_cpyrt_txt_line1" /> </Text>
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }

}
