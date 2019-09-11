import React from 'react'
import { View, Text } from 'react-native'

const DappTrendingTableViewCell = props => {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 17, color: '#007AFF' }}>{props.data.title}</Text>
        </View>
      </View>
      {props.data.showSeparator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />}
    </View>
  )
}

export default DappTrendingTableViewCell
