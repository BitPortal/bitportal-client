import React from 'react'
import { View, Text } from 'react-native'

const ChainXValidatorTableViewCell = (props) => {
  const formatBalance = (balance, num = 8) => (parseInt(balance) * Math.pow(10, -8)).toFixed(num)

  return (
    <View
      style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17 }}>{props.data.name || props.data.account}</Text>
          {props.data.userNomination !== '-' &&  (<Text style={{ fontSize: 15, color: '#888888' }}>已投: {formatBalance(props.data.userNomination, 4)}</Text>)}
          {props.data.userNomination === '-' &&  (<Text style={{ fontSize: 15, color: '#888888' }}>已投: -</Text>)}
            </View>
        <Text style={{ fontSize: 17 }}>{ formatBalance(props.data.totalNomination, 4) }</Text>
      </View>
    </View>)
}

export default ChainXValidatorTableViewCell
