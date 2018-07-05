import React, { Component } from 'react'
import Colors from 'resources/colors'
import { View, Text, StyleSheet } from 'react-native'
import { SCREEN_WDITH, SCREEN_HEIGHT, FontScale } from 'utils/dimens'
import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    paddingTop: 20,
    paddingHorizontal: 32,
    backgroundColor: Colors.bgColor_48_49_59
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

export default ({ title, value }) => (
  <View style={[styles.container, styles.between]}>
    <Text style={styles.text14}>
      {title}
    </Text>
    <Text style={styles.text14}>
      {value} EOS
    </Text>
  </View>
)
