/* @tsx */

import { AlertIOS, Platform } from 'react-native'
import DialogAndroid from 'react-native-dialogs'

const promptIOS = (title='', content=null, options={}) => {
 
  return new Promise((resolve, reject) => {
    let buttons = []
    let inputType = null
    const actionNegative = 'actionNegative'
    const actionPositive = 'actionPositive'
    if (options.negativeText) {
      buttons.push({ text: options.negativeText, onPress: () => {} })
    } 
    if (options.positiveText) {
      inputType = 'secure-text'
      buttons.push({ text: options.positiveText, onPress: (text) => {
          return resolve({ action:actionPositive, text })
        } 
      })
    }
    if (buttons.length == 0) {
      buttons.push({ text: 'ok', onPress: () => {} })
    }
    AlertIOS.prompt(title, content, buttons, inputType)
  })

}

const promptAndroid = async (title='', content=null, options={}) => {
  const { action, text } = await DialogAndroid.prompt(title, content, {
    positiveText: options.positiveText || '',
    negativeText: options.negativeText || '',
    inputType: 2|16
  }) 
  return { action, text }
}

export default {
  prompt: Platform.ios == 'ios' ? promptIOS : promptAndroid,
  actionPositive: 'actionPositive',
  actionNegative: 'actionNegative'
}