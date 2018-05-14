/* @tsx */

import React, { Component } from 'react'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableHighlight, Switch } from 'react-native'

export default class Currencies extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    currentCurrency: 'USD'
  }

  switchCurrency = (currency) => {
    this.setState({ currentCurrency: currency })
  }

  render() {
    const { currentCurrency } = this.state
    return (
      <View style={styles.container}>
        <NavigationBar 
          title="Currencies"
          leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <SettingItem 
              leftItemTitle={'CNY'} 
              onPress={() => this.switchCurrency('CNY')} 
              extraStyle={{ marginTop: 10 }} 
              iconColor={Colors.bgColor_0_122_255}
              rightItemTitle={currentCurrency == 'CNY' ? null : ' '}
              rightImageName={currentCurrency == 'CNY' && 'md-checkmark'}
            />
            <SettingItem 
              leftItemTitle={'USD'} 
              iconColor={Colors.bgColor_0_122_255}
              rightItemTitle={currentCurrency == 'USD' ? null : ' '}
              rightImageName={currentCurrency == 'USD' && 'md-checkmark'}
              onPress={() => this.switchCurrency('USD')} 
            />
            
          </ScrollView>
        </View>
      </View>
    )
  }

}
