import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonTitle, CommonRightButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import VersionNumber from 'react-native-version-number'
import Dialogs from 'components/Dialog'
import Images from 'resources/images'
import { BITPORTAL_URL } from 'constants/env'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet
  }),
  null,
  null,
  { withRef: true }
)

export default class Profile extends Component {
  checkHistory = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionHistory'
      }
    })
  }

  dialog = () => {
    const { locale } = this.props
    Dialogs.alert(messages[locale].profile_button_name_err, null, { negativeText: messages[locale].profile_popup_buttom_ent })
  }

  changePage = (page) => {
    let pageName = ''
    let passProps = {}
    switch (page) {
      case 'Account':
        if (this.props.wallet.get('data').get('eosAccountName')) {
          pageName = 'AccountManager'
          passProps = this.props.wallet.get('data').toJS()
        } else {
          return this.dialog()
        }
        break
      case 'Contacts':
        if (this.props.wallet.get('data').get('eosAccountName')) {
          pageName = 'Contacts'
        } else {
          return this.dialog()
        }
        break
      case 'Resources':
        if (this.props.wallet.get('data').get('eosAccountName')) {
          pageName = 'Resources'
        } else {
          return this.dialog()
        }
        break
      case 'Voting':
      case 'About':
      case 'Mediafax':
      case 'Settings':
      case 'ContactUs':
      case 'TransactionHistory':
        pageName = page
        break
      default:
        return
    }

    Navigation.push(this.props.componentId, {
      component: {
        name: `BitPortal.${pageName}`,
        passProps
      }
    })
  }

  goForHelp = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.BPWebView',
        passProps: {
          uri: `${BITPORTAL_URL}/${this.props.locale}/help?webview=true`,
          title: messages[this.props.locale].prf_sec_titile_help
        }
      }
    })
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonTitle title={<FormattedMessage id="profile_title_name_profile" />} />}
            rightButton={<CommonRightButton imageSource={Images.transaction_history} onPress={() => this.changePage('TransactionHistory')} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
              <SettingItem leftImage={Images.profile_voting} leftItemTitle={<FormattedMessage id="prf_sec_titile_vote" />} onPress={() => this.changePage('Voting')} extraStyle={{ marginTop: 10 }} />
              <SettingItem leftImage={Images.profile_resources} leftItemTitle={<FormattedMessage id="prf_sec_titile_res" />} onPress={() => this.changePage('Resources')} />
              <SettingItem leftImage={Images.profile_contacts} leftItemTitle={<FormattedMessage id="prf_sec_titile_ctcts" />} onPress={() => this.changePage('Contacts')} />
              <SettingItem leftImage={Images.profile_account} leftItemTitle={<FormattedMessage id="prf_sec_titile_act" />} onPress={() => this.changePage('Account')} />
              <SettingItem leftImage={Images.profile_settings} leftItemTitle={<FormattedMessage id="prf_sec_titile_sts" />} onPress={() => this.changePage('Settings')} extraStyle={{ marginTop: 10 }} />
              <SettingItem leftImage={Images.help_center} leftItemTitle={<FormattedMessage id="prf_sec_titile_help" />} onPress={this.goForHelp} />
              <SettingItem leftImage={Images.profile_mediafax} leftItemTitle={<FormattedMessage id="prf_sec_titile_mdf" />} onPress={() => this.changePage('Mediafax')} />
              <SettingItem leftImage={Images.profile_about} leftItemTitle={<FormattedMessage id="prf_sec_titile_abt" />} onPress={() => this.changePage('About')} />
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
