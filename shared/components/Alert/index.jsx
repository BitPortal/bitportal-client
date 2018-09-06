import { Component } from 'react'
import { Alert } from 'react-native'
import { connect } from 'react-redux'

import messages from 'resources/messages'

//PROPS: twoButton (设置两个取消，确定按钮的)，onCancel(取消自己的dismiss函数)
@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)
export default class AlertModal extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const delay = this.props.delay || 0

    if (
      (nextProps.message !== this.props.message && nextProps.message)
      || (nextProps.subMessage !== this.props.subMessage && nextProps.subMessage)
    ) {
      if (this.props.twoButton) {
        this.timer = setTimeout(() => {
          Alert.alert(
            nextProps.message,
            nextProps.subMessage,
            [
              {
                text: messages[this.props.locale].cancel,
                onPress: () => this.props.onCancel()
              },
              {
                text: messages[this.props.locale].ok,
                onPress: () => this.props.dismiss()
              }
            ],
            { cancelable: false }
          )
          clearTimeout(this.timer)
        }, delay)
      } else {
        this.timer = setTimeout(() => {
          Alert.alert(
            nextProps.message,
            nextProps.subMessage,
            [
              {
                text: messages[this.props.locale].ok,
                onPress: () => this.props.dismiss()
              }
            ],
            { cancelable: false }
          )
          clearTimeout(this.timer)
        }, delay)
      }
    }
  }

  render() {
    return null
  }
}
