import React from 'react'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import styles from './styles'

export default ({ imageUrl, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <FastImage resizeMode="cover" style={styles.background} source={{ uri: imageUrl }} />
  </TouchableOpacity>
)
