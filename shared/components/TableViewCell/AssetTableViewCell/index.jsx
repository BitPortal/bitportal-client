import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

const AssetTableViewCell = props => (
  <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <FastImage
          source={{ uri: props.data.icon_url }}
          style={{ width: 40, height: 40, marginRight: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17 }}>{props.data.symbol}</Text>
        <Text style={{ fontSize: 15, color: '#666666' }}>{props.data.account}</Text>
      </View>
    </View>
  </View>
)

export default AssetTableViewCell
