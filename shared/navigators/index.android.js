import { AppRegistry, StatusBar } from 'react-native'
import { Navigation } from 'components/Navigation'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import Provider, { PersistProvider } from 'components/Provider'

import Root from 'screens/Root'
import Wallet from 'screens/Wallet'
import Asset from 'screens/Wallet/Asset'
import Market from 'screens/Market'
import Discovery from 'screens/Discovery'
import SearchMarket from 'screens/Market/SearchMarket'
import Profile from 'screens/Profile'
import Settings from 'screens/Profile/Settings'
import LanguageSetting from 'screens/Profile/LanguageSetting'
import CurrencySetting from 'screens/Profile/CurrencySetting'
import Contacts from 'screens/Profile/Contacts'
import Contact from 'screens/Profile/Contact'
import EditContact from 'screens/Profile/EditContact'
import AddIdentity from 'screens/Wallet/AddIdentity'
import RecoverIdentity from 'screens/Wallet/RecoverIdentity'
import CreateIdentity from 'screens/Wallet/CreateIdentity'
import ImportBTCWallet from 'screens/Wallet/ImportBTCWallet'
import ImportETHWallet from 'screens/Wallet/ImportETHWallet'
import ImportRioChainWallet from 'screens/Wallet/ImportRioChainWallet'
import ImportEOSWallet from 'screens/Wallet/ImportEOSWallet'
import ImportChainxWallet from 'screens/Wallet/ImportChainxWallet'
import WalletList from 'screens/Wallet/WalletList'
import SelectBridgeWallet from 'screens/Wallet/SelectBridgeWallet'
import SelectChainType from 'screens/Wallet/SelectChainType'
import ManageWallet from 'screens/Wallet/ManageWallet'
import SwitchBTCAddress from 'screens/Wallet/SwitchBTCAddress'
import BackupIdentity from 'screens/Wallet/BackupIdentity'
import MyIdentity from 'screens/Wallet/MyIdentity'
import ExportBTCPrivateKey from 'screens/Wallet/ExportBTCPrivateKey'
import ExportETHPrivateKey from 'screens/Wallet/ExportETHPrivateKey'
import ExportETHKeystore from 'screens/Wallet/ExportETHKeystore'
import ExportRioChainKeystore from 'screen/Wallet/ExportRioChainKeystore'
import ExportPCXPrivateKey from 'screens/Wallet/ExportPCXPrivateKey'
import ExportEOSPrivateKey from 'screens/Wallet/ExportEOSPrivateKey'
import SelectEOSAccount from 'screens/Wallet/SelectEOSAccount'
import ManageEOSResource from 'screens/Wallet/ManageEOSResource'
import CreateEOSAccount from 'screens/Wallet/CreateEOSAccount'
import SwitchEOSAccount from 'screens/Wallet/SwitchEOSAccount'
import Voting from 'screens/Wallet/Voting'
import ProducerDetail from 'screens/Wallet/ProducerDetail'
import ReceiveAsset from 'screens/Wallet/ReceiveAsset'
import TransactionDetail from 'screens/Wallet/TransactionDetail'
import AddAssets from 'screens/Wallet/AddAssets'
import TransferAsset from 'screens/Wallet/TransferAsset'
import Camera from 'screens/Camera'
import WebView from 'screens/WebView'
import WebViewBridge from 'screens/WebViewBridge'
import AboutUs from 'screens/Profile/AboutUs'

import messages from 'resources/messages'

