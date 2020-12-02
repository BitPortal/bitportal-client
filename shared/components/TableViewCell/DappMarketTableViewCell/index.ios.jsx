import React from 'react'
import { View, Text, NativeModules, TouchableHighlight } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import { walletIcons } from 'resources/images'

const DappMarketTableViewCell = (props) => {
  toDappList = () => {
    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'toDappList', categoryTitle: props.data.title, category: props.data.category })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-start', paddingLeft: 16, paddingRight: 16, backgroundColor: 'white' }}>
      {props.data.showSeparator && <View style={{ position: 'absolute', height: 0, top: 0, right: 16, left: 16, backgroundColor: '#C8C7CC' }} />}
      <Text style={{ fontSize: 17, lineHeight: 36 }}>{gt('switch_market')}</Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.toDappList} style={{ marginLeft: 8 }}>
          <View style={{ borderWidth: 2, borderColor: '#007AFF', borderRadius: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <FastImage
              source={walletIcons['ethereum']}
              style={{ width: 32, height: 32, backgroundColor: 'white', borderRadius: 18, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.toDappList} style={{ marginLeft: 8 }}>
          <View style={{ borderWidth: 2, borderColor: 'rgba(0,0,0,0)', borderRadius: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <FastImage
              source={walletIcons['eos']}
              style={{ width: 32, height: 32, backgroundColor: 'white', borderRadius: 18, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
            />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  )
}

export default DappMarketTableViewCell
