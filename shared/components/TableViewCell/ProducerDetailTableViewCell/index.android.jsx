import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import FastImage from 'react-native-fast-image'

const ProducerDetailTableViewCell = (props) => {
  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

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
        {props.data.type !== 'avatar' && <Text style={{ fontSize: props.data.type === 'identifier' ? 15 : 17, textAlign: 'right', maxWidth: 240 }}>{formatAddress(props.data.detail)}</Text>}
        {props.data.type === 'avatar' &&
         (props.data.logo ? <FastImage source={{ uri: `https://storage.googleapis.com/bitportal-cms/bp/${props.data.logo}` }} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#C8C7CE' }} /> : <FastImage source={require('resources/images/producer.png')} style={{ width: 40, height: 40 }} />)
        }
      </View>
    </View>
  )
}

export default ProducerDetailTableViewCell
