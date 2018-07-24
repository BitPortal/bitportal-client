
/* eslint-disable */

import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'

const styles =  StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 25,
    paddingVertical: 5,
    marginRight: -25,
  }
})

export default ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <Ionicons name={"md-contact"} size={22} color={Colors.textColor_FFFFEE} />
    </TouchableOpacity>
  )
}

