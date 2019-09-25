import React from 'react'
import { View, Text, TouchableHighlight, ActivityIndicator } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'

const LoadMoreTableViewCell = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 15 }}>
      {!props.data.loadingMore && <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={() => {}} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 15, color: '#007AFF' }}>Load More</Text>
      </TouchableHighlight>}
      {!!props.data.loadingMore && <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}><ActivityIndicator size="small" color="black" style={{ marginRight: 8 }} /><Text style={{ fontSize: 15 }}>Loading</Text></View>}
    </View>
  )
}

export default LoadMoreTableViewCell
