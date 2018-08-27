import { Component } from 'react'
import { Alert } from 'react-native'

export default class AlertModal extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const delay = this.props.delay || 0

    if (
      (nextProps.message !== this.props.message && nextProps.message)
      || (nextProps.subMessage !== this.props.subMessage && nextProps.subMessage)
    ) {
      this.timer = setTimeout(() => {
        Alert.alert(
          nextProps.message,
          nextProps.subMessage,
          [{ text: 'OK', onPress: () => this.props.dismiss() }],
          { cancelable: false }
        )
        clearTimeout(this.timer)
      }, delay)
    }
  }

  render() {
    return null
  }
}
