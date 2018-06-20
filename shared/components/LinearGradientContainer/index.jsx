import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils/dimens'
import LinearGradient from 'react-native-linear-gradient'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  defaultStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default class LinearGradientContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.start = { x: 1.0, y: 0.0 }
    this.end = { x: 0.0, y: 1.0 }
  }

  switchType(type) {
    switch (type) {
      case 'left':
        this.start = { x: 1.0, y: 0.0 }
        this.end = { x: 0.0, y: 0.0 }
        break
      case 'right':
        this.start = { x: 0.0, y: 0.0 }
        this.end = { x: 1.0, y: 0.0 }
        break
      case 'up':
        this.start = { x: 1.0, y: 0.0 }
        this.end = { x: 1.0, y: 1.0 }
        break
      case 'down':
        this.start = { x: 1.0, y: 1.0 }
        this.end = { x: 1.0, y: 0.0 }
        break
      case 'leftUp':
        this.start = { x: 0.0, y: 0.0 }
        this.end = { x: 1.0, y: 1.0 }
        break
      case 'leftDown':
        this.start = { x: 0.0, y: 1.0 }
        this.end = { x: 1.0, y: 0.0 }
        break
      case 'rightUp':
        this.start = { x: 1.0, y: 0.0 }
        this.end = { x: 0.0, y: 1.0 }
        break
      case 'rightDown':
        this.start = { x: 1.0, y: 1.0 }
        this.end = { x: 0.0, y: 0.0 }
        break
      default:
        this.start = { x: 1.0, y: 0.0 }
        this.end = { x: 0.0, y: 1.0 }
    }
  }

  render() {
    const { style, colors, type } = this.props
    this.switchType(type)

    return (
      <LinearGradient
        start={this.start}
        end={this.end}
        locations={[0, 1]}
        colors={colors || Colors.gradientColors}
        style={[styles.defaultStyle, style]}
      >
        {this.props.children}
      </LinearGradient>
    );
  }
}
