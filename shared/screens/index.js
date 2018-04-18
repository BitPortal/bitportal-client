import { Navigation } from 'react-native-navigation'

import Welcome  from 'screens/Welcome'
import SideMenu from 'screens/SideMenu'
import Login    from 'screens/Login'
import Search   from 'screens/Search'
import Market   from 'screens/Market'
import MarketDetails from 'screens/MarketDetails'
import TokenDetails  from 'screens/TokenDetails'

export const registerScreens = (store, provider) => {
  Navigation.registerComponent('BitPortal.Welcome',  () => Welcome,  store, provider)
  Navigation.registerComponent('BitPortal.SideMenu', () => SideMenu, store, provider)
  Navigation.registerComponent('BitPortal.Login',    () => Login,    store, provider)
  Navigation.registerComponent('BitPortal.Search',   () => Search,   store, provider)
  Navigation.registerComponent('BitPortal.Market',   () => Market,   store, provider)
  Navigation.registerComponent('BitPortal.MarketDetails', () => MarketDetails, store, provider)
  Navigation.registerComponent('BitPortal.TokenDetails',  () => TokenDetails,  store, provider)
}
