import { Navigation } from 'react-native-navigation'

import Welcome  from 'screens/Welcome'
import SideMenu from 'screens/SideMenu'
import Login    from 'screens/Login'
import Main     from 'screens/Main'
import Market   from 'screens/Market'

export const registerScreens = (store, provider) => {
  Navigation.registerComponent('BitPortal.Welcome',  () => Welcome,  store, provider)
  Navigation.registerComponent('BitPortal.SideMenu', () => SideMenu, store, provider)
  Navigation.registerComponent('BitPortal.Login',    () => Login,    store, provider)
  Navigation.registerComponent('BitPortal.Main',     () => Main,     store, provider)
  Navigation.registerComponent('BitPortal.Market',   () => Market,   store, provider)
}
