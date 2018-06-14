/* @tsx */

import { AlertIOS, Platform } from 'react-native'

const actionNegative = 'actionNegative'
const actionPositive = 'actionPositive'

const prompt = (title = '', content = null, options = {}) => {
  return new Promise((resolve, reject) => {
    let buttons = []
    let inputType = null

    if (options.negativeText) {
      buttons.push({
        text: options.negativeText || 'cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: options.negativeTextStyle || 'cancel'
      })
    }

    if (options.positiveText) {
      inputType = 'secure-text'
      buttons.push({
        text: options.positiveText || 'OK',
        onPress: (text) => resolve({ action: actionPositive, text }),
        style: options.positiveTextStyle || 'default'
      })
    }

    if (buttons.length == 0) {
      buttons.push({
        text: options.positiveText || 'OK',
        onPress: () => console.log('Ok Pressed'),
        style: options.positiveTextStyle || 'default'
      })
    }

    AlertIOS.prompt(title, content, buttons, inputType)
  })
}

export default {
  prompt,
  actionPositive,
  actionNegative
}
