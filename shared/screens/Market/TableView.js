
import React, { Component } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'
import styles from './styles'
import ListItem from 'screens/Market/ListItem'
import { 
  Text,
  View,
  TouchableHighlight,
  FlatList
} from 'react-native'

export default TableView = ({ data }) => (
  <View style={styles.scrollContainer}>
    <FlatList
      style={styles.list}
      data={data}
      keyExtractor={(item, index) => { 
        item.id = index
        return item.key
      }}
      renderItem={({ item }) => <ListItem data={item} />}
    />
  </View>
)
