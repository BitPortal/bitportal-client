/* @tsx */

import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableHighlight, Image } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'

export default class Setting extends BaseScreen {
  render() {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.headContaner}>
          <Text style={[styles.text20, { marginTop: 18 }]}>
            Settings
          </Text>
          <View style={styles.accountContainer}>
            <Image source={Images.car} style={styles.image} />
            <View style={styles.accountInfo}>
              <Text style={[styles.text20, { color: Colors.textColor_255_255_238 }]}> WaterFallFlow </Text>
              <Text style={[styles.text12, { marginTop: 4 }]}> Current Address </Text>
              <Text style={[styles.text12, { marginTop: 4 }]}> ETH Domain </Text>
            </View>
          </View>
        </View>
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <SettingItem leftItemTitle={'SMS Verify'} onPress={() => {}} />
            <SettingItem leftItemTitle={'Email Verify'} onPress={() => {}} />
            <SettingItem leftItemTitle={'Alerts'} onPress={() => {}} extraStyle={{ marginTop: 10 }} />
            <SettingItem leftItemTitle={'Refresh'} onPress={() => {}} />
            <SettingItem leftItemTitle={'APIs'} onPress={() => {}} />
            <SettingItem leftItemTitle={'About'} onPress={() => {}} extraStyle={{ marginTop: 10 }} />
          </ScrollView>
        </View>
      </View>
    )
  }
}
