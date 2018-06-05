import { Alert, Platform, Linking } from 'react-native'
import VersionNumber from 'react-native-version-number'

/**
 * {
 *   lastVersion: '1.1.1',
 *   requiredVersion: '1.0.0',
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

const alert = (title='', content=null, options={}) => {

  return new Promise((resolve, reject) => {
    let buttons = []
    if (options.negativeText) {
      buttons.push({ text: options.negativeText, onPress: () => {} })
    } 
    if (options.positiveText) {
      buttons.push({ text: options.positiveText, onPress: () => {
          return resolve({ action: actionPositive })
        } 
      })
    }
    if (buttons.length == 0) {
      buttons.push({ text: 'ok', onPress: () => {} })
    }
    Alert.alert(title, content, buttons)
  })

}

const needUpdate = (localVersion, lastVersion) => {
  let localVersionCode = localVersion.split('.') 
  let lastVersionCode  = lastVersion.split('.')
  if (lastVersionCode[0] > localVersionCode[0]) {
    return true
  } else if (lastVersionCode[1] > localVersionCode[1]) {
    return true
  } else if (lastVersionCode[2] > localVersionCode[2]) {
    return true
  } else {
    return false
  }
}

const isRequired = (localVersion, requiredVersion) => {
  let localVersionCode = localVersion.split('.') 
  let requiredVersionCode = requiredVersion.split('.')
  if (localVersionCode[0] > requiredVersionCode[0]) {
    return true
  } else if (localVersionCode[1] > requiredVersionCode[1]) {
    return true
  } else if (localVersionCode[2] > requiredVersionCode[2]) {
    return true
  } else {
    return false
  }
}

export const update = (data, locale) => {
  // console.log('###--73', data, locale)
  const localVersion = VersionNumber.appVersion
  const lastVersion = data.lastVersion || '1.0.0'
  const requiredVersion = data.requiredVersion || '1.0.0'
  if (!isRequired(localVersion, requiredVersion)) return alertNoUpdate(locale)
  if (!needUpdate(localVersion, lastVersion)) return alertIsLast(data, locale)
  if (data.force) return alertForceUpdate(data, locale)
  else return alertGoToUpdate(data, locale)
}

alertNoUpdate = async () => {
  await alert('当前版本无需更新', '', { negativeText: '确定' })
}

alertIsLast = async (data, locale) => {
  const content = data.features && data.features[locale]
  await alert('当前版本已是最新', content, { negativeText: '确定' })
}

alertForceUpdate = async (data, locale) => {
  const content = data.features && data.features[locale]
  const { action } = await alert('发现最新版本', content, { positiveText: '更新' })
  if ( action == actionPositive ) return goUpdate(data)
}

alertGoToUpdate = async (data, locale) => {
  const content = data.features && data.features[locale]
  const { action } = await alert('发现最新版本', content, { negativeText: '再用用看', positiveText: '更新' })
  if ( action == actionPositive ) return goUpdate(data)
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