import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

const Loading = ({ text, extraModule }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ alignItem: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 20 }}>
      <ActivityIndicator size="small" color="#673AB7" />
      <Text style={{ fontSize: 14, marginLeft: 10, color: 'rgba(0,0,0,0.54)' }}>{text}</Text>
    </View>
    {extraModule}
  </View>
)

export default Loading
