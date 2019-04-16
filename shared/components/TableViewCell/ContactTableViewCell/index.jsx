import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import { walletIcons } from 'resources/images'

const ContactTableViewCell = (props) => {
  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <FastImage
          source={require('resources/images/Userpic2.png')}
          style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', marginRight: 16 }}
        />
        <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'center', paddingRight: 16 }}>
            <Text style={{ fontSize: 20, color: 'black', marginRight: 5 }} numberOfLines={1}>{props.data.name}</Text>
            {props.data.description && <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)', paddingTop: 2 }} numberOfLines={1}>{props.data.description}</Text>}
          </View>
          <View style={{ width: 80, height: 60 }}>
            <View
              style={{ backgroundColor: 'white', width: 34, height: 34, borderRadius: 20, position: 'absolute', top: 13, right: 36 }}
            >
              <FastImage
                source={walletIcons['eos']}
                style={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
              />
            </View>
            <View
              style={{ backgroundColor: 'white', width: 34, height: 34, borderRadius: 20, position: 'absolute', top: 13, right: 14 }}
            >
              <FastImage
                source={walletIcons['ethereum']}
                style={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
              />
            </View>
            <View
              style={{ backgroundColor: 'white', width: 34, height: 34, borderRadius: 20, position: 'absolute', top: 13, right: -8 }}
            >
              <FastImage
                source={walletIcons['bitcoin']}
                style={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ContactTableViewCell