export const registerScreens = (store) => {
  Navigation.registerComponentWithRedux('BitPortal.Root', () => Root, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Wallet', () => Wallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Asset', () => Asset, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Market', () => Market, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SearchMarket', () => SearchMarket, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ManageWallet', () => ManageWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ImportBTCWallet', () => ImportBTCWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ImportETHWallet', () => ImportETHWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ImportRioChainWallet', () => ImportRioChainWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ImportEOSWallet', () => ImportEOSWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ImportChainxWallet', () => ImportChainxWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Profile', () => Profile, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Settings', () => Settings, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.LanguageSetting', () => LanguageSetting, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.CurrencySetting', () => CurrencySetting, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Contacts', () => Contacts, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Contact', () => Contact, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.EditContact', () => EditContact, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AddIdentity', () => AddIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.RecoverIdentity', () => RecoverIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.CreateIdentity', () => CreateIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.WalletList', () => WalletList, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SelectBridgeWallet', () => SelectBridgeWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SelectChainType', () => SelectChainType, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SwitchBTCAddress', () => SwitchBTCAddress, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.BackupIdentity', () => BackupIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.MyIdentity', () => MyIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportBTCPrivateKey', () => ExportBTCPrivateKey, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportETHPrivateKey', () => ExportETHPrivateKey, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportETHKeystore', () => ExportETHKeystore, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportRioChainKeystore', () => ExportRioChainKeystore, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportEOSPrivateKey', () => ExportEOSPrivateKey, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportPCXPrivateKey', () => ExportPCXPrivateKey, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SelectEOSAccount', () => SelectEOSAccount, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ManageEOSResource', () => ManageEOSResource, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.CreateEOSAccount', () => CreateEOSAccount, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SwitchEOSAccount', () => SwitchEOSAccount, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Voting', () => Voting, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ProducerDetail', () => ProducerDetail, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ReceiveAsset', () => ReceiveAsset, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.TransactionDetail', () => TransactionDetail, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AddAssets', () => AddAssets, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.TransferAsset', () => TransferAsset, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Camera', () => Camera, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.WebView', () => WebView, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.WebViewBridge', () => WebViewBridge, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Discovery', () => Discovery, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AboutUs', () => AboutUs, Provider, store)
}

export const setDefaultOptions = () => {
  Navigation.setDefaultOptions({
    statusBar: {
      visible: true
    },
    topBar: {
      background: {
        translucent: true,
        drawBehind: false,
        color: '#673AB7'
      },
      noBorder: false,
      title: {
        fontFamily: 'System',
        color: 'white',
        fontWeight: '500'
      },
      subtitle: {
        fontFamily: 'System'
      },
      largeTitle: {
        visible: true,
        fontSize: 30,
        fontFamily: 'System'
      },
      backButton: {
        color: 'white'
      }
    },
    layout: {
      backgroundColor: '#EEEEEE',
      orientation: ['portrait']
    },
    bottomTabs: {
      visible: false
    }
  })
}

export const startApp = (callback) => {
  StatusBar.setHidden(false, 'fade')
  StatusBar.setBarStyle('default', true)
  Navigation.events().registerAppLaunchedListener(() => {
    setDefaultOptions()
    callback()
  })
}

export const startTabBasedApp = (locale) => {
  locale = locale || 'zh'

  Navigation.setRoot({
    root: {
      sideMenu: {
        left: {
          component: {
            id: 'BitPortal.Profile',
            name: 'BitPortal.Profile'
          }
        },
        center: {
          stack: {
            options: {},
            children: [
              {
                component: {
                  id: 'BitPortal.Root',
                  name: 'BitPortal.Root'
                }
              }
            ]
          }
        }
      }
    }
  })
}

export const setBottomTabsLocale = (locale) => {
  locale = locale || 'zh'
  Navigation.mergeOptions('BitPortal.Wallet', {
    topBar: {
      title: {
        text: messages[locale].top_bar_title_wallet
      }
    },
    bottomTab: {
      text: messages[locale].tab_bar_title_wallet,
      textColor: '#9D9D9D',
      iconColor: '#9D9D9D',
      selectedTextColor: '#007AFF',
      icon: require('resources/images/wallet_tab.png'),
      selectedIconColor: '#007AFF',
      testID: 'BITPORTAL_ASSETS'
    }
  })
}
