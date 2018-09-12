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
        <RNDialog.Title>{messages[locale].general_popup_label_password || this.props.title}</RNDialog.Title>
        <RNDialog.Description>{this.props.message || ''}</RNDialog.Description>
        <RNDialog.Input autoFocus={true} secureTextEntry={this.props.type === 'secure-text'} onChangeText={this.onChange} />
        <RNDialog.Button label={messages[locale].general_popup_button_cancel || this.props.negativeText} onPress={this.props.dismiss} />
        <RNDialog.Button label={messages[locale].general_popup_button_confirm || this.props.positiveText} onPress={this.handleConfirm} />
      </RNDialog.Container>
    )
  }
}
