import { Navigation } from 'react-native-navigation'
import Market from 'screens/Market'
import FundFlow from 'screens/Market/FundFlow'
import TokenDetails from 'screens/Market/TokenDetails'
import MarketDetails from 'screens/Market/MarketDetails'
import Welcome from 'screens/Welcome'
import LightBox from 'screens/LightBox'
import QRCodeScanner from 'screens/QRCodeScanner'
import DappWebView from 'components/DappWebView'
import DappBrowser from 'screens/DappBrowser'
import { BPWebView } from 'components/BPNativeComponents'
import TransactionRecord from 'screens/TransactionRecord'
import Wallet from 'screens/Wallet'
import ReceiveQRCode from 'screens/Assets/ReceiveQRCode'
import AssetChart from 'screens/Assets/AssetChart'
import AssetSearch from 'screens/Assets/AssetSearch'
import AssetsTransfer from 'screens/Assets/AssetsTransfer'
import AvailableAssets from 'screens/Assets/AvailableAssets'
import Backup from 'screens/Account/Backup'
import AccountOrder from 'screens/Account/AccountOrder'
import AccountImport from 'screens/Account/AccountImport'
import AccountSelection from 'screens/Account/AccountSelection'
import AccountAssistance from 'screens/Account/AccountAssistance'
import AccountAssistancePayment from 'screens/Account/AccountAssistancePayment'
import EOSAccountCreation from 'screens/Account/EOSAccountCreation'
import Discovery from 'screens/Discovery'
import ArticleWebView from 'screens/Discovery/article'
import Markdown from 'screens/Discovery/markdown'
import DappList from 'screens/Discovery/DappList'
import Resources from 'screens/Resources'
import Memory from 'screens/Resources/Memory'
import Bandwidth from 'screens/Resources/Bandwidth'
import CPU from 'screens/Resources/CPU'
import Voting from 'screens/Profile/Voting'
import ProducerDetails from 'screens/Profile/Voting/ProducerDetails'
import About from 'screens/Profile/About'
import Profile from 'screens/Profile'
import Contacts from 'screens/Profile/Contacts'
import Settings from 'screens/Profile/Settings'
import Mediafax from 'screens/Profile/Mediafax'
import Languages from 'screens/Profile/Settings/Languages'
import Currencies from 'screens/Profile/Settings/Currencies'
import NodeSettings from 'screens/Profile/Settings/NodeSettings'
import CreateContact from 'screens/Profile/CreateContact'
import ResetPassword from 'screens/Profile/ResetPassword'
import AccountManager from 'screens/Profile/AccountManager'
import ExportEntrance from 'screens/Profile/ExportEntrance'
import ExportKeystore from 'screens/Profile/ExportKeystore'
import ExportPrivateKey from 'screens/Profile/ExportPrivateKey'
import TransactionHistory from 'screens/Profile/TransactionHistory'
import Images from 'resources/images'
import messages from 'resources/messages'

export const registerScreens = (store, Provider) => {
  Navigation.registerComponentWithRedux('BitPortal.Welcome', () => Welcome, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.DappWebView', () => DappWebView, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.DappBrowser', () => DappBrowser, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.LightBox', () => LightBox, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.BPWebView', () => BPWebView, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.QRCodeScanner', () => QRCodeScanner, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.TransactionRecord', () => TransactionRecord, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Wallet', () => Wallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ReceiveQRCode', () => ReceiveQRCode, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AssetChart', () => AssetChart, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AssetSearch', () => AssetSearch, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AssetsTransfer', () => AssetsTransfer, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AvailableAssets', () => AvailableAssets, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Market', () => Market, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.FundFlow', () => FundFlow, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.TokenDetails', () => TokenDetails, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.MarketDetails', () => MarketDetails, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Discovery', () => Discovery, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.DiscoveryArticle', () => ArticleWebView, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Markdown', () => Markdown, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.DappList', () => DappList, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Resources', () => Resources, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.CPU', () => CPU, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Memory', () => Memory, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Bandwidth', () => Bandwidth, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Voting', () => Voting, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ProducerDetails', () => ProducerDetails, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.About', () => About, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Profile', () => Profile, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Contacts', () => Contacts, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Settings', () => Settings, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Mediafax', () => Mediafax, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Languages', () => Languages, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Currencies', () => Currencies, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.NodeSettings', () => NodeSettings, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.CreateContact', () => CreateContact, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ResetPassword', () => ResetPassword, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AccountManager', () => AccountManager, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportEntrance', () => ExportEntrance, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportKeystore', () => ExportKeystore, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportPrivateKey', () => ExportPrivateKey, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.TransactionHistory', () => TransactionHistory, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Backup', () => Backup, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AccountOrder', () => AccountOrder, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AccountImport', () => AccountImport, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AccountSelection', () => AccountSelection, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AccountAssistance', () => AccountAssistance, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AccountAssistancePayment', () => AccountAssistancePayment, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.EOSAccountCreation', () => EOSAccountCreation, Provider, store)
}

