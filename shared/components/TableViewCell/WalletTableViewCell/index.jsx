import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

const WalletTableViewCell = (props) => {
  if (props.data.type === 'add') {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: 40, height: 40, marginRight: 10, backgroundColor: '#EFEFF4', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
            <FastImage
              source={require('resources/images/Add.png')}
              style={{ width: 30, height: 30 }}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, color: '#007AFF' }}>{props.data.text}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <FastImage
          source={require('resources/images/BTCLogo.png')}
          style={{ width: 40, height: 40, marginRight: 10 }}
        />
        <View style={{ flex: 1, height: 44, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 17, color: 'black', marginRight: 5 }}>{props.data.name}</Text>
            <View style={{ width: 18, height: 18, backgroundColor: '#EFEFF4', borderRadius: 4, alignItems: 'center', justifyContent: 'center', padding: 2 }}>
              <FastImage
                source={require('resources/images/arrow_right.png')}
                style={{ width: 6, height: 10.8 }}
              />
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', marginRight: 5, paddingHorizontal: 4, height: 16, borderRadius: 4, borderWidth: 1, borderColor: '#888888', aligtnItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 10, color: '#888888' }}>{props.data.blockchain}</Text>
            </View>
            {props.data.address && <Text style={{ fontSize: 14, color: '#888888' }}>{`${props.data.address.slice(0, 10)}....${props.data.address.slice(-10)}`}</Text>}
            {props.data.account && <Text style={{ fontSize: 14, color: '#888888' }}>{props.data.account}</Text>}
          </View>
        </View>
      </View>
    </View>
  )
}

export default WalletTableViewCell
