/* @tsx */

import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar from 'components/NavigationBar'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class Profile extends BaseScreen {

  checkHistory = () => {

  } 

  changePage = (page) => {
    let pageName = ''
    switch (page) {
      case 'Account':
        pageName = 'AccountManager'
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
          leftButton={
            <View style={[styles.navButton, styles.center]}>
              <Text style={styles.text24}>Profile</Text>
            </View>
          }
          rightButton={
            <TouchableOpacity onPress={() => this.checkHistory()} style={[styles.navButton, styles.center]}>
              <View style={{ marginLeft: 40 }}>
                <Ionicons name="md-timer" size={20} color={Colors.textColor_255_255_238} />
              </View>
            </TouchableOpacity>
          }
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }} >
            <SettingItem leftItemTitle={'Vote'}       onPress={() => this.changePage('Vote')} extraStyle={{ marginTop: 10 }} />
            <SettingItem leftItemTitle={'Contacts'}   onPress={() => this.changePage('Contacts')} />
            <SettingItem leftItemTitle={'Account'}    onPress={() => this.changePage('Account')}  />
            <SettingItem leftItemTitle={'Settings'}   onPress={() => this.changePage('Settings')} extraStyle={{ marginTop: 10 }} />
            <SettingItem leftItemTitle={'About'}      onPress={() => this.changePage('About')} />
            <SettingItem leftItemTitle={'Contact Us'} onPress={() => this.changePage('ContactUs')} />

            <Text style={[styles.text14, { marginTop: 25 }]}> Version 0.1.0 </Text>
            <Text style={[styles.text14, { marginTop: 5 }]}> Copyright @2018 Patricia.ltd </Text>
          </ScrollView>
        </View>
      </View>
    )
  }

}
