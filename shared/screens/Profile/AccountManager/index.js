/* @tsx */
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import TotalAssetsCard from 'components/TotalAssetsCard'

export default class AccountList extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  deleteAccount = () => {

  }

  resetPassword = () => {

  }

  exportAccount = () => {
    this.props.navigator.push({ screen: 'BitPortal.ExportEntrance' })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          title="EOS-1"
          leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
          rightButton={ <CommonRightButton iconName="ios-trash" onPress={() => this.deleteAccount()} /> }
        />
        <View style={styles.scrollContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
          >
            <TotalAssetsCard totalAssets={425321132.21} accountName={'meon'} disabled={true} />
            <SettingItem leftItemTitle={'Reset Password'} onPress={() => this.resetPassword()} extraStyle={{ marginTop: 10 }} />
            <SettingItem leftItemTitle={'Export'} onPress={() => this.exportAccount()} extraStyle={{ marginTop: 10 }} />
          </ScrollView>
        </View>
      </View>
    )
  }

}
