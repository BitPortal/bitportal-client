import React from 'react'
import Colors from 'resources/colors'
import { View, Text } from 'react-native'
import { FontScale } from 'utils/dimens'
import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    paddingTop: 20,
    paddingHorizontal: 32,
    backgroundColor: Colors.minorThemeColor,
    marginBottom: -20
  },
  between: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text14: {
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14)
  }
})

export default ({ title, value, unit }) => (
  <View style={[styles.container, styles.between]}>
    <Text style={styles.text14}>{title}</Text>
    <Text style={styles.text14}>
      {value} {unit}
    </Text>
  </View>
)
