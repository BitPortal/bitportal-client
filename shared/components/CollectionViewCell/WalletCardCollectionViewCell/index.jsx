import React from 'react'
import { View, Text, TouchableHighlight, NativeModules, Image } from 'react-native'
import { walletIcons } from 'resources/images'

const backgroundColors = {
  BITCOIN: 'rgba(255, 204, 0, 1)',
  ETHEREUM: 'rgba(88, 86, 214, 1)',
  EOS: 'black'
}

const WalletCardCollectionViewCell = (props) => {
  toManageWallet = () => {
    const walletInfo = {
      id: props.data.uid,
      type: props.data.type,
      name: props.data.name,
      address: props.data.address,
      chain: props.data.chain,
      symbol: props.data.symbol,
      segWit: props.data.segWit,
      source: props.data.source
    }

    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'toManageWallet', walletInfo })
  }

  copy = () => {
    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'copy', text: props.data.address })
  }

  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  return (
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
        width: '100%',
        height: 190,
        borderRadius: 10,
        // backgroundColor: backgroundColors[props.data.chain]
      }}
      >
        <Image
          source={require('resources/images/BTCCard.png')}
          style={{
            flex: 1,
            width: null,
            height: null,
            borderRadius: 10
          }}
        />
        <View style={{ position: 'absolute', top: 12, left: 12, right: 4, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
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
            <View>
              <Text style={{ color: 'white', fontSize: 17 }}>{props.data.name}</Text>
              {!!props.data.address && <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: props.data.chain === 'EOS' ? 15 : 13, opacity: 0.9, marginRight: 6 }}>{this.formatAddress(props.data.address)}</Text>
                  <Image
                    source={require('resources/images/copy.png')}
                    style={{ width: 13, height: 10.5, marginTop: 3 }}
                  />
                </View>
              </TouchableHighlight>}
            </View>
          </View>
          <TouchableHighlight onPress={this.toManageWallet} underlayColor="rgba(255,255,255,0)" style={{ padding: 8, borderRadius: 22 }} activeOpacity={0.42}>
            <Image
              source={require('resources/images/circle_more.png')}
              style={{ width: 28, height: 28, borderRadius: 4 }}
            />
          </TouchableHighlight>
        </View>
          {/* <View style={{ height: 36, width: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.145)', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Image
              source={require('resources/images/transfer.png')}
              style={{ width: 26, height: 26 }}
              />
              </View> */}
          {props.data.chain === 'EOS' &&
           <View style={{ position: 'absolute', right: 12, left: 12, bottom: 16, flex: 1, alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
             <View style={{ flex: 1, alignItems: 'flex-start' }}>
               <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                 <Text style={{ color: 'white', fontSize: 20, marginRight: 1, marginBottom: 1, marginTop: 1 }}>{props.data.currency}</Text>
                 <Text style={{ color: 'white', fontSize: 24 }}>{props.data.totalAsset.split('.')[0]}.</Text>
                 <Text style={{ color: 'white', fontSize: 20, marginBottom: 1, marginTop: 1 }}>{props.data.totalAsset.split('.')[1]}</Text>
               </View>
               <Text style={{ color: 'white', fontSize: 15, marginTop: 8 }}>总资产</Text>
             </View>
             <View style={{ alignItems: 'flex-end', height: 74, width: 110, justifyContent: 'space-between' }}>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between', width: '100%' }}>
                 <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>CPU</Text>
                 <Text style={{ color: 'white', fontSize: 15 }}>{props.data.cpu}</Text>
               </View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between', width: '100%' }}>
                 <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>NET</Text>

                 <Text style={{ color: 'white', fontSize: 15 }}>{props.data.net}</Text>
               </View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between', width: '100%' }}>
                 <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>RAM</Text>
                 <Text style={{ color: 'white', fontSize: 15 }}>{props.data.ram}</Text>
               </View>
             </View>
           </View>}
          {props.data.chain !== 'EOS' &&
           <View style={{ position: 'absolute', right: 12, left: 12, bottom: 12, flex: 1, alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
             <View style={{ flex: 1, alignItems: 'flex-end' }}>
               <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                 <Text style={{ color: 'white', fontSize: 22, marginRight: 2, marginBottom: 1, marginTop: 2 }}>{props.data.currency}</Text>
                 <Text style={{ color: 'white', fontSize: 28 }}>{props.data.totalAsset.split('.')[0]}.</Text>
                 <Text style={{ color: 'white', fontSize: 24, marginBottom: 1, marginTop: 1 }}>{props.data.totalAsset.split('.')[1]}</Text>
               </View>
               <Text style={{ color: 'white', fontSize: 17, marginTop: 8 }}>总资产</Text>
             </View>
           </View>}
      </View>
    </View>
  )
}

export default WalletCardCollectionViewCell
