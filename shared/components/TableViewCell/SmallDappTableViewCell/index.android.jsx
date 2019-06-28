import React from 'react'
import { View, Text, TouchableHighlight, NativeModules } from 'react-native'
import FastImage from 'react-native-fast-image'

const SmallDappTableViewCell = props => {
  toDapp = () => {
    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'toDapp', url: props.data.url, title: props.data.name, id: props.data.uid })
  }

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingLeft: 16,
      paddingRight: 16
    }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 62, height: 62, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.15)', marginRight: 10, borderRadius: 14, backgroundColor: '#E5E5EA' }}>
          <FastImage
            source={{ uri: props.data.icon }}
            style={{ width: '100%', height: '100%', borderRadius: 14 }}
          />
        </View>
        <View>
          <Text style={{ fontSize: 17, marginBottom: 4 }}>{props.data.name}</Text>
          <Text ellipsizeMode="tail" numberOfLines={2} style={{ color: '#8E8E93', fontSize: 11, width: 180, lineHeight: 13 }}>
            {props.data.description}
          </Text>
        </View>
      </View>
      <View>
        <TouchableHighlight underlayColor="#EFEFF4" style={{ backgroundColor: '#EFEFF4', borderRadius: 28, height: 28, width: 70, padding: 0, alignItems: 'center', justifyContent: 'center' }} onPress={this.toDapp}>
          <Text style={{ color: '#007AFF', margin: 0, padding: 0, fontSize: 13, fontWeight: '500' }}>打开</Text>
        </TouchableHighlight>
      </View>
      {props.data.showSeparator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 88, backgroundColor: '#C8C7CC' }} />}
    </View>
  )
}

export default SmallDappTableViewCell
