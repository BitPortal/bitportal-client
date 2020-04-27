import React from 'react'
import { View, Text, NativeModules, TouchableHighlight } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'

const DappHeaderTableViewCell = (props) => {
  toDappList = () => {
    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'toDappList', categoryTitle: props.data.title, category: props.data.category })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
      {props.data.showSeparator && <View style={{ position: 'absolute', height: 0.4, top: 0, right: 16, left: 16, backgroundColor: '#C8C7CC' }} />}
      <Text style={{ fontSize: 20, fontWeight: '500', color: props.data.isDarkMode ? 'white' : 'black' }}>{props.data.title}</Text>
      {props.data.buttonText && <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.toDappList}>
        <Text style={{ fontSize: 15, color: '#007AFF' }}>{props.data.buttonText}</Text>
      </TouchableHighlight>}
    </View>
  )
}

export default DappHeaderTableViewCell
