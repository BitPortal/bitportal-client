import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'

export default class BPImage extends Component{
  state = {
    opacity: new Animated.Value(0)
  }

  componentDidMount() {
    Animated.timing(
      this.state.opacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic()
      }
    ).start();
  }

  render() {
    const { ...props } = this.props
    const { opacity } = this.state
    return (
      <Animated.Image style={{ opacity }} {...props} />
    )
  }
}
