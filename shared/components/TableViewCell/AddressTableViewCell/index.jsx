import React from 'react'
import { View, Text, TouchableHighlight, Image } from 'react-native'
import { Navigation } from 'react-native-navigation'

const AddressTableViewCell = (props) => {
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
        <Text style={{ fontSize: 17 }}>
          {`${this.formatAddress(props.data.address)} `}
          <Image
            source={require('resources/images/copy_black.png')}
            style={{ width: 18, height: 18 }}
          />
        </Text>
      </View>
      <View>
        <Image
          source={require('resources/images/send.png')}
          style={{ width: 24, height: 24 }}
        />
      </View>
    </View>
  )
}

export default AddressTableViewCell
