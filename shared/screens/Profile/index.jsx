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
import { hasEOSAccountSelector } from 'selectors/wallet'
import { BITPORTAL_WEBSITE_URL } from 'constants/env'
import { onEventWithLabel } from 'utils/analytics'
import { HELP_CENTER, PROFILE } from 'constants/analytics'
import Colors from 'resources/colors'
import messages from 'resources/messages'
import { FLOATING_CARD_BORDER_RADIUS } from 'utils/dimens'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    hasEOSAccount: hasEOSAccountSelector(state)
  }),
  null,
  null,
  { withRef: true }
)
export default class Profile extends Component {
  static get options() {
    return {
      bottomTabs: {
        backgroundColor: Colors.minorThemeColor
      }
    }
  }

  checkHistory = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionHistory'
      }
    })
  }

  dialog = () => {
    const { locale } = this.props
    Dialogs.alert(messages[locale].general_error_popup_text_no_account, null, {
      negativeText: messages[locale].general_popup_button_close
    })
  }

  changePage = page => {
    let pageName = ''
    let passProps = {}
    switch (page) {
      case 'Account':
        if (this.props.hasEOSAccount) {
          pageName = 'AccountManager'
          passProps = {
            origin: this.props.wallet.getIn(['data', 'origin']),
            bpid: this.props.wallet.getIn(['data', 'bpid']),
            eosAccountName: this.props.wallet.getIn(['data', 'eosAccountName']),
            coin: this.props.wallet.getIn(['data', 'coin'])
          }
        } else {
          return this.dialog()
        }
        break
      case 'Contacts':
        if (this.props.hasEOSAccount) {
          pageName = 'Contacts'
        } else {
          return this.dialog()
        }
        break
      case 'Resources':
        if (this.props.hasEOSAccount) {
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
    // Umeng analytics
    onEventWithLabel(PROFILE, pageName)
    Navigation.push(this.props.componentId, {
      component: {
        name: `BitPortal.${pageName}`,
        passProps
      }
    })
  }

  goForHelp = () => {
    // Umeng analytics
    onEventWithLabel(HELP_CENTER, '帮助中心')

    const locale = this.props.locale === 'zh' ? `${this.props.locale}/` : ''
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappWebView',
        passProps: {
          uri: `${BITPORTAL_WEBSITE_URL}/${locale}help/?webview=true`,
          title: messages[this.props.locale].profile_button_help_center
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
            leftButton={<CommonTitle title={<FormattedMessage id="profile_title_profile" />} />}
            rightButton={
              <CommonRightButton
                imageSource={Images.transaction_history}
                onPress={this.changePage.bind(this, 'TransactionHistory')}
              />
            }
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewStyle}>
              <SettingItem
                leftImage={Images.profile_voting}
                leftItemTitle={<FormattedMessage id="profile_button_voting" />}
                onPress={this.changePage.bind(this, 'Voting')}
                extraStyle={{
                  marginTop: 0,
                  borderTopLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                  borderTopRightRadius: FLOATING_CARD_BORDER_RADIUS
                }}
              />
              <SettingItem
                leftImage={Images.profile_resources}
                leftItemTitle={<FormattedMessage id="profile_button_resource" />}
                onPress={this.changePage.bind(this, 'Resources')}
              />
              <SettingItem
                leftImage={Images.profile_contacts}
                leftItemTitle={<FormattedMessage id="profile_button_contacts" />}
                onPress={this.changePage.bind(this, 'Contacts')}
              />
              <SettingItem
                leftImage={Images.profile_account}
                leftItemTitle={<FormattedMessage id="profile_button_wallet_mgmt" />}
                onPress={this.changePage.bind(this, 'Account')}
                extraStyle={{
                  borderBottomLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                  borderBottomRightRadius: FLOATING_CARD_BORDER_RADIUS,
                  marginBottom: 8
                }}
              />
              <SettingItem
                leftImage={Images.profile_settings}
                leftItemTitle={<FormattedMessage id="profile_button_settings" />}
                onPress={this.changePage.bind(this, 'Settings')}
                extraStyle={{
                  borderTopLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                  borderTopRightRadius: FLOATING_CARD_BORDER_RADIUS
                }}
              />
              <SettingItem
                leftImage={Images.help_center}
                leftItemTitle={<FormattedMessage id="profile_button_help_center" />}
                onPress={this.goForHelp}
              />
              <SettingItem
                leftImage={Images.profile_mediafax}
                leftItemTitle={<FormattedMessage id="profile_button_follow_us" />}
                onPress={this.changePage.bind(this, 'Mediafax')}
              />
              <SettingItem
                leftImage={Images.profile_about}
                leftItemTitle={<FormattedMessage id="profile_button_about_us" />}
                onPress={this.changePage.bind(this, 'About')}
                extraStyle={{
                  borderBottomLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                  borderBottomRightRadius: FLOATING_CARD_BORDER_RADIUS
                }}
              />

              <Text style={[styles.text14, { marginTop: 25 }]}>
                {' '}
                <FormattedMessage id="profile_text_version" /> {VersionNumber.appVersion}{' '}
              </Text>
              <Text style={[styles.text14, { marginTop: 5 }]}>
                <FormattedMessage id="profile_text_copyright_1" />
              </Text>
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
