import React, { Component } from 'react'
import { connect } from 'react-redux'
import Update from './Update'

@connect(
  state => ({
    locale: state.intl.locale
  }),
  null,
  null,
  { withRef: true }
)

export default class LightBox extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
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
