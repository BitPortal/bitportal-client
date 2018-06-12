import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import styles from './style'
import Colors from 'resources/colors'

function NewsRow ({ previewImage, title, subTitle, author, date, onRowPress }) {
  return (
    <TouchableHighlight underlayColor={Colors.hoverColor} onPress={onRowPress}>
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: previewImage }} />
        <View style={styles.right}>
          <Text style={styles.title}>{title}</Text>
          <Text numberOfLines={1} style={styles.subTitle}>{subTitle}</Text>
          <View style={styles.infoArea}>
            <Text style={styles.subTitle}>{author}</Text>
            <Text style={styles.subTitle}>{date}</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  )
}

export const NewsRowTypes = {
  previewImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onRowPress: PropTypes.func,
}

NewsRow.propTypes = NewsRowTypes

NewsRow.defaultProps = {
  onRowPress: null
}

export default NewsRow
