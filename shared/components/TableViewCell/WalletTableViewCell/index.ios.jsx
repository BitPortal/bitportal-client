import React from 'react'
import { View, Text, TouchableHighlight, NativeModules, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import { walletIcons } from 'resources/images'

const WalletTableViewCell = (props) => {
  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  if (props.data.type === 'add') {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 56 }}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{fontSize: 17, color: '#007AFF'}}>{props.data.text}</Text>
        </View>
      </View>
    )
  }

  if (props.data.chain === 'EOS' && !props.data.address) {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <FastImage
            source={walletIcons[props.data.chain.toLowerCase()]}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: 'rgba(0,0,0,0.2)',
              backgroundColor: 'white',
              marginRight: 10
            }}
          />
          <View style={{ flex: 1, height: 44, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 17, color: 'black' }}>{props.data.name}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              {!props.data.syncingEOSAccount && <Text style={{ fontSize: 14, color: '#666666' }}>创建EOS帐户</Text>}
              {!!props.data.syncingEOSAccount && <Text style={{ fontSize: 14, color: '#666666' }}>检测EOS帐户中...</Text>}
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: 40, height: 40, marginRight: 10 }}>
          <FastImage
            source={walletIcons[props.data.chain.toLowerCase()]}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: 'rgba(0,0,0,0.2)',
              backgroundColor: 'white'
            }}
          />
          {props.data.isSelected && <Image source={require('resources/images/active_circle.png')} style={{ width: 16, height: 16, position: 'absolute', left: -4, top: -4, borderRadius: 8, backgroundColor: 'white' }} />}
        </View>
        <View style={{ flex: 1, height: 44, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 17, color: 'black' }}>{props.data.name}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {!!props.data.symbol && <View style={{ marginRight: 5, paddingHorizontal: 4, borderRadius: 4, borderWidth: 1, borderColor: '#666666', aligtnItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={{ fontSize: 10, lineHeight: 14, color: '#666666' }}>{props.data.symbol}</Text>
              {!!props.data.isSegwit && <Text style={{ fontSize: 10, lineHeight: 14, color: '#666666' }}>-SEGWIT</Text>}
            </View>}
            <Text style={{ fontSize: 14, color: '#666666' }}>{this.formatAddress(props.data.address)}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default WalletTableViewCell
