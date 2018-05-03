import { Navigation } from 'react-native-navigation'

import Welcome  from 'screens/Welcome'
import Login    from 'screens/Login'
import Market   from 'screens/Market'
import MarketDetails from 'screens/MarketDetails'
import TokenDetails  from 'screens/TokenDetails'
import FundFlow from 'screens/FundFlow'
import Alerts   from 'screens/Alerts'
import Settings from 'screens/Settings' 
import Assets   from 'screens/Assets'
import AddAssets from 'screens/AddAssets'

export const registerScreens = (store, provider) => {
  Navigation.registerComponent('BitPortal.Welcome',  () => Welcome,  store, provider)
  Navigation.registerComponent('BitPortal.Login',    () => Login,    store, provider)
  Navigation.registerComponent('BitPortal.Market',   () => Market,   store, provider)
  Navigation.registerComponent('BitPortal.MarketDetails', () => MarketDetails, store, provider)
  Navigation.registerComponent('BitPortal.TokenDetails',  () => TokenDetails,  store, provider)
  Navigation.registerComponent('BitPortal.FundFlow', () => FundFlow, store, provider)
  Navigation.registerComponent('BitPortal.Alerts',   () => Alerts,   store, provider)
  Navigation.registerComponent('BitPortal.Settings', () => Settings, store, provider)
  Navigation.registerComponent('BitPortal.Assets',   () => Assets,   store, provider)
  Navigation.registerComponent('BitPortal.AddAssets',() => AddAssets,store, provider)
}
