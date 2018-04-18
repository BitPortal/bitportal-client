/* @tsx */

import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableHighlight, Dimensions, Button } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'

const Profile = ({ navigation }) => (
  <TouchableHighlight
    onPress={() => {}}
    style={{ marginTop: 35 }}
  >
    <View
      style={styles.profile}
    >
      <View style={styles.main}>
        <View style={styles.info}>
          <Text style={styles.username} numberOfLines={1}>Terence Ge</Text>
          <Text style={styles.email} numberOfLines={1}>
            Email: terencegehui@yncegehui@yncegehui@yahoo.com
          </Text>
        </View>
      </View>
    </View>
  </TouchableHighlight>
)

export default class Settings extends BaseScreen {
  render() {
    const { navigation } = this.props

    return (
      <View style={styles.container}>
        <ScrollView>
          <Profile navigation={navigation} />
          <Button onPress={() => {}} title="Login" />
        </ScrollView>
      </View>
    )
  }
}
