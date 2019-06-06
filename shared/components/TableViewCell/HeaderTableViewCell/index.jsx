import React from 'react'
import { View, Text, TouchableHighlight, ActivityIndicator } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'

const HeaderTableViewCell = (props) => {
  toAddAsset = () => {
    if (props.data.chain === 'ETHEREUM' || props.data.chain === 'EOS') {
      Navigation.push(props.data.componentId, {
        component: {
          name: 'BitPortal.AddAssets'
        }
      })
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 15, opacity: props.data.switching ? 0.4 : 1 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        {props.data.loading && <ActivityIndicator size="small" color="black" style={{ marginRight: 4 }} />}
        {props.data.loading && <Text style={{ fontSize: 20 }}>{props.data.loadingTitle}</Text>}
        {!props.data.loading && <Text style={{ fontSize: 20 }}>{props.data.title}</Text>}
      </View>
      {props.data.hasRightButton && <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={!props.data.switching ? this.toAddAsset : () => {}}>
        <FastImage
          source={require('resources/images/add_contact.png')}
          style={{ width: 22, height: 22 }}
        />
      </TouchableHighlight>}
    </View>
  )
}

export default HeaderTableViewCell
