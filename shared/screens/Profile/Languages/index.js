/* @tsx */

import React from 'react'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import { bindActionCreators } from 'redux'
import * as intlActions from 'actions/intl'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import tabMessages from 'navigators/messages'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...intlActions
    }, dispatch)
  })
)

export default class Languages extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  changeTabLabels = (tabLabels) => {
    this.props.navigator.setTabButton({ tabIndex: 0, label: tabLabels.general_tab_name_ast })
    this.props.navigator.setTabButton({ tabIndex: 1, label: tabLabels.general_tab_name_mkt })
    this.props.navigator.setTabButton({ tabIndex: 2, label: tabLabels.general_tab_name_dscv })
    this.props.navigator.setTabButton({ tabIndex: 3, label: tabLabels.general_tab_name_prf })
  }

  switchLanguage = (language) => {
    this.props.actions.setLocale(language)
    const tabLabels = tabMessages[language]
    this.changeTabLabels(tabLabels)
  }

  render() {
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].lan_title_name_language}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SettingItem
                leftItemTitle="English"
                onPress={() => this.switchLanguage('en')}
                extraStyle={{ marginTop: 10 }}
                iconColor={Colors.bgColor_0_122_255}
                rightItemTitle={locale === 'en' ? null : ' '}
                rightImageName={locale === 'en' && 'md-checkmark'}
              />
              <SettingItem
                leftItemTitle="简体中文"
                iconColor={Colors.bgColor_0_122_255}
                rightItemTitle={locale === 'zh' ? null : ' '}
                rightImageName={locale === 'zh' && 'md-checkmark'}
                onPress={() => this.switchLanguage('zh')}
              />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
