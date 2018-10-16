/* eslint-disable */

import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import BPImage from 'components/BPNativeComponents/BPImage'
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
      <BPImage source={Images.profile_contacts} style={styles.image} />
    </TouchableOpacity>
  )
}
