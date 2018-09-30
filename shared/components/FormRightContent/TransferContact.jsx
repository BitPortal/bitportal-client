/* eslint-disable */

import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import Colors from 'resources/colors'
import Images from 'resources/images'

const styles =  StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 25,
    paddingVertical: 5,
    marginRight: -25,
  },
  image: {
    width: 22,
    height: 22
  }
})

export default ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <FastImage source={Images.profile_contacts} style={styles.image} />
    </TouchableOpacity>
  )
}
