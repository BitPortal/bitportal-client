import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

const Loading = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ marginTop: 80 }}>
      <ActivityIndicator size="small" color="#666666" />
      <Text style={{ marginTop: 10, color: '#666666' }}>加载钱包</Text>
    </View>
  </View>
)

export default Loading
