
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { 
  Text,
  View,
  TouchableHighlight,
  ScrollView
} from 'react-native'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'

export default ListItem = ({ data, style }) => (
  <TouchableHighlight 
    onPress={() => {}}
  >
    <View style={[styles.listItem, { ...style }]}>
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
