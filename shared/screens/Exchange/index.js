
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { 
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'

export default Exchange = ({ onPress, onChangeText }) => (
  <TouchableOpacity onPress={() => onPress()} style={styles.container}>
    
  </TouchableOpacity>
)
