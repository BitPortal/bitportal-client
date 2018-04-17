
import React, { Component } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'
import styles from './styles'
import { 
  Text,
  View,
  TouchableHighlight,
  FlatList,
  ScrollView
} from 'react-native'

const ListItem = ({ data, itemExtraStyle, onPress }) => (
  <TouchableHighlight 
    onPress={() => onPress(data)}
  >
    <View style={[styles.listItem, { ...itemExtraStyle }]}>
      <View style={styles.coin}>
        <Text style={[styles.text13, {marginHorizontal: 10}]}> 
          {data.id+1}
        </Text>
        <Text style={[styles.text17, {marginHorizontal: 10}]}> 
          {data.key}
        </Text>
      </View>
      <ScrollView>
        
      </ScrollView>
    </View>
  </TouchableHighlight>
)

export default TableView = ({ data, itemExtraStyle, onPress }) => (
  <View style={styles.scrollContainer}>
    <FlatList
      style={styles.list}
      data={data}
      keyExtractor={(item, index) => { 
        item.id = index
        return item.key
      }}
      renderItem={({ item }) => <ListItem data={item} onPress={(e) => onPress(e)} />}
    />
  </View>
)
