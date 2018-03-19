import { Navigation } from 'react-native-navigation'

import Login  from 'screens/Login'
import Main   from 'screens/Main'
import Market from 'screens/Market'

export const registerScreens = () => {
  Navigation.registerComponent('BitPortal.Login',   () => Login)
  Navigation.registerComponent('BitPortal.Main',    () => Main)
  Navigation.registerComponent('BitPortal.Market',  () => Market)
}
