import React, { Component } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils/dimens'
import Modal from 'react-native-modal'

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  border: {
    width: 100,
    height: 100,
    borderRadius: 4,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default class Loading extends Component {
  render () {
    const { disabledBorder, extraStyle, isVisible, backdropOpacity, text } = this.props
    const borderStyle = disabledBorder ? {} : styles.border

    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={isVisible}
        backdropOpacity={backdropOpacity || 0.3}
      >
        <View style={[styles.container, styles.center, extraStyle]}>
          <View style={borderStyle}>
            <ActivityIndicator size="small" color="white" />
            {text && <Text style={{ color: 'white', marginTop: 10 }}>{text}</Text>}
          </View>
        </View>
      </Modal>
    )
  }
}