export const startApp = (callback) => {
  Navigation.setDefaultOptions({
    topBar: {
      background: {
        translucent: false,
        color: '#F7F7F7'
      }
    },
    layout: {
      backgroundColor: '#F0EFF5',
      orientation: ['portrait']
    },
    bottomTabs: {
      visible: true,
      drawBehind: false,
      animate: false,
      backgroundColor: '#F7F7F7',
      translucent: false
    }
  })

  callback()
}

export const startSingleApp = () => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'BitPortal.Welcome',
        options: {
          topBar: {
            visible: false
          }
        }
      }
    }
  })
}

export const startTabBasedApp = (locale) => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'BitPortal.Wallet',
                    name: 'BitPortal.Wallet'
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].general_nav_assets,
                  textColor: '#9D9D9D',
                  selectedTextColor: '#007AFF',
                  icon: Images.asset,
                  selectedIcon: Images.asset_press,
                  selectedIconColor: '#007AFF',
                  testID: 'BITPORTAL_ASSETS'
                }
              }
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'BitPortal.Market',
                    name: 'BitPortal.Market'
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].general_nav_market,
                  textColor: '#9D9D9D',
                  selectedTextColor: '#007AFF',
                  icon: Images.market,
                  selectedIcon: Images.market_press,
                  selectedIconColor: '#007AFF',
                  testID: 'BITPORTAL_MARKET'
                }
              }
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'BitPortal.Discovery',
                    name: 'BitPortal.Discovery'
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].general_nav_discovery,
                  textColor: '#9D9D9D',
                  selectedTextColor: '#007AFF',
                  icon: Images.discovery,
                  selectedIcon: Images.discovery_press,
                  selectedIconColor: '#007AFF',
                  testID: 'BITPORTAL_DISCOVERY'
                }
              }
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'BitPortal.Profile',
                    name: 'BitPortal.Profile'
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].general_nav_profile,
                  textColor: '#9D9D9D',
                  selectedTextColor: '#007AFF',
                  icon: Images.profile,
                  selectedIcon: Images.profile_press,
                  selectedIconColor: '#007AFF',
                  testID: 'BITPORTAL_PROFILE'
                }
              }
            }
          }
        ]
      }
    }
  })
}

export const setBottomTabsLocale = (locale) => {
  Navigation.mergeOptions('BitPortal.Wallet', {
    bottomTab: {
      text: messages[locale].general_nav_assets,
      textColor: '#9D9D9D',
      selectedTextColor: '#007AFF',
      icon: Images.asset,
      selectedIcon: Images.asset_press,
      selectedIconColor: '#007AFF',
      testID: 'BITPORTAL_ASSETS'
    }
  })

  Navigation.mergeOptions('BitPortal.Market', {
    bottomTab: {
      text: messages[locale].general_nav_market,
      textColor: '#9D9D9D',
      selectedTextColor: '#007AFF',
      icon: Images.market,
      selectedIcon: Images.market_press,
      selectedIconColor: '#007AFF',
      testID: 'BITPORTAL_MARKET'
    }
  })

  Navigation.mergeOptions('BitPortal.Discovery', {
    bottomTab: {
      text: messages[locale].general_nav_discovery,
      textColor: '#9D9D9D',
      selectedTextColor: '#007AFF',
      icon: Images.discovery,
      selectedIcon: Images.discovery_press,
      selectedIconColor: '#007AFF',
      testID: 'BITPORTAL_DISCOVERY'
    }
  })

  Navigation.mergeOptions('BitPortal.Profile', {
    bottomTab: {
      text: messages[locale].general_nav_profile,
      textColor: '#9D9D9D',
      selectedTextColor: '#007AFF',
      icon: Images.profile,
      selectedIcon: Images.profile_press,
      selectedIconColor: '#007AFF',
      testID: 'BITPORTAL_PROFILE'
    }
  })
}
