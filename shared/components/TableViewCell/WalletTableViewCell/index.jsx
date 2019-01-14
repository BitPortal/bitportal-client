import React from 'react'
import { View, Text, TouchableHighlight, NativeModules, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import MiniWalletCardCollectionViewCell from 'components/CollectionViewCell/MiniWalletCardCollectionViewCell'

const colors = {
  BTC: '#FF9500',
  ETH: '#007AFF',
  EOS: '#000000'
}

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
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* <View style={{ width: 40, height: 40, marginRight: 10, backgroundColor: '#EFEFF4', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
              <FastImage
              source={require('resources/images/Add.png')}
              style={{ width: 30, height: 30 }}
              />
              </View> */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, color: '#007AFF' }}>{props.data.text}</Text>
          </View>
        </View>
      </View>
    )
  }

  if (props.data.chain === 'EOS' && !props.data.address) {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MiniWalletCardCollectionViewCell
            data={{
              name: props.data.name,
              chain: props.data.chain,
              address: '',
              currency: "$",
              totalAsset: "0.00",
              cpu: "0.00",
              net: "0.00",
              ram: "0.00"
            }}
          />
          <View style={{ flex: 1, height: 44, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 17, color: 'black' }}>{props.data.name}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#666666' }}>选择或创建EOS帐户</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <MiniWalletCardCollectionViewCell
          data={{
            name: props.data.name,
            chain: props.data.chain,
            address: props.data.address,
            currency: "$",
            totalAsset: props.data.totalAsset,
            cpu: "0.00",
            net: "0.00",
            ram: "0.00"
          }}
        />
        <View style={{ flex: 1, height: 44, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 17, color: 'black' }}>{props.data.name}</Text>
            {props.data.isSelected && <Image
              source={require('resources/images/selected.png')}
              style={{ width: 16, height: 16, marginLeft: 5 }}
            />}
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
