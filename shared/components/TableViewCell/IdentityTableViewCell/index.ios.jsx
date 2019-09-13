import React from 'react'
import { View, Text, TouchableHighlight, Image } from 'react-native'
import { Navigation } from 'react-native-navigation'

const IdentityTableViewCell = (props) => {
  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 + 56 + 16, paddingRight: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 22, color: 'black', marginRight: 5, paddingBottom: 4 }}>{props.data.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 15 }}>{props.data.hasIdentity ? formatAddress(props.data.identifier) : props.data.identifier}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default IdentityTableViewCell
