import React from 'react'
import { View, Text, TouchableHighlight, NativeModules } from 'react-native'
import FastImage from 'react-native-fast-image'

const AssetOverviewTableViewCell = (props) => {
  toManageWallet = () => {
    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'toManageWallet' })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 16, paddingRight: 16, backgroundColor: '#F7F7F7' }}>
      <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <FastImage
          source={require('resources/images/BTCLogo.png')}
          style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16 }}
        />
        <View style={{ flex: 1, height: 72, justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: '#007AFF', marginBottom: 2 }}>{props.data.balance}</Text>
          <Text style={{ fontSize: 20 }}>≈ {props.data.currency}{props.data.amount}</Text>
        </View>
      </View>
    </View>
  )
}

export default AssetOverviewTableViewCell
