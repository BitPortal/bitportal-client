import { AlertIOS, Alert } from 'react-native'
import { goSettingPermission } from 'utils/nativeUtil'
import messages from 'resources/messages'
import { Navigation } from 'react-native-navigation'

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
    text: messages[locale].scan_popup_button_enable,
    onPress: () => goSettingPermission(),
    style: 'default'
  })

  Alert.alert(title, content, buttons)
}

const whiteListAlert = (title, content, locale, componentId) => {
  const buttons = []

  buttons.push({
    text: messages[locale].scan_popup_button_cancel,
    onPress: () => console.log('Cancel Pressed'),
    style: 'cancel'
  })

  buttons.push({
    text: messages[locale].scan_popup_button_enable,
    onPress: () => {
      Navigation.push(componentId, {
        component: {
          name: 'BitPortal.Settings'
        }
      })
    },
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
  whiteListAlert,
  actionPositive,
  actionNegative
}
