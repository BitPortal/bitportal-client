import React from 'react'
import { Button, View, Text, Image, SafeAreaView } from 'react-native'

const NewsTableViewCell = (props) => {
  // console.log('NewsTableViewCell props', props)
  let numberOfLines = 3


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <Image
          source={require('resources/images/coin_logo_default.png')}
          style={{ width: 60, height: 60, marginRight: 12, borderRadius: 10, alignItems: 'center' }}
          defaultSource={require('resources/images/coin_logo_default.png')}
        />

        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          {/*{props.data.tags.map((tag) => {*/}
            {/*console.log('tag', tag)*/}
            {/*return (*/}
              {/*<Text style={{ fontSize: 11, color: '#007AFF' }}>{tag} </Text>*/}
            {/*)*/}
          {/*})}*/}
          <Text style={{ fontSize: 11, color: '#007AFF' }}>{props.data.tags} </Text>
          <Text style={{ fontSize: 17, fontWeight: '400' }} numberOfLines={2}>{props.data.title}</Text>
          {/*<Text style={{ fontSize: 14, marginBottom: 5, color: 'grey' }} numberOfLines={numberOfLines}>{props.data.content}</Text>*/}
          {/*<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', height: 20 }}>*/}
            {/*<Text style={{ fontSize: 14, color: '#888888', marginRight: 10 }}>{props.data.author} </Text>*/}
            {/*<Text style={{ fontSize: 14, color: '#888888' }}>{props.data.createdAt}2019-04-01</Text>*/}
          {/*</View>*/}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default NewsTableViewCell
