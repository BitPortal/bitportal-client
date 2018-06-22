import React from 'react'
import BaseScreen from 'components/BaseScreen'
import Update from './Update'

export default class LightBox extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  render() {
    const { type, ...otherProps } = this.props

    switch (type) {
      case 'update':
        return <Update {...otherProps} />
      default:
        return <Update {...otherProps} />
    }
  }
}
