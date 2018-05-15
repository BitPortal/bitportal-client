/* @tsx */

import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonTitle, CommonRightButton } from 'components/NavigationBar'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class Profile extends BaseScreen {

  checkHistory = () => {
    this.push({ screen: "BitPortal.TransactionHistory" })
  } 

  changePage = (page) => {
    let pageName = ''
    switch (page) {
      case 'Account':
        pageName = 'AccountList'
        break
      case 'Vote':
      case 'About':
      case 'Contacts':
      case 'Settings':
      case 'ContactUs':
        pageName = page
        break
      default:
        return
    }
    this.props.navigator.push({ screen: `BitPortal.${pageName}` })
  }

  render() {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={ <CommonTitle title="Profile" /> }
          rightButton={ <CommonRightButton iconName="md-timer" onPress={() => this.checkHistory()} /> }
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }} >
            {/* <SettingItem leftItemTitle={'Vote'}       onPress={() => this.changePage('Vote')} extraStyle={{ marginTop: 10 }} /> */}
            {/* <SettingItem leftItemTitle={'Contacts'}   onPress={() => this.changePage('Contacts')} /> */}
            <SettingItem leftItemTitle={'Account'}    onPress={() => this.changePage('Account')}  />
            <SettingItem leftItemTitle={'Settings'}   onPress={() => this.changePage('Settings')} extraStyle={{ marginTop: 10 }} />
            <SettingItem leftItemTitle={'About'}      onPress={() => this.changePage('About')} />
            {/* <SettingItem leftItemTitle={'Contact Us'} onPress={() => this.changePage('ContactUs')} /> */}

            <Text style={[styles.text14, { marginTop: 25 }]}> Version 0.1.0 </Text>
            <Text style={[styles.text14, { marginTop: 5 }]}> Copyright @2018 Patricia.ltd </Text>
          </ScrollView>
        </View>
      </View>
    )
  }

}
