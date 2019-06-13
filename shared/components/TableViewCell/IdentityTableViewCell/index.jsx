import React from 'react'
import { View, Text, TouchableHighlight, Image } from 'react-native'
import { Navigation } from 'react-native-navigation'

const images = {
  addressBook: require('resources/images/addressBookSetting.png'),
  language: require('resources/images/languageSetting.png'),
  currency: require('resources/images/CurrencySetting.png'),
  node: require('resources/images/nodeSetting.png'),
  privacyMode: require('resources/images/privacySetting.png'),
  darkMode: require('resources/images/dark_mode.png'),
  inviteFrends: require('resources/images/inviteSetting.png'),
  helpCenter: require('resources/images/helpCenterSetting.png'),
  aboutUs: require('resources/images/abountUsSetting.png')
}

const IdentityTableViewCell = (props) => {
  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  if (props.data.isSetting) {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 2 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image
            source={images[props.data.type]}
            style={{ width: 29, height: 29, marginRight: 16 }}
          />
          <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: '100%' }}>
            <Text style={{ fontSize: 17, color: 'black' }}>{props.data.text}</Text>
            <Text style={{ fontSize: 17, color: '#8E8E93' }}>{props.data.detail}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image
          source={require('resources/images/Userpic.png')}
          style={{ width: 56, height: 56, marginRight: 16 }}
        />
        <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 22, color: 'black', marginRight: 5, paddingBottom: 4 }}>{props.data.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 15 }}>{props.data.hasIdentity ? formatAddress(props.data.identifier) : props.data.identifier}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default IdentityTableViewCell
