import React from 'react'
import { TouchableOpacity, Text, Image } from 'react-native'
import { styles } from './style'

function NewsBannerCard({ imageUrl, title, subTitle, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
      <Image resizeMode="cover" style={styles.background} source={{ uri: imageUrl }} />
    </TouchableOpacity>
  )
}

export default NewsBannerCard
