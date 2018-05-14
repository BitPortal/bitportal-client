/* @tsx */

import React, { Component } from 'react'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableHighlight, Switch } from 'react-native'

export default class Languages extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    currentLanguage: 'EN'
  }

  switchLanguage = (language) => {
    this.setState({ currentLanguage: language })
  }

  render() {
    const { currentLanguage } = this.state
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
              onPress={() => this.switchLanguage('EN')} 
              extraStyle={{ marginTop: 10 }} 
              iconColor={Colors.bgColor_0_122_255}
              rightItemTitle={currentLanguage == 'EN' ? null : ' '}
              rightImageName={currentLanguage == 'EN' && 'md-checkmark'}
            />
            <SettingItem 
              leftItemTitle={'中文'} 
              iconColor={Colors.bgColor_0_122_255}
              rightItemTitle={currentLanguage == 'ZH' ? null : ' '}
              rightImageName={currentLanguage == 'ZH' && 'md-checkmark'}
              onPress={() => this.switchLanguage('ZH')} 
            />
          </ScrollView>
        </View>
      </View>
    )
  }

}
