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
            <SettingItem leftItemTitle={'Vote'} onPress={() => {}} extraStyle={{ marginTop: 10 }} />
            <SettingItem leftItemTitle={'Contacts'} onPress={() => {}} />
            <SettingItem leftItemTitle={'Account'} onPress={() => {}} extraStyle={{ marginTop: 10 }} />
            <SettingItem leftItemTitle={'Settings'} onPress={() => {}} />
            <SettingItem leftItemTitle={'About'} onPress={() => {}} />
            <SettingItem leftItemTitle={'Contact Us'} onPress={() => {}} />

            <Text style={[styles.text14, { marginTop: 25 }]}> Version 0.1.0 </Text>
            <Text style={[styles.text14, { marginTop: 5 }]}> Copyright @2018 Patricia.ltd </Text>
          </ScrollView>
        </View>
      </View>
    )
  }

}
