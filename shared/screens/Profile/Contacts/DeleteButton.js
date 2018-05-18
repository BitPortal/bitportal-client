
import React, { Component } from 'react'
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SCREEN_HEIGHT, SCREEN_WIDTH, FontScale } from 'utils/dimens'

const styles = StyleSheet.create({
  btn: {
    width: 100,
    height: 50,
    marginLeft: SCREEN_WIDTH - 100,
    backgroundColor: Colors.bgColor_255_71_64,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default DeleteButton = ({ onPress }) => (
  <TouchableHighlight 
    onPress={() => onPress()}
    style={[ styles.btn, styles.center ]}
    underlayColor={Colors.bgColor_255_71_64} 
  >
    <Ionicons name="ios-trash-outline" size={30} color={Colors.bgColor_FFFFFF} />
  </TouchableHighlight>
)




