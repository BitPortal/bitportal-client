import { AlertIOS, Alert, NativeModules } from 'react-native'
import messages from 'resources/messages'

const nativeUtils = NativeModules.NativeUtils
const actionNegative = 'actionNegative'
const actionPositive = 'actionPositive'

const alert = (title = '', content = null, options = {}) => new Promise((resolve) => {
  const buttons = []

  if (options.negativeText) {
    buttons.push({
      text: options.negativeText || 'cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: options.negativeTextStyle || 'cancel'
    })
  }

  if (options.positiveText) {
    buttons.push({
      text: options.positiveText || 'OK',
      onPress: text => resolve({ action: actionPositive, text }),
      style: options.positiveTextStyle || 'default'
    })
  }

  if (buttons.length === 0) {
    buttons.push({
      text: options.positiveText || 'OK',
      onPress: () => console.log('Ok Pressed'),
      style: options.positiveTextStyle || 'default'
    })
  }

  Alert.alert(title, content, buttons)
})

const permissionAlert = (title, content, locale) => {
  const buttons = []

  buttons.push({
    text: messages[locale].scan_popup_button_cancel,
    onPress: () => console.log('Cancel Pressed'),
    style: 'cancel'
  })

  buttons.push({
    text: messages[locale].scan_popup_button_setting,
    onPress: () => nativeUtils.goSettingPermission(),
    style: 'default'
  })

  Alert.alert(title, content, buttons)
}

const prompt = (title = '', content = null, options = {}) => new Promise((resolve) => {
  const buttons = []
  let inputType = null

  if (options.negativeText) {
    buttons.push({
      text: options.negativeText || 'cancel',
      onPress: () => resolve({ action: actionNegative }),
      style: options.negativeTextStyle || 'cancel'
    })
  }

  if (options.positiveText) {
    inputType = options.disableSecureText ? options.disableSecureText : 'secure-text'
    buttons.push({
      text: options.positiveText || 'OK',
      onPress: text => resolve({ action: actionPositive, text }),
      style: options.positiveTextStyle || 'default'
    })
  }

  if (buttons.length === 0) {
    buttons.push({
      text: options.positiveText || 'OK',
      onPress: resolve({ action: actionNegative }),
      style: options.positiveTextStyle || 'default'
    })
  }

  AlertIOS.prompt(title, content, buttons, inputType)
})

export default {
  alert,
  prompt,
  permissionAlert,
  actionPositive,
  actionNegative
}
