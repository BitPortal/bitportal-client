import React from 'react'
import { View, Text, TouchableHighlight, ActivityIndicator } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'

const HeaderTableViewCell = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 15, alignItems: 'flex-end' }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 15 }}>{props.data.title}</Text>
      </View>
    </View>
  )
}

export default HeaderTableViewCell
