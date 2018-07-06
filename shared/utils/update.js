import { Platform, Linking } from 'react-native'
import VersionNumber from 'react-native-version-number'
import { Navigation } from 'react-native-navigation'
import messages from 'screens/LightBox/messages'

const actionNegative = 'actionNegative'
const actionPositive = 'actionPositive'
let timer
const isLast = false

// const showNoUpdate = async () => {
//   await show('当前版本无需更新', '', { negativeText: messages[locale]['prfabtchk_popup_name_confirm'] })
//   clearTimeout(timer)
//   return Navigation.dismissLightBox()
// }

const show = (title = '', content = null, options = {}) => {
  // const overrideBackPress = (!!options.positiveText && !options.negativeText)
  return new Promise((resolve) => {
    timer = setTimeout(() => {
      Navigation.showOverlay({
        component: {
          id: 'BitPortalLightBox',
          name: 'BitPortal.LightBox',
          options: {
            overlay: {
              interceptTouchOutside: true
            }
          },
          // overrideBackPress,
          // tapBackgroundToDismiss: false,
          passProps: {
            type: 'update',
            title,
            content,
            positiveText: options.positiveText || null,
            negativeText: options.negativeText || null,
            onPositive: () => resolve({ action: actionPositive }),
            onNegative: () => resolve({ action: actionNegative })
          }
          // style: Platform.OS === 'ios' ? { backgroundBlur: 'dark' } : { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
        }
      })
    }, Platform.OS === 'ios' ? 500 : 0)
  })
}

const goUpdate = (data) => {
  const url = data.downloadUrl && data.downloadUrl[Platform.OS]
  Linking.canOpenURL(url).then((supported) => {
    if (!supported) {
      console.log(`Can't handle url: ${url}`);
    } else {
      console.log('open', url);
      Linking.openURL(url);
    }
  }).catch(err => console.error('An error occurred', err));
}

const showForceUpdate = async (data, locale) => {
  const content = data.features && data.features[locale]
  const { action } = await show(
    messages[locale].prfabtchk_popup_name_new,
    content,
    {
      positiveText: messages[locale].prfabtchk_popup_name_update
    }
  )
  clearTimeout(timer)
  if (action === actionPositive) {
    return goUpdate(data)
  } else if (action === actionNegative) {
    return Navigation.dismissOverlay('BitPortalLightBox')
  }
}

const showGoToUpdate = async (data, locale) => {
  const content = data.features && data.features[locale]
  const { action } = await show(
    messages[locale].prfabtchk_popup_name_new,
    content,
    {
      negativeText: messages[locale].prfabtchk_popup_name_wait,
      positiveText: messages[locale].prfabtchk_popup_name_update
    }
  )
  clearTimeout(timer)
  if (action === actionPositive) {
    return goUpdate(data)
  } else if (action === actionNegative) {
    return Navigation.dismissOverlay('BitPortalLightBox')
  }
}

const calculate = (VersionNumber) => {
  const versions = VersionNumber.split('.')
  return parseInt((versions[0] * 1000000) + (versions[1] * 1000) + versions[2], 10)
}

const needUpdate = (localVersion, lastVersion) => calculate(lastVersion) > calculate(localVersion)

// const isRequired = (localVersion, minVersion) => calculate(localVersion) >= calculate(minVersion)

export const update = (data, locale) => {
  const localVersion = VersionNumber.appVersion
  const lastVersion = data.lastVersion
  // const minVersion = data.minVersion
  // return alert(`${calculate(lastVersion)}--${calculate(localVersion)}--${calculate(lastVersion) > calculate(localVersion)}`)
  // if (!isRequired(localVersion, minVersion)) return showNoUpdate(locale)
  if (!needUpdate(localVersion, lastVersion)) return true
  if (needUpdate(localVersion, lastVersion) && data.force) return showForceUpdate(data, locale)
  if (needUpdate(localVersion, lastVersion) && !data.force) return showGoToUpdate(data, locale)
  return true
}

export const showIsLast = async (data, locale) => {
  const content = data.features && data.features[locale]
  await show(messages[locale].prfabtchk_popup_name_already, content, { negativeText: messages[locale].prfabtchk_popup_name_confirm })
  clearTimeout(timer)
  Navigation.dismissOverlay('BitPortalLightBox')
}

export const isNewest = () => isLast
