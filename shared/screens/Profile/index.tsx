/* @tsx */

import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class Profile extends Component<object, object> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          profile
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
})
