import React from 'react'
import { View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { chainIcons } from 'resources/images'

const ChainTypeTableViewCell = (props) => {
  return (
    <View style={{ width: '100%', height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FastImage
        source={chainIcons[props.data.chain]}
        style={{
          width: 200,
          height: 60
        }}
        resizeMode={'contain'}
      />
    </View>
  )
}

export default ChainTypeTableViewCell
