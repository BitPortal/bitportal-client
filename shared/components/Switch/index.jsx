import React, { Component } from 'react'
import Colors from 'resources/colors'
import { View, Text, TouchableOpacity } from 'react-native'
import { SCREEN_WDITH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'
import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#202126',
    flex: 1,
    flexDirection: 'row',
    marginTop: 10
  },
  item: {
    width: '50%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    color: 'white'
  }
})

export default class Switch extends Component {
  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Buy</Text></TouchableOpacity>
        <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Sell</Text></TouchableOpacity>
      </View>
    )
  }
}
