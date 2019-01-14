import React from 'react'
import { View, Text, TouchableHighlight, Image } from 'react-native'

const IdentityDetailTableViewCell = (props) => {
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
        {props.data.type !== 'avatar' && <Text style={{ fontSize: props.data.type === 'identifier' ? 15 : 17, textAlign: 'right', maxWidth: 240 }}>{props.data.detail}</Text>}
        {props.data.type === 'avatar' &&
         <Image
           source={require('resources/images/Userpic.png')}
           style={{ width: 40, height: 40 }}
         />
        }
      </View>
    </View>
  )
}

export default IdentityDetailTableViewCell
