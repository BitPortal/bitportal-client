import React from 'react'
import { View, Text, TouchableHighlight, NativeModules } from 'react-native'
import FastImage from 'react-native-fast-image'

const TransactionTableViewCell = (props) => {
  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        {/* <FastImage
            source={require('resources/images/BTCLogo.png')}
            style={{ width: 40, height: 40, marginRight: 10 }}
            /> */}
        <View style={{ flex: 1, height: 44, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 17, marginBottom: 4, color: props.data.isDarkMode ? 'white' : 'black' }}>{this.formatAddress(props.data.targetAddress)}</Text>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {props.data.transactionType === 'send' && !props.data.failed && <FastImage source={require('resources/images/sent.png')} style={{ width: 20, height: 20 }} />}
            {props.data.transactionType === 'receive' && !props.data.failed && <FastImage source={require('resources/images/received.png')} style={{ width: 20, height: 20 }} />}
            {!!props.data.failed && <FastImage source={require('resources/images/Error.png')} style={{ width: 20, height: 20, marginRight: 2 }} />}
            {props.data.transactionType === 'send' && !props.data.failed && !props.data.pending && <Text style={{ fontSize: 15, color: '#888888', lineHeight: 20 }}>发送</Text>}
            {props.data.transactionType === 'receive' && !props.data.failed && !props.data.pending && <Text style={{ fontSize: 15, color: '#888888', lineHeight: 20 }}>接收</Text>}
            {!!props.data.failed && <Text style={{ fontSize: 15, color: '#888888', lineHeight: 20 }}>{gt('转账失败')}</Text>}
            {!!props.data.pending && <Text style={{ fontSize: 15, color: '#888888', lineHeight: 20 }}>{gt('转账中...')}</Text>}
            {!props.data.pending && <Text style={{ fontSize: 15, color: '#888888', lineHeight: 20 }}> {props.data.date} {props.data.time}</Text>}
          </View>
        </View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'flex-end', height: 44 }}>
        {props.data.transactionType === 'send' && <Text style={{ fontSize: 17, color: props.data.isDarkMode ? 'white' : 'black' }}>{props.data.change}</Text>}
        {props.data.transactionType === 'receive' && <Text style={{ fontSize: 17, color: '#4CD964' }}>+{props.data.change}</Text>}
      </View>
      {props.data.showSeparator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />}
    </View>
  )
}

export default TransactionTableViewCell
