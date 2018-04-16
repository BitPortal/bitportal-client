
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { 
  Text,
  View,
  TouchableHighlight
} from 'react-native'
import { FontScale } from 'utils/dimens';
import Colors from 'resources/colors';

export default SearchItem = ({ onPress }) => (
  <TouchableHighlight 
    onPress={() => onPress()}
    style={styles.searchContainer}
  >
    <View style={{justifyContent: 'center', flexDirection: 'row', paddingLeft: 19}}>
      <Ionicons name="md-search" size={FontScale(22)} color={Colors.textColor_142_142_147} />
      <Text style={[styles.text17, {marginLeft: 7}]}> Search </Text>
    </View>
  </TouchableHighlight>
)
