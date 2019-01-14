import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'

const LargeDappCollectionViewCell = props => (
  <View style={{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 84, height: 84, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.15)', marginRight: 10, borderRadius: 20, backgroundColor: '#E5E5EA' }}>
        <FastImage
          source={{ uri: props.data.icon }}
          style={{ width: '100%', height: '100%', borderRadius: 18 }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between', height: 84 }}>
        <View>
          <Text style={{ fontSize: 17, marginBottom: 2 }}>{props.data.name}</Text>
          <Text ellipsizeMode="tail" numberOfLines={2} style={{ color: '#8E8E93', fontSize: 11, width: 200, lineHeight: 13, marginBottom: 2 }}>
            {props.data.description}
          </Text>
        </View>
        <View>
          <TouchableOpacity style={{ backgroundColor: '#EFEFF4', borderRadius: 28, height: 28, width: 70, padding: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#007AFF', margin: 0, padding: 0, fontSize: 13, fontWeight: 'bold' }}>打开</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    {props.data.showSeparator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 94, backgroundColor: '#C8C7CC' }} />}
  </View>
)

export default LargeDappCollectionViewCell
