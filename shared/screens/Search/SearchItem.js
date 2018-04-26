
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { 
  Text,
  View,
  TextInput
} from 'react-native'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'

export default SearchItem = ({ coinName,onChangeText }) => (
  <View style={styles.searchContainer}>
    <Ionicons name="md-search" size={FontScale(22)} color={Colors.textColor_142_142_147} />
    <TextInput
      autoFocus={true}
      autoCorrect={false}
      underlineColorAndroid="transparent"
      style={styles.textInputStyle}
      selectionColor={Colors.textColor_FFFFEE}
      keyboardAppearance={Colors.keyboardTheme}
      placeholder={'Search'}
      placeholderTextColor={'#999999'}
      onChangeText={(text) => {onChangeText(text)}}
      value={coinName}
    />
  </View>
)
