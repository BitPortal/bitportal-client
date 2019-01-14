import React from 'react'
import { View, Text, TouchableHighlight, NativeModules } from 'react-native'
import { walletIcons } from 'resources/images'
import FastImage from 'react-native-fast-image'

const ratio = 0.221

const backgroundColors = {
  BITCOIN: 'rgba(255, 204, 0, 1)',
  ETHEREUM: 'rgba(88, 86, 214, 1)',
  EOS: 'black'
}

const MiniWalletCardCollectionViewCell = (props) => {
  formatAddress = (address) => {
    if (address && address.length > 8) {
      return `${address.slice(0, 4)}....${address.slice(-4)}`
    } else {
      return address
    }
  }

  return (
      <View style={{
        width: 60,
        height: 42,
        borderRadius: 4,
        marginRight: 10
      }}
      >
        <FastImage
          source={require('resources/images/MiniCard.png')}
          style={{
            flex: 1,
            width: null,
            height: null,
            borderRadius: 4
          }}
        />
        <View style={{ position: 'absolute', top: 20 * ratio, left: 20 * ratio, right: 10 * ratio, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FastImage
              source={walletIcons[props.data.chain.toLowerCase()]}
              style={{
                width: 40 * ratio,
                height: 40 * ratio,
                borderRadius: 10 * ratio,
                backgroundColor: 'white',
                marginRight: 12 * ratio
              }}
            />
            <View>
              <Text style={{ color: 'white', fontSize: 17 * ratio }}>{props.data.name}</Text>
              {!!props.data.address && <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: props.data.chain === 'EOS' ? 15 * ratio : 13 * ratio, opacity: 0.9, marginRight: 6 * ratio }}>{this.formatAddress(props.data.address)}</Text>
                </View>
              </TouchableHighlight>}
            </View>
          </View>
        </View>
          {props.data.chain === 'EOS' &&
           <View style={{ position: 'absolute', right: 20 * ratio, left: 20 * ratio, bottom: 24 * ratio, flex: 1, alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
             <View style={{ flex: 1, alignItems: 'flex-start' }}>
               <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                 <Text style={{ color: 'white', fontSize: 24 * ratio }}>{props.data.currency}{props.data.totalAsset}</Text>
               </View>
               <Text style={{ color: 'white', fontSize: 15 * ratio, marginTop: 8 * ratio }}>总资产</Text>
             </View>
             <View style={{ alignItems: 'flex-end', height: 74 * ratio, width: 80 * ratio, justifyContent: 'space-between' }}>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between', width: '100%' }}>
                 <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 * ratio }}>CPU</Text>
                 <Text style={{ color: 'white', fontSize: 15 * ratio }}>{props.data.cpu}</Text>
               </View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between', width: '100%' }}>
                 <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 * ratio }}>NET</Text>

                 <Text style={{ color: 'white', fontSize: 15 * ratio }}>{props.data.net}</Text>
               </View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between', width: '100%' }}>
                 <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 * ratio }}>RAM</Text>
                 <Text style={{ color: 'white', fontSize: 15 * ratio }}>{props.data.ram}</Text>
               </View>
             </View>
           </View>}
          {props.data.chain !== 'EOS' &&
           <View style={{ position: 'absolute', right: 20 * ratio, left: 20 * ratio, bottom: 20 * ratio, flex: 1, alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
             <View style={{ flex: 1, alignItems: 'flex-end' }}>
               <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                 <Text style={{ color: 'white', fontSize: 28 * ratio }}>{props.data.currency}{props.data.totalAsset}</Text>
               </View>
               <Text style={{ color: 'white', fontSize: 17 * ratio, marginTop: 8 * ratio }}>总资产</Text>
             </View>
           </View>}
      </View>
  )
}

export default MiniWalletCardCollectionViewCell
