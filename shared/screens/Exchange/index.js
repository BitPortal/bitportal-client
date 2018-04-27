
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { 
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { FontScale, NAV_BAR_HEIGHT, SCREEN_HEIGHT } from 'utils/dimens'
import Colors from 'resources/colors'

export default Exchange = ({ onPress, exchangeList, changeExchange }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => onPress()} style={styles.container} />
    <View style={[styles.exchangeListContainer, { marginTop: NAV_BAR_HEIGHT-SCREEN_HEIGHT }]}>
      {exchangeList.map((market, index) => (
        <TouchableOpacity 
          key={index}
          onPress={() => changeExchange(market)}
          style={[styles.btn, { borderBottomWidth: index+1 == exchangeList.length ? 0 : StyleSheet.hairlineWidth }]} 
        >
          <Text style={styles.text16} >{market}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
)
