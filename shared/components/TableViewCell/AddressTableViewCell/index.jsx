import React from 'react'
import { View, Text, TouchableOpacity, Image, NativeModules, TouchableHighlight } from 'react-native'
import { Navigation } from 'react-native-navigation'

const AddressTableViewCell = (props) => {
  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  copy = (text) => {
    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'copy', text })
  }

  transfer = () => {
    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'transfer', address: props.data.address, note: props.data.note })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 15, marginBottom: 4 }}>{props.data.label}</Text>
        <TouchableOpacity underlayColor="rgba(0,0,0,0)" onPress={this.copy.bind(this, props.data.address)} activeOpacity={0.7}>
          <Text style={{ fontSize: 15, color: '#007AFF' }} numberOfLines={1}>
            {`${this.formatAddress(props.data.address)} `}
          </Text>
        </TouchableOpacity>
      </View>
      {props.data.note && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'nowrap' }}>
        <Text style={{ fontSize: 15, marginBottom: 4 }}>默认备注</Text>
        <TouchableOpacity underlayColor="rgba(0,0,0,0)" onPress={this.copy.bind(this, props.data.note)} activeOpacity={0.7}>
          <Text style={{ fontSize: 15, color: '#007AFF', paddingRight: 6 }} numberOfLines={1}>
            {`${this.formatAddress(props.data.note)} `}
          </Text>
        </TouchableOpacity>
      </View>}
      <View style={{ marginLeft: 16 }}>
        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={this.transfer} activeOpacity={0.7}>
          <Image
            source={require('resources/images/send.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableHighlight>
      </View>
      {props.data.showSeparator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />}
    </View>
  )
}

export default AddressTableViewCell
