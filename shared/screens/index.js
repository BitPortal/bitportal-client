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
import AvailableAssets from 'screens/AvailableAssets'
import AccountCreation from 'screens/Account/AccountCreation'
import AccountImport   from 'screens/Account/AccountImport'
import PasswordSetting from 'screens/Account/PasswordSetting'
import QRCodeScanner   from 'screens/QRCodeScanner'
import AssetsTransfer  from 'screens/AssetsTransfer'
import TransactionRecord from 'screens/TransactionRecord'
import AssetChart from 'screens/AssetChart'
import Discovery from 'screens/Discovery'

export const registerScreens = (store, provider) => {
  Navigation.registerComponent('BitPortal.Welcome',  () => Welcome,  store, provider)
  Navigation.registerComponent('BitPortal.Login',    () => Login,    store, provider)
  Navigation.registerComponent('BitPortal.Market',   () => Market,   store, provider)
  Navigation.registerComponent('BitPortal.FundFlow', () => FundFlow, store, provider)
  Navigation.registerComponent('BitPortal.Alerts',   () => Alerts,   store, provider)
  Navigation.registerComponent('BitPortal.Settings', () => Settings, store, provider)
  Navigation.registerComponent('BitPortal.Assets',   () => Assets,   store, provider)
  Navigation.registerComponent('BitPortal.Discovery',      () => Discovery,      store, provider)
  Navigation.registerComponent('BitPortal.AssetChart',     () => AssetChart,     store, provider)
  Navigation.registerComponent('BitPortal.TokenDetails',   () => TokenDetails,   store, provider)
  Navigation.registerComponent('BitPortal.QRCodeScanner',  () => QRCodeScanner,  store, provider)
  Navigation.registerComponent('BitPortal.AccountImport',  () => AccountImport,  store, provider)
  Navigation.registerComponent('BitPortal.MarketDetails',  () => MarketDetails,  store, provider)
  Navigation.registerComponent('BitPortal.AssetsTransfer', () => AssetsTransfer, store, provider)
  Navigation.registerComponent('BitPortal.PasswordSetting',() => PasswordSetting,store, provider)
  Navigation.registerComponent('BitPortal.AvailableAssets',() => AvailableAssets,store, provider)
  Navigation.registerComponent('BitPortal.AccountCreation',() => AccountCreation,store, provider)
  Navigation.registerComponent('BitPortal.TransactionRecord',() => TransactionRecord, store, provider)
}
