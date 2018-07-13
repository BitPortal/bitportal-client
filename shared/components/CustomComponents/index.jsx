import React, { Component } from 'react'
import { Image, Animated, Easing } from 'react-native'

class BPImage extends Component{

  state = {
    defaultIcon: null,
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


export {
  BPImage
}