import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import { assetIcons } from 'resources/images'

const AssetBalanceTableViewCell = props => (
  <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, opacity: props.data.switching ? 0.4 : 1 }}>
    <View style={{ width: '60%', flexDirection: 'row' }}>
      {!!props.data.chain && !props.data.icon_url && <FastImage source={assetIcons[props.data.chain.toLowerCase()]} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }} />}
      {!!props.data.icon_url && <FastImage source={{ uri: props.data.icon_url }} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }} />}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 17 }}>{`${props.data.name} (${props.data.symbol})`}</Text>
        {/* <Text style={{ fontSize: 15, color: '#888888' }}>{props.data.name}</Text> */}
      </View>
    </View>
    <View style={{ width: '40%', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 16 }}>
      <Text style={{ fontSize: 17, color: '#007AFF' }}>{props.data.balance}</Text>
      <Text style={{ fontSize: 15 }}>≈ {props.data.currency}{props.data.amount}</Text>
    </View>
    {props.data.showSeparator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 16, left: 66, backgroundColor: '#C8C7CC' }} />}
  </View>
)

export default AssetBalanceTableViewCell
