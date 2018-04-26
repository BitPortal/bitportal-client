
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { 
  Text,
  View,
  TextInput
} from 'react-native'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'

export default Exchange = ({ value, onChangeText }) => (
  <View style={styles.container}>
    <Ionicons name="md-search" size={FontScale(28)} color={Colors.textColor_142_142_147} />
    <Text style={{ color: Colors.textColor_255_255_238 }}> Test </Text>
  </View>
)
