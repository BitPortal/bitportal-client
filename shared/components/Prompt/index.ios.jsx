import { Component } from 'react'
import { AlertIOS } from 'react-native'
import { connect } from 'react-redux'
import messages from 'resources/messages'

@connect(
  state => ({
    locale: state.intl.locale
  })
)

export default class Prompt extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const delay = this.props.delay || 0
    const type = nextProps.type || 'default'
    const { locale } = this.props

    if (nextProps.isVisible !== this.props.isVisible && nextProps.isVisible) {
      this.timer = setTimeout(() => {
        AlertIOS.prompt(
          nextProps.title || messages[locale].general_popup_label_password,
          nextProps.message || null,
          [
            {
              text: nextProps.negativeText || messages[locale].general_popup_button_cancel,
              onPress: () => nextProps.dismiss(),
              style: 'cancel',
            },
            {
              text: nextProps.positiveText || messages[locale].general_popup_button_confirm,
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
