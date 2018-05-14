/* @tsx */
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'

export default class AccountList extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  createNewAccount = () => {
    this.props.navigator.push({ screen: 'BitPortal.AccountCreation' })
  }
  
  importAccount = () => {

  }

  checkAsset = () => {
    
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          title="EOS-1"
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.goBack()} />}
          rightButtom={
            <View />
          }
        />
        <View style={styles.scrollContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
          >
          </ScrollView>
        </View>
      </View>
    )
  }

}
