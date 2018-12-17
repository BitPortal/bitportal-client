import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { onEventWithLabel } from 'utils/analytics'
import messages from 'resources/messages'
import * as whiteListActions from 'actions/whiteList'
import { bindActionCreators } from 'redux'
import { FLOATING_CARD_BORDER_RADIUS } from 'utils/dimens'

import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    value: state.whiteList.get('value')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...whiteListActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class Setting extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  changeSettings = page => {
    // Umeng analytics
    onEventWithLabel(`setting_${page.toLowerCase()}`, page)
    Navigation.push(this.props.componentId, {
      component: {
        name: `BitPortal.${page}`
      }
    })
  }

  onValueChange = value => {
    this.props.actions.switchWhiteListRequest({ value })
  }

  componentWillMount() {
    this.props.actions.getWhiteListValue()
  }

  render() {
    const { locale, value } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].profile_button_settings}
            leftButton={
              <CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />
            }
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SettingItem
                leftItemTitle={<FormattedMessage id="settings_button_language" />}
                onPress={() => this.changeSettings('Languages')}
                extraStyle={{
                  marginTop: 10,
                  borderTopLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                  borderTopRightRadius: FLOATING_CARD_BORDER_RADIUS
                }}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="settings_button_currency" />}
                onPress={() => this.changeSettings('Currencies')}
              />
              <SettingItem
                leftItemTitle={<FormattedMessage id="settings_button_node" />}
                onPress={() => this.changeSettings('NodeSettings')}
              />
              <SettingItem
                disabled={true}
                leftItemTitle={<FormattedMessage id="settings_label_whitelist" />}
                rightItemTitle='switch'
                value={value}
                onValueChange={this.onValueChange}
                extraStyle={{
                  borderBottomLeftRadius: FLOATING_CARD_BORDER_RADIUS,
                  borderBottomRightRadius: FLOATING_CARD_BORDER_RADIUS
                }}
              />
              {/* <SettingItem leftItemTitle={<FormattedMessage id="sts_sec_title_theme" />} onPress={() => {}} /> */}
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
