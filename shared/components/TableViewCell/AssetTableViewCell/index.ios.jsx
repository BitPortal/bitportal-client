import React from 'react'
import { View, Text, TouchableHighlight, NativeModules } from 'react-native'
import FastImage from 'react-native-fast-image'

const AssetTableViewCell = props => {
  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }
  const {data} = props || {};
  const {symbol = ''} = data || {};
  const defaultIcon = symbol.length > 0 ? props.data.symbol.slice(0, 1) : '';

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 40, height: 40, marginRight: 10, borderWidth: 0, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white', borderRadius: 20 }}>
          <View style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#B9C1CF' }}>
            <Text style={{ fontWeight: '500', fontSize: 20, color: 'white', paddingLeft: 1.6 }}>{defaultIcon}</Text>
          </View>
          <FastImage
            source={{ uri: props.data.icon_url }}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: props.data.icon_url ? 'white' : 'rgba(0,0,0,0)', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, color: props.data.isDarkMode ? 'white' : 'dark' }}>{props.data.symbol}</Text>
          <Text style={{ fontSize: 15, color: '#666666' }}>{`合约: ${formatAddress(props.data.contract)}`}</Text>
        </View>
      </View>
    </View>
  )
}

export default AssetTableViewCell
