import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'

const SelectContactTableViewCell = (props) => {
  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <FastImage
          source={require('resources/images/Userpic2.png')}
          style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', marginRight: 16 }}
        />
        <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'center', paddingRight: 16 }}>
            <Text style={{ fontSize: 17, color: 'black' }} numberOfLines={1}>{props.data.name}</Text>
            <Text style={{ fontSize: 14, color: '#666666', paddingTop: 2 }} numberOfLines={1}>{formatAddress(props.data.address)}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SelectContactTableViewCell
