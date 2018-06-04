/* @tsx */

import { AlertIOS, Platform } from 'react-native'
import DialogAndroid from 'react-native-dialogs'

const actionNegative = 'actionNegative'
const actionPositive = 'actionPositive'

const promptIOS = (title='', content=null, options={}) => {

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

const promptAndroid = (title='', content=null, options={}) => {

  return new Promise((resolve, reject) => {
    let inputContent = ''
    let dialogsOptions = {
      title,
      content,
      positiveText: options.positiveText || '',
      negativeText: options.negativeText || '',
      input: { 
        type: 128, 
        callback: (value) => {
          inputContent= value
        }
      },
      onPositive: () => { return resolve({ action: actionPositive, text: inputContent }) },
      onNegative: () => {}
    }
    let dialog = new DialogAndroid()
    dialog.set(dialogsOptions)
    dialog.show()
  })
}

export default {
  prompt: Platform.OS == 'ios' ? promptIOS : promptAndroid,
  actionPositive,
  actionNegative
}