import { Navigation } from 'react-native-navigation'
import screenComponent from 'components/ScreenComponent'
import { Platform } from 'react-native'
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
import Assets from 'screens/Assets'
import ReceiveQRCode from 'screens/Assets/ReceiveQRCode'
import AssetChart from 'screens/Assets/AssetChart'
import AssetSearch from 'screens/Assets/AssetSearch'
import AssetsTransfer from 'screens/Assets/AssetsTransfer'
import AvailableAssets from 'screens/Assets/AvailableAssets'
import Backup from 'screens/Account/Backup'
import AccountImport from 'screens/Account/AccountImport'
import AccountSelection from 'screens/Account/AccountSelection'
import AccountAssistance from 'screens/Account/AccountAssistance'
import AccountSmartContact from 'screens/Account/AccountSmartContact'
import AccountAssistanceOrder from 'screens/Account/AccountAssistanceOrder'
import AccountSmartContactOrder from 'screens/Account/AccountSmartContactOrder'
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
import Colors from 'resources/colors'
import messages from 'resources/messages'

export const registerScreens = (store) => {
  Navigation.registerComponent('BitPortal.Welcome', () => screenComponent(Welcome, store))
  Navigation.registerComponent('BitPortal.DappWebView', () => screenComponent(DappWebView, store))
  Navigation.registerComponent('BitPortal.DappBrowser', () => screenComponent(DappBrowser, store))
  Navigation.registerComponent('BitPortal.LightBox', () => screenComponent(LightBox, store))
  Navigation.registerComponent('BitPortal.BPWebView', () => screenComponent(BPWebView, store))
  Navigation.registerComponent('BitPortal.QRCodeScanner', () => screenComponent(QRCodeScanner, store))
  Navigation.registerComponent('BitPortal.TransactionRecord', () => screenComponent(TransactionRecord, store))
  Navigation.registerComponent('BitPortal.Assets', () => screenComponent(Assets, store))
  Navigation.registerComponent('BitPortal.ReceiveQRCode', () => screenComponent(ReceiveQRCode, store))
  Navigation.registerComponent('BitPortal.AssetChart', () => screenComponent(AssetChart, store))
  Navigation.registerComponent('BitPortal.AssetSearch', () => screenComponent(AssetSearch, store))
  Navigation.registerComponent('BitPortal.AssetsTransfer', () => screenComponent(AssetsTransfer, store))
  Navigation.registerComponent('BitPortal.AvailableAssets', () => screenComponent(AvailableAssets, store))
  Navigation.registerComponent('BitPortal.Market', () => screenComponent(Market, store))
  Navigation.registerComponent('BitPortal.FundFlow', () => screenComponent(FundFlow, store))
  Navigation.registerComponent('BitPortal.TokenDetails', () => screenComponent(TokenDetails, store))
  Navigation.registerComponent('BitPortal.MarketDetails', () => screenComponent(MarketDetails, store))
  Navigation.registerComponent('BitPortal.Discovery', () => screenComponent(Discovery, store))
  Navigation.registerComponent('BitPortal.DiscoveryArticle', () => screenComponent(ArticleWebView, store))
  Navigation.registerComponent('BitPortal.Markdown', () => screenComponent(Markdown, store))
  Navigation.registerComponent('BitPortal.DappList', () => screenComponent(DappList, store))
  Navigation.registerComponent('BitPortal.Resources', () => screenComponent(Resources, store))
  Navigation.registerComponent('BitPortal.CPU', () => screenComponent(CPU, store))
  Navigation.registerComponent('BitPortal.Memory', () => screenComponent(Memory, store))
  Navigation.registerComponent('BitPortal.Bandwidth', () => screenComponent(Bandwidth, store))
  Navigation.registerComponent('BitPortal.Voting', () => screenComponent(Voting, store))
  Navigation.registerComponent('BitPortal.ProducerDetails', () => screenComponent(ProducerDetails, store))
  Navigation.registerComponent('BitPortal.About', () => screenComponent(About, store))
  Navigation.registerComponent('BitPortal.Profile', () => screenComponent(Profile, store))
  Navigation.registerComponent('BitPortal.Contacts', () => screenComponent(Contacts, store))
  Navigation.registerComponent('BitPortal.Settings', () => screenComponent(Settings, store))
  Navigation.registerComponent('BitPortal.Mediafax', () => screenComponent(Mediafax, store))
  Navigation.registerComponent('BitPortal.Languages', () => screenComponent(Languages, store))
  Navigation.registerComponent('BitPortal.Currencies', () => screenComponent(Currencies, store))
  Navigation.registerComponent('BitPortal.NodeSettings', () => screenComponent(NodeSettings, store))
  Navigation.registerComponent('BitPortal.CreateContact', () => screenComponent(CreateContact, store))
  Navigation.registerComponent('BitPortal.ResetPassword', () => screenComponent(ResetPassword, store))
  Navigation.registerComponent('BitPortal.AccountManager', () => screenComponent(AccountManager, store))
  Navigation.registerComponent('BitPortal.ExportEntrance', () => screenComponent(ExportEntrance, store))
  Navigation.registerComponent('BitPortal.ExportKeystore', () => screenComponent(ExportKeystore, store))
  Navigation.registerComponent('BitPortal.ExportPrivateKey', () => screenComponent(ExportPrivateKey, store))
  Navigation.registerComponent('BitPortal.TransactionHistory', () => screenComponent(TransactionHistory, store))
  Navigation.registerComponent('BitPortal.Backup', () => screenComponent(Backup, store))
  Navigation.registerComponent('BitPortal.AccountImport', () => screenComponent(AccountImport, store))
  Navigation.registerComponent('BitPortal.AccountSelection', () => screenComponent(AccountSelection, store))
  Navigation.registerComponent('BitPortal.AccountAssistance', () => screenComponent(AccountAssistance, store))
  Navigation.registerComponent('BitPortal.AccountSmartContact', () => screenComponent(AccountSmartContact, store))
  Navigation.registerComponent('BitPortal.AccountAssistanceOrder', () => screenComponent(AccountAssistanceOrder, store))
  Navigation.registerComponent('BitPortal.AccountSmartContactOrder', () => screenComponent(AccountSmartContactOrder, store))
  Navigation.registerComponent('BitPortal.AccountAssistancePayment', () => screenComponent(AccountAssistancePayment, store))
  Navigation.registerComponent('BitPortal.EOSAccountCreation', () => screenComponent(EOSAccountCreation, store))
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
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'BitPortal.Assets',
                    name: 'BitPortal.Assets',
                    options: {
                      topBar: {
                        visible: false,
                        animate: false
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].general_nav_assets,
                  textColor: 'gray',
                  selectedTextColor: Colors.textColor_89_185_226,
                  icon: Images.asset,
                  selectedIcon: Images.asset_press,
                  selectedIconColor: Colors.textColor_89_185_226,
                  testID: 'BITPORTAL_ASSETS'
                },
                bottomTabs: {
                  visible: true
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
                    name: 'BitPortal.Market',
                    options: {
                      topBar: {
                        visible: false,
                        animate: false
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].general_nav_market,
                  textColor: 'gray',
                  selectedTextColor: Colors.textColor_89_185_226,
                  icon: Images.market,
                  selectedIcon: Images.market_press,
                  selectedIconColor: Colors.textColor_89_185_226,
                  testID: 'BITPORTAL_MARKET'
                },
                bottomTabs: {
                  visible: true
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
                    name: 'BitPortal.Discovery',
                    options: {
                      topBar: {
                        visible: false,
                        animate: false
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].general_nav_discovery,
                  textColor: 'gray',
                  selectedTextColor: Colors.textColor_89_185_226,
                  icon: Images.discovery,
                  selectedIcon: Images.discovery_press,
                  selectedIconColor: Colors.textColor_89_185_226,
                  testID: 'BITPORTAL_DISCOVERY'
                },
                bottomTabs: {
                  visible: true
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
                    name: 'BitPortal.Profile',
                    options: {
                      topBar: {
                        visible: false,
                        animate: false
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].general_nav_profile,
                  textColor: 'gray',
                  selectedTextColor: Colors.textColor_89_185_226,
                  icon: Images.profile,
                  selectedIcon: Images.profile_press,
                  selectedIconColor: Colors.textColor_89_185_226,
                  testID: 'BITPORTAL_PROFILE'
                },
                bottomTabs: {
                  visible: true
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
  if (Platform.OS === 'ios') {
    Navigation.mergeOptions('BitPortal.Assets', {
      bottomTab: {
        text: messages[locale].general_nav_assets,
        textColor: 'gray',
        selectedTextColor: Colors.textColor_89_185_226,
        icon: Images.asset,
        selectedIcon: Images.asset_press,
        selectedIconColor: Colors.textColor_89_185_226,
        testID: 'BITPORTAL_ASSETS'
      }
    })

    Navigation.mergeOptions('BitPortal.Market', {
      bottomTab: {
        text: messages[locale].general_nav_market,
        textColor: 'gray',
        selectedTextColor: Colors.textColor_89_185_226,
        icon: Images.market,
        selectedIcon: Images.market_press,
        selectedIconColor: Colors.textColor_89_185_226,
        testID: 'BITPORTAL_MARKET'
      }
    })

    Navigation.mergeOptions('BitPortal.Discovery', {
      bottomTab: {
        text: messages[locale].general_nav_discovery,
        textColor: 'gray',
        selectedTextColor: Colors.textColor_89_185_226,
        icon: Images.discovery,
        selectedIcon: Images.discovery_press,
        selectedIconColor: Colors.textColor_89_185_226,
        testID: 'BITPORTAL_DISCOVERY'
      }
    })

    Navigation.mergeOptions('BitPortal.Profile', {
      bottomTab: {
        text: messages[locale].general_nav_profile,
        textColor: 'gray',
        selectedTextColor: Colors.textColor_89_185_226,
        icon: Images.profile,
        selectedIcon: Images.profile_press,
        selectedIconColor: Colors.textColor_89_185_226,
        testID: 'BITPORTAL_PROFILE'
      }
    })
  } else {
    startTabBasedApp(locale)
  }
}
