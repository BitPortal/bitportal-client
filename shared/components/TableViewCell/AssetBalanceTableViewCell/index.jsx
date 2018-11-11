import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'

const AssetBalanceTableViewCell = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <FastImage
          source={require('resources/images/BTCLogo.png')}
          style={{ width: 40, height: 40, marginRight: 10, borderRadius: 4 }}
        />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 17 }}>{props.data.symbol}</Text>
          {/* <Text style={{ fontSize: 15, color: '#888888' }}>{props.data.name}</Text> */}
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 16 }}>
        <Text style={{ fontSize: 17, color: '#007AFF' }}>{props.data.balance}</Text>
        <Text style={{ fontSize: 15 }}>≈ {props.data.amount}</Text>
      </View>
    </View>
  )
}

export default AssetBalanceTableViewCell
