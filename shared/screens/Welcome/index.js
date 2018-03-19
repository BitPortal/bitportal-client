/* @tsx */

import React, { Component } from 'react'
import { View, Text } from 'react-native'
import styles from './styles'

export default class Welcome extends Component {

  render() {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.text}>
          Welcome
        </Text>
      </View>
    )
  }
}
