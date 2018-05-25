/* eslint-disable no-multi-spaces */
import { Navigation } from 'react-native-navigation'

import Market             from 'screens/Market'
import FundFlow           from 'screens/Market/FundFlow'
import TokenDetails       from 'screens/Market/TokenDetails'
import MarketDetails      from 'screens/Market/MarketDetails'

import Alerts             from 'screens/Alerts'
import Welcome            from 'screens/Welcome'
import QRCodeScanner      from 'screens/QRCodeScanner'
import TransactionRecord  from 'screens/TransactionRecord'

import Assets             from 'screens/Assets'
import AssetChart         from 'screens/Assets/AssetChart'
import AssetsTransfer     from 'screens/Assets/AssetsTransfer'
import AvailableAssets    from 'screens/Assets/AvailableAssets'

import Backup             from 'screens/Account/Backup'
import BackupTips         from 'screens/Account/BackupTips'
import AccountImport      from 'screens/Account/AccountImport'
import AccountCreation    from 'screens/Account/AccountCreation'
import EOSAccountCreation    from 'screens/Account/EOSAccountCreation'
import PrivateKeyCreation from 'screens/Account/PrivateKeyCreation'

import Discovery          from 'screens/Discovery'
import ArticleWebView     from 'screens/Discovery/article'
import Markdown           from 'screens/Discovery/markdown'

import Vote               from 'screens/Profile/Vote'
import About              from 'screens/Profile/About'
import Profile            from 'screens/Profile'
import Contacts           from 'screens/Profile/Contacts'
import Settings           from 'screens/Profile/Settings'
import Languages          from 'screens/Profile/Languages'
import Currencies         from 'screens/Profile/Currencies'
import AccountList        from 'screens/Profile/AccountList'
import CreateContact      from 'screens/Profile/CreateContact'
import ResetPassword      from 'screens/Profile/ResetPassword'
import AccountManager     from 'screens/Profile/AccountManager'
import ExportEntrance     from 'screens/Profile/ExportEntrance'
import ExportKeystore     from 'screens/Profile/ExportKeystore'
import ExportPrivateKey   from 'screens/Profile/ExportPrivateKey'
import TransactionHistory from 'screens/Profile/TransactionHistory'

export const registerScreens = (store, provider) => {
  Navigation.registerComponent('BitPortal.Alerts',             () => Alerts,             store, provider)
  Navigation.registerComponent('BitPortal.Welcome',            () => Welcome,            store, provider)
  Navigation.registerComponent('BitPortal.QRCodeScanner',      () => QRCodeScanner,      store, provider)
  Navigation.registerComponent('BitPortal.TransactionRecord',  () => TransactionRecord,  store, provider)

  Navigation.registerComponent('BitPortal.Assets',             () => Assets,             store, provider)
  Navigation.registerComponent('BitPortal.AssetChart',         () => AssetChart,         store, provider)
  Navigation.registerComponent('BitPortal.AssetsTransfer',     () => AssetsTransfer,     store, provider)
  Navigation.registerComponent('BitPortal.AvailableAssets',    () => AvailableAssets,    store, provider)

  Navigation.registerComponent('BitPortal.Market',             () => Market,             store, provider)
  Navigation.registerComponent('BitPortal.FundFlow',           () => FundFlow,           store, provider)
  Navigation.registerComponent('BitPortal.TokenDetails',       () => TokenDetails,       store, provider)
  Navigation.registerComponent('BitPortal.MarketDetails',      () => MarketDetails,      store, provider)

  Navigation.registerComponent('BitPortal.Discovery',          () => Discovery,          store, provider)
  Navigation.registerComponent('BitPortal.DiscoveryArticle',   () => ArticleWebView,     store, provider)
  Navigation.registerComponent('BitPortal.Markdown',           () => Markdown,           store, provider)

  Navigation.registerComponent('BitPortal.Vote',               () => Vote,              store, provider)
  Navigation.registerComponent('BitPortal.About',              () => About,              store, provider)
  Navigation.registerComponent('BitPortal.Profile',            () => Profile,            store, provider)
  Navigation.registerComponent('BitPortal.Contacts',           () => Contacts,           store, provider)
  Navigation.registerComponent('BitPortal.Settings',           () => Settings,           store, provider)
  Navigation.registerComponent('BitPortal.Languages',          () => Languages,          store, provider)
  Navigation.registerComponent('BitPortal.Currencies',         () => Currencies,         store, provider)
  Navigation.registerComponent('BitPortal.AccountList',        () => AccountList,        store, provider)
  Navigation.registerComponent('BitPortal.CreateContact',      () => CreateContact,      store, provider)
  Navigation.registerComponent('BitPortal.ResetPassword',      () => ResetPassword,      store, provider)
  Navigation.registerComponent('BitPortal.AccountManager',     () => AccountManager,     store, provider)
  Navigation.registerComponent('BitPortal.ExportEntrance',     () => ExportEntrance,     store, provider)
  Navigation.registerComponent('BitPortal.ExportKeystore',     () => ExportKeystore,     store, provider)
  Navigation.registerComponent('BitPortal.ExportPrivateKey',   () => ExportPrivateKey,   store, provider)
  Navigation.registerComponent('BitPortal.TransactionHistory', () => TransactionHistory, store, provider)

  Navigation.registerComponent('BitPortal.Backup',             () => Backup,             store, provider)
  Navigation.registerComponent('BitPortal.BackupTips',         () => BackupTips,         store, provider)
  Navigation.registerComponent('BitPortal.AccountImport',      () => AccountImport,      store, provider)
  Navigation.registerComponent('BitPortal.AccountCreation',    () => AccountCreation,    store, provider)
  Navigation.registerComponent('BitPortal.EOSAccountCreation',    () => EOSAccountCreation,    store, provider)
  Navigation.registerComponent('BitPortal.PrivateKeyCreation', () => PrivateKeyCreation, store, provider)
}
