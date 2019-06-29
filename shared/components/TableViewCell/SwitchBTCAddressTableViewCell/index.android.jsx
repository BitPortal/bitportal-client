import React from 'react'
import { View, Text } from 'react-native'

const SwitchBTCAddressTableViewCell = props => (
  <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14 }}>{props.data.address}</Text>
        <Text style={{ fontSize: 14, color: '#888888', paddingTop: 4 }}>{`xpub ${props.data.change}/${props.data.index}`}</Text>
      </View>
    </View>
  </View>
)

export default SwitchBTCAddressTableViewCell
