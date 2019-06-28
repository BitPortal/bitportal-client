import React from 'react'
import { View, Text, Image } from 'react-native'

const SelectEOSAccountTableViewCell = props => (
  <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      {!props.data.isSelected && !props.data.exist && <View source={require('resources/images/producer.png')} style={{ width: 20, height: 20, marginRight: 10, borderRadius: 10, borderWidth: 1, borderColor: '#C8C7CE' }} />}
      {props.data.isSelected && !props.data.exist && <Image source={require('resources/images/circle_selected.png')} style={{ width: 20, height: 20, marginRight: 10 }} />}
      {!!props.data.exist && <Image source={require('resources/images/circle_selected_grey.png')} style={{ width: 20, height: 20, marginRight: 10 }} />}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17 }}>{props.data.accountName}</Text>
        <Text style={{ fontSize: 15, color: '#888888' }}>{props.data.permissions}</Text>
      </View>
    </View>
    {props.data.exist && <View>
      <Text style={{ color: '#888888' }}>已导入</Text>
    </View>}
  </View>
)

export default SelectEOSAccountTableViewCell
