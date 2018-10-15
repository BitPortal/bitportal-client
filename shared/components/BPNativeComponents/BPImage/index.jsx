import React, { Component } from 'react'
// import { Image } from 'react-native'
import FastImage from 'react-native-fast-image'

export default class BPImage extends Component{
  render() {
    const { ...props } = this.props
    return (
      <FastImage {...props} />
    )
  }
}
