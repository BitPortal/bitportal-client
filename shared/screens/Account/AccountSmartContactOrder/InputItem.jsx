import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Colors from 'resources/colors'
import styles from './styles'

export default ({ label, value,  copyLabel, onPress }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.between]}>
      <View style={styles.content}>
        <Text numberOfLines={3} style={[styles.text14, { color: Colors.textColor_white_2 }]}>
          {value}
        </Text>
      </View>
      <TouchableOpacity onPress={onPress} style={styles.copy}>
        <Text style={[styles.text14, { textAlign: 'left', color: Colors.textColor_89_185_226 }]}>
          {copyLabel}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)
