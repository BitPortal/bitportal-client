import React from 'react'
import { View, Text, TouchableHighlight, NativeModules } from 'react-native'
import FastImage from 'react-native-fast-image'

const AssetActionsTableViewCell = (props) => {
  toTransferAsset = () => {
    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'toTransferAsset' })
  }

  toReceiveAsset = () => {
    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'toReceiveAsset' })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, backgroundColor: '#F7F7F7' }}>
      <View style={{ width: '50%', paddingRight: 8 }}>
        <TouchableHighlight underlayColor="#007AFF" style={{ padding: 5 }} activeOpacity={0.7} style={{ backgroundColor: '#007AFF', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center' }} onPress={this.toTransferAsset}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <FastImage
              source={require('resources/images/transfer_white.png')}
              style={{ width: 26, height: 26, marginRight: 8 }}
            />
            <Text style={{ color: 'white', fontSize: 17 }}>转账</Text>
          </View>
        </TouchableHighlight>
      </View>
      <View style={{ width: '50%', paddingLeft: 8 }}>
        <TouchableHighlight underlayColor="#007AFF" style={{ padding: 5 }} activeOpacity={0.7} style={{ backgroundColor: '#007AFF', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center' }} onPress={this.toReceiveAsset}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <FastImage
              source={require('resources/images/receive_white.png')}
              style={{ width: 26, height: 26, marginRight: 8, marginBottom: 3 }}
            />
            <Text style={{ color: 'white', fontSize: 17 }}>收款</Text>
          </View>
        </TouchableHighlight>
      </View>
      <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: '#C8C7CC' }} />
    </View>
  )
}

export default AssetActionsTableViewCell
