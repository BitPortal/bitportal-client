/* @tsx */

import { AlertIOS, Platform } from 'react-native'

const actionNegative = 'actionNegative'
const actionPositive = 'actionPositive'

const prompt = (title='', content=null, options={}) => {

  return new Promise((resolve, reject) => {
    let buttons = []
    let inputType = null
    if (options.negativeText) {
      buttons.push({ text: options.negativeText, onPress: () => {} })
    } 
    if (options.positiveText) {
      inputType = 'secure-text'
      buttons.push({ text: options.positiveText, onPress: (text) => {
          return resolve({ action: actionPositive, text })
        } 
      })
    }
    if (buttons.length == 0) {
      buttons.push({ text: 'ok', onPress: () => {} })
    }
    AlertIOS.prompt(title, content, buttons, inputType)
  })

}


export default {
  prompt,
  actionPositive,
  actionNegative
}