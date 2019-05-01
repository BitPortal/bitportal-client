import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import { dappCategoryIcons } from 'resources/images'

const DappCategoryTableViewCell = props => {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <FastImage
          source={dappCategoryIcons[props.data.category]}
          style={{ width: 40, height: 40, marginRight: 10, borderRadius: 4 }}
        />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 17 }}>{props.data.name}</Text>
        </View>
      </View>
      {props.data.showSeparator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 16, left: 66, backgroundColor: '#C8C7CC' }} />}
    </View>
  )
}

export default DappCategoryTableViewCell
