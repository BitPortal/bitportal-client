import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

const MarketTableViewCell = props => (
  <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ width: 40, height: 40, marginRight: 10, borderRadius: 20 }}>
        <View style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#B9C1CF' }}>
          <Text style={{ fontWeight: '500', fontSize: 20, color: 'white', paddingLeft: 1.6 }}>{props.data.symbol && props.data.symbol.length ? props.data.symbol.slice(0, 1):''}</Text>
        </View>
        <FastImage
          source={{ uri: `https://cdn.bitportal.io/tokenicon/128/color/${props.data.symbol.toLowerCase()}.png` }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 17, width: 200, marginBottom: 2 }} numberOfLines={1}>{props.data.name}</Text>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ fontSize: 15, color: '#888888', marginRight: 10 }}>{props.data.symbol}</Text>
          {+props.data.change === 0 && <Text style={{ fontSize: 15, color: 'black' }}>0.00%</Text>}
          {+props.data.change !== 0 && (+props.data.change >= 0 ? <Text style={{ fontSize: 15, color: '#4CD964' }}>{`+${props.data.change}%`}</Text> : <Text style={{ fontSize: 15, color: '#FF3B30' }}>{`${props.data.change}%`}</Text>)}
        </View>
      </View>
    </View>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 16 }}>
      <Text style={{ fontSize: 17, color: '#007AFF' }}>{props.data.currency}{props.data.price}</Text>
    </View>
  </View>
)

export default MarketTableViewCell
