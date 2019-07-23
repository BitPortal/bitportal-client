import { AppRegistry, StatusBar } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import Provider, { PersistProvider } from 'components/Provider'

import Root from 'screens/Root'
import Wallet from 'screens/Wallet'
import Market from 'screens/Market'
import Profile from 'screens/Profile'
import AddIdentity from 'screens/Wallet/AddIdentity'
import CreateIdentity from 'screens/Wallet/CreateIdentity'
import WalletList from 'screens/Wallet/WalletList'
import NavigationBackground from 'components/NavigationBackground'
import { FirstTabScreen, SecondTabScreen, ThirdTabScreen } from 'screens/Wallet'

import Images from 'resources/images'
import messages from 'resources/messages'

export const registerScreens = (store) => {
  Navigation.registerComponentWithRedux('BitPortal.Root', () => Root, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Wallet', () => Wallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Market', () => Market, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Profile', () => Profile, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AddIdentity', () => AddIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.CreateIdentity', () => CreateIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.WalletList', () => WalletList, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.NavigationBackground', () => NavigationBackground, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.FirstTabScreen', () => gestureHandlerRootHOC(FirstTabScreen), Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SecondTabScreen', () => gestureHandlerRootHOC(SecondTabScreen), Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ThirdTabScreen', () => gestureHandlerRootHOC(ThirdTabScreen), Provider, store)
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
        color: '#673AB7',
        /* component: {
         *   name: 'BitPortal.NavigationBackground',
         *   clipToBounds: true
         * }*/
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

/* export const startSingleApp = () => {
 *   Navigation.setRoot({
 *     root: {
 *       component: {
 *         name: 'BitPortal.Welcome',
 *         options: {
 *           topBar: {
 *             visible: false
 *           }
 *         }
 *       }
 *     }
 *   })
 * }*/

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
                  name: 'BitPortal.Root',
                  options: {
                    topBar: {
                      title: {
                        text: messages[locale].top_bar_title_wallet
                      },
                      elevation: 0
                    }
                  }
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
