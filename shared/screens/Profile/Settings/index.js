/* @tsx */

import React, { Component } from 'react'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableHighlight, Switch } from 'react-native'

export default class Setting extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    enableTouchID: false
  }

  switchTouchID = () => {
    this.setState({ enableTouchID: !this.state.enableTouchID })
  }

  changeSettings = (page) => {
    this.props.navigator.push({ screen: `BitPortal.${page}` })
  }

  render() {
    const { enableTouchID } = this.state
    return (
      <View style={styles.container}>
        <NavigationBar 
          title="Settings"
          leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <SettingItem leftItemTitle={'Languages'} onPress={() => this.changeSettings('Languages')} extraStyle={{ marginTop: 10 }} />
            <SettingItem leftItemTitle={'Currencies'} onPress={() => this.changeSettings('Currencies')} />
            <SettingItem leftItemTitle={'Themes'} onPress={() => {}} />
            <View style={[styles.itemContainer, styles.between, { marginTop: 10 }]}>
              <Text style={[styles.text16, { marginLeft: -2 }]}> Touch ID </Text>
              <Switch value={enableTouchID} onValueChange={(e) => this.switchTouchID()} />
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }

}
