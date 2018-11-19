import React, { Component } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  border: {
    minWidth: 100,
    minHeight: 100,
    marginTop: -NAV_BAR_HEIGHT,
    borderRadius: 4,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
  positionStyle: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  backStyle: {
    height: SCREEN_HEIGHT,
    top: NAV_BAR_HEIGHT
  }
})

export default class Loading extends Component {
  render() {
    const { disabledBorder, extraStyle, isVisible, availableBack, text } = this.props
    const borderStyle = disabledBorder ? {} : styles.border
    const bgStyle = availableBack ? {} : styles.backStyle
    if (!isVisible) return null
    return (
      <View style={[styles.container, styles.center, styles.positionStyle, bgStyle, extraStyle]}>
        <View style={styles.positionStyle}>
          <View style={borderStyle}>
            <ActivityIndicator size="small" color="white" />
            {text && <Text style={{ color: 'white', marginTop: 10 }}>{text}</Text>}
          </View>
        </View>
      </View>
    )
  }
}
