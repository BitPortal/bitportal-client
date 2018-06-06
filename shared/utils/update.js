import { Alert, Platform, Linking } from 'react-native'
import VersionNumber from 'react-native-version-number'
import { Navigation } from 'react-native-navigation'

/**
 * {
 *   lastVersion: '1.1.1',
 *   minVersion: '1.0.0',
 *   force: false,
 *   features: {
 *     zh: '',
 *     en: ''
 *   },
 *   downloadUrl: {
 *     ios: '',
 *     android: ''
 *   }
 * } 
 */ 

const actionNegative = 'actionNegative'
const actionPositive = 'actionPositive'
let timer = undefined

const show = (title='', content=null, options={}) => {

  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      Navigation.showLightBox({
        screen: 'BitPortal.LightBox',
        overrideBackPress: true, 
        tapBackgroundToDismiss: false,
        passProps: {
          type: 'update',
          title,
          content,
          positiveText: options.positiveText || null,
          negativeText: options.negativeText || null,
          onPositive: () => { return resolve({ action: actionPositive }) },
          onNegative: () => { return resolve({ action: actionNegative }) }
        },
        style: Platform.OS == 'ios' ? { backgroundBlur: 'dark' } : { backgroundColor: "rgba(0,0,0,0.5)" }
      })
    }, Platform.OS == 'ios' ? 700 : 0)
  })
}

const needUpdate = (localVersion, lastVersion) => calculate(lastVersion) > calculate(localVersion)

const isRequired = (localVersion, minVersion) => calculate(localVersion) >= calculate(minVersion)

const calculate = (VersionNumber) => {
  const versions = VersionNumber.split('.')
  return versions[0]*1000000 + versions[1]*1000 + versions[2]
}

export const update = (data, locale) => {
  
  const localVersion = VersionNumber.appVersion
  const lastVersion = data.lastVersion
  const minVersion = data.minVersion

  // if (!isRequired(localVersion, minVersion)) return showNoUpdate(locale)
  if (!needUpdate(localVersion, lastVersion)) return showIsLast(data, locale)
  if (needUpdate(localVersion, lastVersion) && data.force) return showForceUpdate(data, locale)
  if (needUpdate(localVersion, lastVersion) && !data.force) return showGoToUpdate(data, locale)
  else return showIsLast(data, locale)
}

showNoUpdate = async () => {
  await show('当前版本无需更新', '', { negativeText: '确定' })
  clearTimeout(timer)
}

showIsLast = async (data, locale) => {
  const content = data.features && data.features[locale]
  await show('当前版本已是最新', content, { negativeText: '确定' })
  clearTimeout(timer)
}

showForceUpdate = async (data, locale) => {
  const content = data.features && data.features[locale]
  const { action } = await show('发现新版本', content, { positiveText: '更新' })
  clearTimeout(timer)
  if (action == actionPositive) return goUpdate(data)
  else if (action == actionNegative) return Navigation.dismissLightBox()
}

showGoToUpdate = async (data, locale) => {
  const content = data.features && data.features[locale]
  const { action } = await show('发现新版本', content, { negativeText: '再用用看', positiveText: '更新' })
  clearTimeout(timer)
  if (action == actionPositive) return goUpdate(data)
  else if (action == actionNegative) return Navigation.dismissLightBox()
}

goUpdate = (data) => {
  let url = data.downloadUrl && data.downloadUrl[Platform.OS]
  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      console.log('Can\'t handle url: ' + url);
    } else {
      console.log('open', url);
      Linking.openURL(url);
    }
  }).catch(err => console.error('An error occurred', err));
}