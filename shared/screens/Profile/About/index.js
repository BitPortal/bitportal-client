/* @tsx */
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'

export default class About extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          title="About"
          leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
        />
        <View style={styles.scrollContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }} 
          >
            <View style={styles.content}>
              <Image style={styles.image} source={Images.logo} />
              <Text style={[styles.text18, { marginTop: 10 }]}> BitPortal </Text>
              <Text style={[styles.text12, { marginTop: 10 }]}> Version: 1.0.0 </Text>
              <Text multiline={true} style={[styles.text14, { marginTop: 20 }]}> 
                Join us at the Adobe 99U Conference for inspiring talks, stimulating workshops, and unexpected connections that will supercharge your creative career.
              </Text> 
            </View>
            <SettingItem leftItemTitle={'Terms Of Service'} onPress={() => {}} extraStyle={{ marginTop: 10 }} />
            <SettingItem leftItemTitle={'Update Logs'} onPress={() => {}} />
            <SettingItem leftItemTitle={'Check For Updates'} onPress={() => {}} />
          </ScrollView>
        </View>
      </View>
    )
  }

}
