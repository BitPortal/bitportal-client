import React, { Component } from 'react'
import RNDialog from 'react-native-dialog'
import { connect } from 'react-redux'
import messages from 'resources/messages'

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

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
    const { locale } = this.props
    return (
      <RNDialog.Container visible={this.props.isVisible}>
        <RNDialog.Title>{messages[locale].pmpt_popup_name || this.props.title}</RNDialog.Title>
        <RNDialog.Description>{this.props.message || ''}</RNDialog.Description>
        <RNDialog.Input autoFocus={true} secureTextEntry={this.props.type === 'secure-text'} onChangeText={this.onChange} />
        <RNDialog.Button label={messages[locale].pmpt_popup_can || this.props.negativeText} onPress={this.props.dismiss} />
        <RNDialog.Button label={messages[locale].pmpt_popup_ent || this.props.positiveText} onPress={this.handleConfirm} />
      </RNDialog.Container>
    )
  }
}
