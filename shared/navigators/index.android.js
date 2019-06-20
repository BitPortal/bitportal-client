import { AppRegistry, StatusBar } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import Provider, { PersistProvider } from 'components/Provider'

import Wallet from 'screens/Wallet'
import NavigationBackground from 'components/NavigationBackground'
import { FirstTabScreen, SecondTabScreen, ThirdTabScreen } from 'screens/Wallet'

import Images from 'resources/images'
import messages from 'resources/messages'

export const registerScreens = (store) => {
  Navigation.registerComponentWithRedux('BitPortal.Wallet', () => Wallet, Provider, store)
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
        component: {
          name: 'BitPortal.NavigationBackground',
          clipToBounds: true
        }
      },
      drawBehind: true,
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
      stack: {
        options: {},
        children: [
          {
            component: {
              id: 'BitPortal.Wallet',
              name: 'BitPortal.Wallet',
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
  })
  /* Navigation.setRoot({
   *   root: {
   *     bottomTabs: {
   *       id: 'BottomTabsId',
   *       children: [
   *         {
   *           stack: {
   *             children: [
   *               {
   *                 component: {
   *                   id: 'BitPortal.Wallet',
   *                   name: 'BitPortal.Wallet',
   *                   options: {
   *                     topBar: {
   *                       title: {
   *                         text: messages[locale].top_bar_title_wallet
   *                       }
   *                     }
   *                   }
   *                 }
   *               }
   *             ],
   *             options: {
   *               bottomTab: {
   *                 text: messages[locale].tab_bar_title_wallet,
   *                 textColor: '#9D9D9D',
   *                 iconColor: '#9D9D9D',
   *                 selectedTextColor: '#007AFF',
   *                 icon: require('resources/images/wallet_tab.png'),
   *                 selectedIconColor: '#007AFF',
   *                 testID: 'BITPORTAL_ASSETS'
   *               }
   *             }
   *           }
   *         }
   *       ]
   *     }
   *   }
   * })*/
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
