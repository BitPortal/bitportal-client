import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
// import FastImage from 'react-native-fast-image'
import styles from './styles'

export default ({ imageUrl, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Image resizeMode="cover" style={styles.background} source={{ uri: imageUrl }} />
  </TouchableOpacity>
)
