
import React, { Component } from 'react'
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

const HeaderTitle = ({ }) => (
  <View>
    <View style={[styles.listItem, styles.headerTitle]}>
      <View style={[styles.coin, styles.center, {height: 25}]}>
        <Text style={[styles.text12]}> 
          Code
        </Text>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
        <Text style={[styles.text12, {marginHorizontal: 10}]}> 
          Volume
        </Text>
      </View>
      <View style={{ paddingRight: 15 }}>
        <Text style={[styles.text12]}> 
          Price
        </Text>
      </View>
    </View>
  </View>
)

const ListItem = ({ data, itemExtraStyle, onPress }) => (
  <TouchableHighlight 
    onPress={() => onPress(data)}
  >
    <View style={[styles.listItem, { ...itemExtraStyle }]}>
      <View style={styles.coin}>
        <Text style={[styles.text16, { marginHorizontal: 10, color: Colors.textColor_80_80_80 }]}> 
          {data.id+1}
        </Text>
        <Text style={[styles.text16, {marginHorizontal: 10}]}> 
          {data.key}
        </Text>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
        <Text style={[styles.text16, {marginHorizontal: 10}]}> 
          98,652,431.00
        </Text>
      </View>
      <View style={{ paddingRight: 15 }}>
        <Text style={[styles.text16, { color: Colors.textColor_80_201_109 }]}> 
          $ 8,889.00
        </Text>
      </View>
    </View>
  </TouchableHighlight>
)

export default TableView = ({ data, itemExtraStyle, onPress }) => (
  <View style={styles.scrollContainer}>
    <HeaderTitle />
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
