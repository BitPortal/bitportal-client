import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

const FeaturedDappCollectionViewCell = () => (
  <View style={{
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  }}
  >
    <Text style={{ color: '#007AFF', fontSize: 10, marginBottom: 4 }}>特别推荐</Text>
    <Text style={{ fontSize: 20, marginBottom: 4 }}>未来之战</Text>
    <Text style={{ color: '#8E8E93', fontSize: 20, marginBottom: 10 }}>角色扮演</Text>
    <View
        style={{
          width: '100%',
          height: 190,
          borderRadius: 4
        }}
    >
      <FastImage
          source={require('resources/images/Mountain.jpg')}
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
