import React from 'react'
import { TouchableOpacity } from 'react-native'
import BPImage from 'components/BPNativeComponents/BPImage'
import styles from './styles'

export default ({ imageUrl, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <BPImage resizeMode="cover" style={styles.background} source={{ uri: imageUrl }} />
  </TouchableOpacity>
)
