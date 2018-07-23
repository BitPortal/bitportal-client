

import React, { Component } from 'react'
import RNDialog from 'react-native-dialog'

export default class Prompt extends Component {
  state = {
    value: ''
  }

  handleConfirm = () => {
    this.props.dismiss()
    this.props.callback(this.state.value)
  }

  onChange = (value) => {
    this.setState({ value })
  }

  render() {
    return (
      <RNDialog.Container visible={this.props.isVisible}>
        <RNDialog.Title>{this.props.title}</RNDialog.Title>
        <RNDialog.Description>{this.props.message || ''}</RNDialog.Description>
        <RNDialog.Input autoFocus={true} secureTextEntry={this.props.type === 'secure-text'} onChangeText={this.onChange} />
        <RNDialog.Button label={this.props.negativeText} onPress={this.props.dismiss} />
        <RNDialog.Button label={this.props.positiveText} onPress={this.handleConfirm} />
      </RNDialog.Container>
    )
  }
}
