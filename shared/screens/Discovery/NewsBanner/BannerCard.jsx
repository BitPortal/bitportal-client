import React from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import styles from './styles'

export default ({ imageUrl, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Image resizeMode="cover" style={styles.background} source={{ uri: imageUrl }} />
  </TouchableOpacity>
)
