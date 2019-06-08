import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import FastImage from 'react-native-fast-image'

const ChainXValidatorDetailTableViewCell = (props) => {
  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  formatBalance = (balance, num = 8) => (parseInt(balance) * Math.pow(10, -8)).toFixed(num).toString()

  if (props.data.actionType) {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 2 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Text style={{ fontSize: 17, color: props.data.actionType === 'delete' ? '#FF2D55' : '#007AFF' }}>{props.data.text}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
      <View>
        <Text style={{ fontSize: 17 }}>{props.data.text}</Text>
      </View>
      <View>
        <Text
          style={{ fontSize: props.data.type === 'sessionKey' ? 15 : 17, textAlign: 'right', maxWidth: 240 }}
        >{props.data.detail}</Text>
      </View>
    </View>
  )
}

export default ChainXValidatorDetailTableViewCell
