
import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { SCREEN_WIDTH, FontScale } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 64,
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
      <View style={[styles.container, { backgroundColor: Colors.mainThemeColor }, { ...extraStyle }]}>
        <LinearGradientContainer type="right" colors={colors} style={[styles.container, { alignItems: 'center', width: percent * (SCREEN_WIDTH - 64) }]} />
        <Text style={[styles.text12, { marginLeft: percent * (SCREEN_WIDTH - 64) - 5, marginRight: -35, marginBottom: -35 }]}>
          {parseInt(percent * 100, 10)}%
        </Text>
      </View>
    )
  }
}
