import React from 'react'
import { View, Text, TouchableHighlight, NativeModules, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import { walletIcons } from 'resources/images'

const WalletOverviewTableViewCell = (props) => {
  return (
    <View style={{
      width: '100%',
      height: '100%',
      padding: 16,
      paddingBottom: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }}>
      <View style={{
        width: '50%',
        height: '100%',
        paddingRight: 4
      }}>
        <View style={{
          height: '50%',
          width: '100%',
          paddingBottom: 4
        }}>
          <View style={{
            width: '100%',
            height: '100%',
            shadowOffset: { width: 1, height: 1 },
            shadowColor: 'black',
            shadowOpacity: 0.1,
            backgroundColor: 'white',
            borderRadius: 10
          }}>
            <Text>hello</Text>
          </View>
        </View>
        <View style={{
          height: '50%',
          width: '100%',
          paddingTop: 4
        }}>
          <View style={{
            width: '100%',
            height: '100%',
            shadowOffset: { width: 1, height: 1 },
            shadowColor: 'black',
            shadowOpacity: 0.1,
            backgroundColor: 'white',
            borderRadius: 10
          }}>
            <Text>hello</Text>
          </View>
        </View>
      </View>
      <View style={{
        width: '50%',
        height: '100%',
        paddingLeft: 4
      }}>
        <View style={{
          width: '100%',
          height: '100%',
          shadowOffset: { width: 1, height: 1 },
          shadowColor: 'black',
          shadowOpacity: 0.1,
          backgroundColor: 'white',
          borderRadius: 10
        }}>
          <Text>hello</Text>
        </View>
      </View>
    </View>
  )
}

export default WalletOverviewTableViewCell
