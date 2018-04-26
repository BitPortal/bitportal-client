import { Navigation } from 'react-native-navigation'

import Welcome  from 'screens/Welcome'
import SideMenu from 'screens/SideMenu'
import Login    from 'screens/Login'
import Market   from 'screens/Market'
import MarketDetails from 'screens/MarketDetails'
import TokenDetails  from 'screens/TokenDetails'
import FundFlow from 'screens/FundFlow'
import Alerts   from 'screens/Alerts'
import Settings from 'screens/Settings' 
import Exchange from 'screens/Exchange'

export const registerScreens = (store, provider) => {
  Navigation.registerComponent('BitPortal.Welcome',  () => Welcome,  store, provider)
  Navigation.registerComponent('BitPortal.SideMenu', () => SideMenu, store, provider)
  Navigation.registerComponent('BitPortal.Login',    () => Login,    store, provider)
  Navigation.registerComponent('BitPortal.Exchange', () => Exchange, store, provider)
  Navigation.registerComponent('BitPortal.Market',   () => Market,   store, provider)
  Navigation.registerComponent('BitPortal.MarketDetails', () => MarketDetails, store, provider)
  Navigation.registerComponent('BitPortal.TokenDetails',  () => TokenDetails,  store, provider)
  Navigation.registerComponent('BitPortal.FundFlow', () => FundFlow, store, provider)
  Navigation.registerComponent('BitPortal.Alerts',   () => Alerts,   store, provider)
  Navigation.registerComponent('BitPortal.Settings', () => Settings, store, provider)
}
