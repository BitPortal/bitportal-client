import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/zh.js'
import { AsyncStorage, StatusBar } from 'react-native'
import { registerScreens } from 'screens'
import { startSingleApp, startTabBasedApp } from 'navigators'
import storage from 'utils/storage'
import { getInitialLang } from 'selectors/intl'
import configure from 'store'
import Provider from 'components/Provider'
import sagas from 'sagas'
import SplashScreen from 'react-native-splash-screen'
import Colors from 'resources/colors'

const runApp = async () => {
  const lang = await storage.getItem('bitportal_lang')
  const store = configure({ intl: getInitialLang(lang) })
  store.runSaga(sagas)
  registerScreens(store, Provider) // this is where you register all of your app's screens

  AsyncStorage.getItem('Welcome', (err, result) => {
    let data = JSON.parse(result)
    if (data && data.isFirst) startTabBasedApp()
    else startSingleApp()

    // hide the splash screens
    SplashScreen.hide()
  })
}

const setStatusBarStyle = async () => {
  const statusBarMode = await storage.getItem('bitprotal_status_bar') || Colors.statusBarMode
  // mode: 'light-content'/'default'
  StatusBar.setHidden(false, 'fade')
  StatusBar.setBarStyle(statusBarMode, true)
}
 
runApp()
setStatusBarStyle()
