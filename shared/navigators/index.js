import { Navigation } from 'react-native-navigation'
import Market from 'screens/Market'
import Welcome from 'screens/Welcome'
import Wallet from 'screens/Wallet'
import WalletAssets from 'screens/Wallet/Assets'
import Discovery from 'screens/Discovery'
import Profile from 'screens/Profile'
import Images from 'resources/images'
import messages from 'resources/messages'

export const registerScreens = (store, Provider) => {
  Navigation.registerComponentWithRedux('BitPortal.Welcome', () => Welcome, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Wallet', () => Wallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.WalletAssets', () => WalletAssets, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Market', () => Market, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Discovery', () => Discovery, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Profile', () => Profile, Provider, store)
}

export const startApp = (callback) => {
  Navigation.events().registerAppLaunchedListener(() => {
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
        translucent: true,
        backgroundColor: '#F7F7F7'
      }
    })

    callback()
  })
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

export const startTabBasedApp = () => {
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
                  text: '钱包',
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
                  text: '行情',
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
                  text: '应用',
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
                  text: '我的',
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
