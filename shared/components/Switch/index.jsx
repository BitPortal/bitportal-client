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
    alignItems: 'center',
    height: 50
  },
  itemText: {
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  active: {
    borderBottomWidth: 1,
    borderBottomColor: '#59b9e2'
  },
  activeText: {
    color: '#59b9e2'
  }
})

export default class Switch extends Component {
  render () {
    const { itemList, active, onSwitch } = this.props

    return (
      <View style={styles.container}>
        {itemList.map(item =>
          <TouchableOpacity key={item} style={[styles.item, active === item ? styles.active : {}]} onPress={() => onSwitch(item)}>
            <Text style={[styles.itemText, active === item ? styles.activeText : {}]}>{item}</Text>
          </TouchableOpacity>
         )}
      </View>
    )
  }
}
