import React from 'react'
import { View, Text } from 'react-native'

const ContactDeleteTableViewCell = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 15 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 17, color: '#FF2D55' }}>{props.data.text}</Text>
      </View>
      <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />
      <View style={{ position: 'absolute', height: 0.5, top: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />
    </View>
  )
}

export default ContactDeleteTableViewCell
