import React from 'react'
import { View, Text } from 'react-native'

const ChainXValidatorTableViewCell = (props) => (
  <View
    style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}
  >
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1}}>
        <Text style={{ fontSize: 17 }}>{props.data.name || props.data.account }</Text>
        {props.data.userNomination !== '-' && (
          <Text style={{ fontSize: 15, color: '#888888' }}>已投: { props.data.userNominationStr } </Text>)}
        {props.data.userNomination !== '-' && (
          <Text style={{ fontSize: 15, color: '#888888' }}>待领：{ props.data.pendingInterestStr } </Text>)}
        {props.data.userNomination === '-' && (<Text style={{fontSize: 15, color: '#888888'}}>已投: -</Text>)}
      </View>
      <Text style={{ fontSize: 17 }}>{ props.data.totalNominationStr }</Text>
    </View>
  </View>)


export default ChainXValidatorTableViewCell
