import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

const WalletCardCollectionViewCell = () => (
  <View style={{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'red',
    minHeight: 1,
    minWidth: 1,
    marginTop: 15
  }}
  >
    <View style={{
      backgroundColor: 'blue',
      width: '100%',
      height: 190,
      borderRadius: 10
    }}
    >
      <FastImage
          source={require('resources/images/BTCCard.png')}
          style={{
            flex: 1,
            width: null,
            height: null,
            borderRadius: 10
          }}
      />
      <View style={{ position: 'absolute', top: 12, left: 12, right: 12, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FastImage
              source={require('resources/images/BTCLogo.png')}
              style={{ width: 40, height: 40, borderRadius: 4, marginRight: 10 }}
          />
          <View>
            <Text style={{ color: 'white', fontSize: 17 }}>BTC-Wallet</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 15, opacity: 0.9, marginRight: 6 }}>terencegehui</Text>
              <FastImage
                  source={require('resources/images/copy.png')}
                  style={{ width: 13, height: 10.5, marginTop: 3 }}
              />
            </View>
          </View>
        </View>
        <FastImage
            source={require('resources/images/circle_more.png')}
            style={{ width: 28, height: 28, borderRadius: 4 }}
        />
      </View>
      <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12, flex: 1, alignItems: 'flex-end' }}>
        <Text style={{ color: 'white', fontSize: 28 }}>$1,900.00</Text>
        <Text style={{ color: 'white', fontSize: 17, marginTop: 8 }}>总资产</Text>
      </View>
    </View>
  </View>
)

export default WalletCardCollectionViewCell
