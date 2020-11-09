import React from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import { assetIcons } from 'resources/images'

const AssetBalanceTableViewCell = props => {

  const {data} = props;
  const {symbol = ''} = data || {}
  const defalutIcon = symbol.length > 0 ? props.data.symbol.slice(0, 1) : '';

  return (
    <View style={{
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 16,
      opacity: props.data.switching ? 0.4 : 1
    }}>
      <View style={{width: '50%', flexDirection: 'row'}}>
        {!!props.data.chain && !props.data.isToken && <FastImage source={assetIcons[props.data.chain.toLowerCase()]} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: props.data.isDarkMode ? 'white' : 'rgba(0,0,0,0)' }}/>}
        {!!props.data.isToken && <View style={{
          width: 40,
          height: 40,
          marginRight: 10,
          borderWidth: 0,
          borderColor: 'rgba(0,0,0,0.2)',
          backgroundColor: 'white',
          borderRadius: 20
        }}>
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#B9C1CF'
          }}>
            <Text style={{
              fontWeight: '500',
              fontSize: 20,
              color: 'white',
              paddingLeft: 1.6
            }}>{defalutIcon}</Text>
          </View>
          <FastImage
            source={{ uri: props.data.icon_url }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: props.data.icon_url ? 'white' : 'rgba(0,0,0,0)',
              borderWidth: 0.5,
              borderColor: 'rgba(0,0,0,0.2)'
            }}
          />
        </View>}
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text ellipsizeMode="tail" numberOfLines={2} style={{ fontSize: 17, color: props.data.isDarkMode ? 'white' : 'black' }}>{`${props.data.symbol}`}</Text>
        </View>
      </View>
      <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 16}}>
        <Text style={{fontSize: 17, color: '#007AFF'}}>{props.data.balance}</Text>
        {!!+props.data.amount && (<Text style={{ fontSize: 15, color: props.data.isDarkMode ? 'white' : 'black' }}>≈ {props.data.currency}{props.data.amount}</Text>)}
      </View>
      {props.data.showSeparator &&
       <View style={{position: 'absolute', height: 0.5, bottom: 0, right: 16, left: 66, backgroundColor: '#C8C7CC'}}/>}
    </View>
  )
}

export default AssetBalanceTableViewCell
