import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

const FeaturedDappCollectionViewCell = (props) => (
  <View style={{
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingBottom: 24
  }}
  >
    <Text style={{ color: '#007AFF', fontSize: 11, height: 13, marginTop: 12 }}>特别推荐</Text>
    <Text style={{ fontSize: 22, height: 26, marginTop: 2 }}>{props.data.title}</Text>
    <Text style={{ color: '#8E8E93', fontSize: 22, height: 26, marginBottom: 6 }}>{props.data.title}</Text>
    <View style={{ width: '100%', height: 214, borderRadius: 6, backgroundColor: '#E5E5EA' }}>
      <FastImage
        source={{ uri: props.data.img }}
        style={{
          flex: 1,
          width: null,
          height: null,
          borderRadius: 4
        }}
      />
    </View>
  </View>
)

export default FeaturedDappCollectionViewCell
