import React from 'react'
import { View, Text, TouchableHighlight, Image, NativeModules } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { walletIcons } from 'resources/images'

const images = {
  keystore: require('resources/images/exportKeystore.png'),
  delete: require('resources/images/Delete.png'),
  privateKey: require('resources/images/exportPrivate.png'),
  mnemonic: require('resources/images/backup.png'),
  addressType: require('resources/images/switchAddressType.png'),
  address: require('resources/images/exportKeystore.png'),
  resources: require('resources/images/resources.png'),
  vote: require('resources/images/vote.png'),
  createAccount: require('resources/images/create_account.png'),
  switchAccount: require('resources/images/switchAddressType.png'),
  chainxDeposit: require('resources/images/switchAddressType.png'),
  chainxVoting: require('resources/images/vote.png'),
  chainxTrustee: require('resources/images/backup.png'),
  chainxScan: require('resources/images/resources.png'),
  chainxStats: require('resources/images/market_tab.png')
}

const WalletManagementTableViewCell = (props) => {
  toEditWallet = () => {
    NativeModules.RNTableViewManager.sendNotification(props.tableViewReactTag, { action: 'toEditWallet', name: props.data.name })
  }

  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  if (props.data.actionType) {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 2 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Image
            source={images[props.data.actionType]}
            style={{ width: 29, height: 29, marginRight: 16 }}
          />
          <Text style={{ fontSize: 17, color: props.data.actionType === 'delete' ? '#FF2D55' : '#000000' }}>{props.data.text}</Text>
        </View>
        <View>
          {props.data.detail && <Text style={{ fontSize: 17, color: '#8E8E93' }}>{props.data.detail}</Text>}
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <View style={{ flex: 1, height: 44, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 17, color: 'black', marginRight: 5, fontWeight: '500' }}>{props.data.name}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {props.data.address && <Text style={{ fontSize: 15 }}>{this.formatAddress(props.data.address)}</Text>}
            {props.data.account && <Text style={{ fontSize: 15 }}>{props.data.account}</Text>}
          </View>
        </View>
      </View>
      <TouchableHighlight onPress={this.toEditWallet} underlayColor="rgba(255,255,255,0)" activeOpacity={0.42}>
        <View style={{ width: 36, height: 36, backgroundColor: '#EFEFF4', borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require('resources/images/Edit.png')}
            style={{ width: 26, height: 26 }}
          />
        </View>
      </TouchableHighlight>
    </View>
  )
}

export default WalletManagementTableViewCell
