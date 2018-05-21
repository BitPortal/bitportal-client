/* @tsx */

import React, { Component } from 'react'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as intlActions from 'actions/intl'
import storage from 'utils/storage'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableHighlight, Switch } from 'react-native'
import { startTabBasedApp } from 'navigators'
import messages from 'navigators/messages'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
  }),
  (dispatch) => ({
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
    this.props.navigator.setTabButton({ tabIndex: 0, label: tabLabels['general_tab_name_ast'] })
    this.props.navigator.setTabButton({ tabIndex: 1, label: tabLabels['general_tab_name_mkt'] })
    this.props.navigator.setTabButton({ tabIndex: 2, label: tabLabels['general_tab_name_dscv'] })
    this.props.navigator.setTabButton({ tabIndex: 3, label: tabLabels['general_tab_name_prf'] })
  }

  switchLanguage = async (language) => {
    await storage.setItem('bitportal_lang', language)
    this.props.actions.setLocale(language)
    const tabLabels = messages[language]
    this.changeTabLabels(tabLabels)
  }

  render() {
    const { locale } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar 
          title="Languages"
          leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <SettingItem 
              leftItemTitle={'EN'} 
              onPress={() => this.switchLanguage('en')} 
              extraStyle={{ marginTop: 10 }} 
              iconColor={Colors.bgColor_0_122_255}
              rightItemTitle={locale == 'en' ? null : ' '}
              rightImageName={locale == 'en' && 'md-checkmark'}
            />
            <SettingItem 
              leftItemTitle={'简体中文'} 
              iconColor={Colors.bgColor_0_122_255}
              rightItemTitle={locale == 'zh' ? null : ' '}
              rightImageName={locale == 'zh' && 'md-checkmark'}
              onPress={() => this.switchLanguage('zh')} 
            />
          </ScrollView>
        </View>
      </View>
    )
  }

}
