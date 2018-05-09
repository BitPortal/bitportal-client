
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableHighlight, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FormattedNumber } from 'react-intl'
import { 
  FontScale, 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT, 
  TAB_BAR_HEIGHT 
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 70,
    backgroundColor: Colors.bgColor_48_49_59,
    borderBottomColor: Colors.minorThemeColor,
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
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_181_181_181
  },
  text20: {
    fontSize: FontScale(20),
    color: Colors.textColor_89_185_226
  }
})

export default RecordItem = ({ item, onPress }) => {
  const isReceicer = item.amount > 0
  const iconName = isReceicer ? "ios-arrow-round-down" : "ios-arrow-round-up"
  const diffColor = isReceicer ? Colors.textColor_89_185_226 : Colors.textColor_255_98_92
  return (
    <TouchableHighlight  
      style={styles.container}
      underlayColor={Colors.bgColor_000000}
      onPress={() => onPress()} 
    >
      <View style={[styles.container, styles.between, { paddingHorizontal: 32 }]}>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Ionicons name={iconName} size={50} color={diffColor} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.text14}> Meon </Text>
            <Text style={styles.text12}> 1 day ago </Text>
          </View>
        </View>
        <Text style={[styles.text20, { color: diffColor }]}> 
          { isReceicer ? '+' : '' }
          <FormattedNumber 
            value={item.amount}
            maximumFractionDigits={4}
            minimumFractionDigits={4}
          /> 
        </Text>
      </View>
    </TouchableHighlight>
  )
}





