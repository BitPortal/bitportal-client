import React from 'react'
import { TouchableOpacity, Text, Image } from 'react-native'
import { styles } from './style'

export default ({ imageUrl, title, subTitle, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subTitle}>{subTitle}</Text>
    <Image resizeMode="cover" style={styles.background} source={{ uri: imageUrl }} />
  </TouchableOpacity>
)
