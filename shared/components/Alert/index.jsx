/* @tsx */

import { Component } from 'react'
import { Alert } from 'react-native'

export default class AlertModal extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== this.props.message && nextProps.message) {
      setTimeout(() => {
        Alert.alert(
          nextProps.message,
          null,
          [
            { text: 'OK', onPress: () => this.props.dismiss() },
          ],
          { cancelable: false }
        )
      }, 500)
    }
  }

  render() {
    return null
  }
}
