import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'

const LargeDappCollectionViewCell = (props) => {
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row'
    }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <FastImage
            source={require('resources/images/BTCLogo.png')}
            style={{ width: 74, height: 74, marginRight: 10, borderRadius: 12 }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between', height: 74 }}>
          <View>
            <Text style={{ fontSize: 17, marginBottom: 4 }}>未来之战</Text>
            <Text style={{ color: '#8E8E93', fontSize: 11 }}>角色扮演</Text>
          </View>
          <View>
            <TouchableOpacity style={{ backgroundColor: '#EFEFF4', padding: 10, borderRadius: 28, height: 28, width: 70, padding: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#007AFF', margin: 0, padding: 0, fontSize: 13, fontWeight: 'bold' }}>玩一玩</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {props.data.showSeparator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 84, backgroundColor: '#C8C7CC' }} />}
    </View>
  )
}

export default LargeDappCollectionViewCell
