import React from 'react'
import { View, Text, TouchableHighlight, Image } from 'react-native'

const TransactionDetailTableViewCell = (props) => {
  if (props.data.twoColumns) {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
        <View style={{ width: '50%' }}>
          <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 2 }}>{props.data.title1}</Text>
          <Text style={{ fontSize: 20 }}>{props.data.value1}</Text>
        </View>
        <View style={{ width: '50%' }}>
          <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 2 }}>{props.data.title2}</Text>
          <Text style={{ fontSize: 20 }}>{props.data.value2}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
      <View>
        <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 2 }}>{props.data.title1}</Text>
        <Text style={{ fontSize: 20 }}>{props.data.value1}</Text>
      </View>
    </View>
  )
}

export default TransactionDetailTableViewCell
