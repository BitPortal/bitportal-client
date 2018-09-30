import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  View,
  TextInput
} from 'react-native'
import { FontScale } from 'utils/dimens'
import Colors from 'resources/colors'
import styles from './styles'

const SearchItem = ({ value, onChangeText }) => (
  <View style={styles.searchContainer}>
    <Ionicons name="md-search" size={FontScale(22)} color={Colors.textColor_142_142_147} />
    <TextInput
      autoCorrect={false}
      underlineColorAndroid="transparent"
      style={styles.textInputStyle}
      selectionColor={Colors.textColor_FFFFEE}
      keyboardAppearance={Colors.keyboardTheme}
      placeholder="Search"
      placeholderTextColor="#999999"
      onChangeText={text => onChangeText(text)}
      value={value}
    />
  </View>
)

export default SearchItem
