import React from 'react'
import { View, Text, Image } from 'react-native'

const SwitchEOSAccountTableViewCell = props => (
  <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17 }}>{props.data.accountName}</Text>
        <Text style={{ fontSize: 15, color: '#888888' }}>{props.data.permissions}</Text>
      </View>
    </View>
  </View>
)

export default SwitchEOSAccountTableViewCell
