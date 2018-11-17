import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

const MarketTableViewCell = props => (
  <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <FastImage
          source={require('resources/images/BTCLogo.png')}
          style={{ width: 40, height: 40, marginRight: 10, borderRadius: 4 }}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 17 }}>{props.data.name}</Text>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ fontSize: 15, color: '#888888', marginRight: 10 }}>{props.data.symbol}</Text>
          {+props.data.change >= 0 ? <Text style={{ fontSize: 15, color: '#4CD964' }}>{`+${(+props.data.change) * 100}%`}</Text> : <Text style={{ fontSize: 15, color: '#FF3B30' }}>{`${(+props.data.change) * 100}%`}</Text>}
        </View>
      </View>
    </View>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 16 }}>
      <Text style={{ fontSize: 17, color: '#007AFF' }}>{props.data.price}</Text>
    </View>
  </View>
)

export default MarketTableViewCell
