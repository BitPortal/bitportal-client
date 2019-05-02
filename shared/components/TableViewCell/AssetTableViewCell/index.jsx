import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

const AssetTableViewCell = props => {
  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 40, height: 40, marginRight: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.3)', backgroundColor: 'white', borderRadius: 20 }}>
          <FastImage
            source={{ uri: props.data.icon_url }}
            style={{ width: 39, height: 39, borderRadius: 20 }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17 }}>{props.data.symbol}</Text>
          <Text style={{ fontSize: 15, color: '#666666' }}>{`合约: ${formatAddress(props.data.account)}`}</Text>
        </View>
      </View>
    </View>
  )
}

export default AssetTableViewCell
