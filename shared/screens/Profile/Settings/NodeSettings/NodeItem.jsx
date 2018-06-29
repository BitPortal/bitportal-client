import React from 'react'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'
import { Text, View, ScrollView, TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 64,
    backgroundColor: Colors.minorThemeColor
  },
  border: {
    borderBottomColor: Colors.bgColor_000000,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  }
})

export const DefaultItem = ({ item, onPress, active }) => (
  <TouchableHighlight
    underlayColor={Colors.hoverColor}
    style={styles.container}
    onPress={() => onPress(item)}
  >
    <View style={[styles.container, styles.between, styles.border, { paddingHorizontal: 32 }]}>
      <Text style={styles.text16}>{item}</Text>
      {active && <Ionicons name="ios-checkmark" size={36} color={Colors.bgColor_0_122_255} />}
    </View>
  </TouchableHighlight>
)

