/* @tsx */

import { Component } from 'react'
import { AlertIOS } from 'react-native'

export default class Prompt extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const delay = this.props.delay || 0
    const type = nextProps.type || 'default'

    if (nextProps.isVisible !== this.props.isVisible && nextProps.isVisible) {
      this.timer = setTimeout(() => {
        AlertIOS.prompt(
          nextProps.title,
          nextProps.message || null,
          [
            {
              text: nextProps.negativeText,
              onPress: () => nextProps.dismiss(),
              style: 'cancel',
            },
            {
              text: nextProps.positiveText,
              onPress: (value) => {
                nextProps.dismiss()
                nextProps.callback(value)
              }
            }
          ],
          type
        )
        clearTimeout(this.timer)
      }, delay)
    }
  }

  render() {
    return null
  }
}
