import React, { Component } from 'react'
import { Platform, TextInput } from 'react-native'

export default class BPTextInput extends Component {
  shouldComponentUpdate(nextProps){
    return Platform.OS !== 'ios' || this.props.value === nextProps.value
  }

  render() {
    return <TextInput {...this.props} />
  }
}
