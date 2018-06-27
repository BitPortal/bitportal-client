
import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native'
import Colors from 'resources/colors'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { FormattedNumber } from 'react-intl'
import { SCREEN_HEIGHT, SCREEN_WIDTH, FontScale } from 'utils/dimens'
import Ionicons from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH-64,
    height: 20,
    borderRadius: 3
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  }
})

export default class Progress extends Component {
  render() {
    const { colors, percent, extraStyle } = this.props

    return (
      <View style={[styles.container, { backgroundColor: Colors.mainThemeColor }, {...extraStyle}]}>
        <LinearGradientContainer type="right" colors={colors} style={[styles.container, { alignItems: 'center', width: percent*(SCREEN_WIDTH-64) }]} />
        <Text style={[styles.text12, { marginLeft: percent*(SCREEN_WIDTH-64)-5, marginRight: -25, marginBottom: -35 }]}>
          {parseInt(percent*100)}%
        </Text>
      </View>
    )
  }
}
