import React from 'react'
import { Image, View, Text, TouchableHighlight } from 'react-native'
// import FastImage from 'react-native-fast-image'
import Colors from 'resources/colors'
import styles from './styles'

export default ({ previewImage, title, author, date, onRowPress }) => (
  <TouchableHighlight underlayColor={Colors.hoverColor} onPress={onRowPress}>
    <View style={styles.rowContainer}>
      <Image style={styles.image} source={{ uri: previewImage }} />
      <View style={styles.right}>
        <Text style={styles.title}>{title}</Text>
        {/* <Text numberOfLines={1} style={styles.subTitle}>{subTitle}</Text> */}
        <View style={styles.infoArea}>
          <Text style={styles.subTitle}>{author}</Text>
          <Text style={styles.subTitle}>{date}</Text>
        </View>
      </View>
    </View>
  </TouchableHighlight>
)
