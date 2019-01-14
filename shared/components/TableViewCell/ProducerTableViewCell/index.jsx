import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

const ProducerTableViewCell = props => (
  <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      {!props.data.isSelected && <View source={require('resources/images/producer.png')} style={{ width: 20, height: 20, marginRight: 10, borderRadius: 10, borderWidth: 1, borderColor: '#C8C7CE' }} />}
      {props.data.isSelected && <FastImage source={require('resources/images/circle_selected.png')} style={{ width: 20, height: 20, marginRight: 10 }} />}
      <View style={{ width: 40, height: 40, marginRight: 10 }}>
        {!props.data.logo && <FastImage source={require('resources/images/producer.png')} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 40, position: 'absolute', top: 0, left: 0 }} />}
        {props.data.logo && <FastImage source={{ uri: `https://storage.googleapis.com/bitportal-cms/bp/${props.data.logo}` }} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 40, position: 'absolute', top: 0, left: 0, borderWidth: 1, borderColor: '#C8C7CE' }} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17 }}>{props.data.teamName || props.data.owner}</Text>
        <Text style={{ fontSize: 15, color: '#888888' }}>@{props.data.owner}</Text>
      </View>
    </View>
  </View>
)

export default ProducerTableViewCell
