import { AppRegistry, StatusBar } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Provider, { PersistProvider } from 'components/Provider'
import AssetTableViewCell from 'components/TableViewCell/AssetTableViewCell'
import HeaderTableViewCell from 'components/TableViewCell/HeaderTableViewCell'
import ContactHeaderTableViewCell from 'components/TableViewCell/ContactHeaderTableViewCell'
import AssetBalanceTableViewCell from 'components/TableViewCell/AssetBalanceTableViewCell'
import WalletOverviewTableViewCell from 'components/TableViewCell/WalletOverviewTableViewCell'
import WalletTableViewCell from 'components/TableViewCell/WalletTableViewCell'
import WalletManagementTableViewCell from 'components/TableViewCell/WalletManagementTableViewCell'
import ProducerTableViewCell from 'components/TableViewCell/ProducerTableViewCell'
import MarketTableViewCell from 'components/TableViewCell/MarketTableViewCell'
import TransactionTableViewCell from 'components/TableViewCell/TransactionTableViewCell'
import AssetActionsTableViewCell from 'components/TableViewCell/AssetActionsTableViewCell'
import AssetOverviewTableViewCell from 'components/TableViewCell/AssetOverviewTableViewCell'
import IdentityTableViewCell from 'components/TableViewCell/IdentityTableViewCell'
import ContactTableViewCell from 'components/TableViewCell/ContactTableViewCell'
import SelectContactTableViewCell from 'components/TableViewCell/SelectContactTableViewCell'
import ContactDeleteTableViewCell from 'components/TableViewCell/ContactDeleteTableViewCell'
import AddressTableViewCell from 'components/TableViewCell/AddressTableViewCell'
import SelectEOSAccountTableViewCell from 'components/TableViewCell/SelectEOSAccountTableViewCell'
import SwitchEOSAccountTableViewCell from 'components/TableViewCell/SwitchEOSAccountTableViewCell'
import SwitchBTCAddressTableViewCell from 'components/TableViewCell/SwitchBTCAddressTableViewCell'
import IdentityDetailTableViewCell from 'components/TableViewCell/IdentityDetailTableViewCell'
import TransactionDetailTableViewCell from 'components/TableViewCell/TransactionDetailTableViewCell'
import DappHeaderTableViewCell from 'components/TableViewCell/DappHeaderTableViewCell'
import DappMarketTableViewCell from 'components/TableViewCell/DappMarketTableViewCell'
import DappFooterTableViewCell from 'components/TableViewCell/DappFooterTableViewCell'
import DappCategoryTableViewCell from 'components/TableViewCell/DappCategoryTableViewCell'
import SmallDappTableViewCell from 'components/TableViewCell/SmallDappTableViewCell'
import ChainTypeTableViewCell from 'components/TableViewCell/ChainTypeTableViewCell'
import NewsTableViewCell from 'components/TableViewCell/NewsTableViewCell'
import WalletCardCollectionViewCell from 'components/CollectionViewCell/WalletCardCollectionViewCell'
import FeaturedDappCollectionViewCell from 'components/CollectionViewCell/FeaturedDappCollectionViewCell'
import SmallDappCollectionViewCell from 'components/CollectionViewCell/SmallDappCollectionViewCell'
import LargeDappCollectionViewCell from 'components/CollectionViewCell/LargeDappCollectionViewCell'
import IdentityHeader from 'components/Header/IdentityHeader'

import Market from 'screens/Market'
import Welcome from 'screens/Welcome'
import Wallet from 'screens/Wallet'
import EOSAssets from 'screens/Wallet/EOSAssets'
import ETHAssets from 'screens/Wallet/ETHAssets'
import Asset from 'screens/Wallet/Asset'
import TransferAsset from 'screens/Wallet/TransferAsset'
import ReceiveAsset from 'screens/Wallet/ReceiveAsset'
import WalletList from 'screens/Wallet/WalletList'
import ManageWallet from 'screens/Wallet/ManageWallet'
import Voting from 'screens/Wallet/Voting'
import AddIdentity from 'screens/Wallet/AddIdentity'
import MyIdentity from 'screens/Wallet/MyIdentity'
import CreateIdentity from 'screens/Wallet/CreateIdentity'
import RecoverIdentity from 'screens/Wallet/RecoverIdentity'
import BackupIdentity from 'screens/Wallet/BackupIdentity'
import SelectChainType from 'screens/Wallet/SelectChainType'
import ImportBTCWallet from 'screens/Wallet/ImportBTCWallet'
import CreateEOSAccount from 'screens/Wallet/CreateEOSAccount'
import ManageEOSResource from 'screens/Wallet/ManageEOSResource'
import ImportETHWallet from 'screens/Wallet/ImportETHWallet'
import ImportEOSWallet from 'screens/Wallet/ImportEOSWallet'
import ImportChainxWallet from 'screens/Wallet/ImportChainxWallet'
import ExportETHKeystore from 'screens/Wallet/ExportETHKeystore'
import ExportETHPrivateKey from 'screens/Wallet/ExportETHPrivateKey'
import ExportEOSPrivateKey from 'screens/Wallet/ExportEOSPrivateKey'
import ExportBTCPrivateKey from 'screens/Wallet/ExportBTCPrivateKey'
import SelectEOSAccount from 'screens/Wallet/SelectEOSAccount'
import SwitchEOSAccount from 'screens/Wallet/SwitchEOSAccount'
import SwitchBTCAddress from 'screens/Wallet/SwitchBTCAddress'
import TransactionDetail from 'screens/Wallet/TransactionDetail'
import Discovery from 'screens/Discovery'
import DappList from 'screens/Discovery/DappList'
import Profile from 'screens/Profile'
import Contacts from 'screens/Profile/Contacts'
import Contact from 'screens/Profile/Contact'
import EditContact from 'screens/Profile/EditContact'
import News from 'screens/News'
import LanguageSetting from 'screens/Profile/LanguageSetting'
import CurrencySetting from 'screens/Profile/CurrencySetting'
import NodeSetting from 'screens/Profile/NodeSetting'
import WebView from 'screens/WebView'
import Camera from 'screens/Camera'

import Images from 'resources/images'
import messages from 'resources/messages'

export const registerScreens = (store, persistor) => {
  AppRegistry.registerComponent('AssetTableViewCell', () => AssetTableViewCell)
  AppRegistry.registerComponent('HeaderTableViewCell', () => HeaderTableViewCell)
  AppRegistry.registerComponent('ContactHeaderTableViewCell', () => ContactHeaderTableViewCell)
  AppRegistry.registerComponent('AssetBalanceTableViewCell', () => AssetBalanceTableViewCell)
  AppRegistry.registerComponent('WalletOverviewTableViewCell', () => WalletOverviewTableViewCell)
  AppRegistry.registerComponent('WalletTableViewCell', () => WalletTableViewCell)
  AppRegistry.registerComponent('WalletManagementTableViewCell', () => WalletManagementTableViewCell)
  AppRegistry.registerComponent('ProducerTableViewCell', () => ProducerTableViewCell)
  AppRegistry.registerComponent('MarketTableViewCell', () => MarketTableViewCell)
  AppRegistry.registerComponent('TransactionTableViewCell', () => TransactionTableViewCell)
  AppRegistry.registerComponent('AssetActionsTableViewCell', () => AssetActionsTableViewCell)
  AppRegistry.registerComponent('AssetOverviewTableViewCell', () => AssetOverviewTableViewCell)
  AppRegistry.registerComponent('ChainTypeTableViewCell', () => ChainTypeTableViewCell)

  AppRegistry.registerComponent('WalletCardCollectionViewCell', () => WalletCardCollectionViewCell)
  AppRegistry.registerComponent('FeaturedDappCollectionViewCell', () => FeaturedDappCollectionViewCell)
  AppRegistry.registerComponent('SmallDappCollectionViewCell', () => SmallDappCollectionViewCell)
  AppRegistry.registerComponent('LargeDappCollectionViewCell', () => LargeDappCollectionViewCell)
  AppRegistry.registerComponent('IdentityTableViewCell', () => IdentityTableViewCell)
  AppRegistry.registerComponent('ContactTableViewCell', () => ContactTableViewCell)
  AppRegistry.registerComponent('SelectContactTableViewCell', () => SelectContactTableViewCell)
  AppRegistry.registerComponent('ContactDeleteTableViewCell', () => ContactDeleteTableViewCell)
  AppRegistry.registerComponent('AddressTableViewCell', () => AddressTableViewCell)

  AppRegistry.registerComponent('SelectEOSAccountTableViewCell', () => SelectEOSAccountTableViewCell)
  AppRegistry.registerComponent('SwitchEOSAccountTableViewCell', () => SwitchEOSAccountTableViewCell)
  AppRegistry.registerComponent('SwitchBTCAddressTableViewCell', () => SwitchBTCAddressTableViewCell)
  AppRegistry.registerComponent('IdentityDetailTableViewCell', () => IdentityDetailTableViewCell)
  AppRegistry.registerComponent('TransactionDetailTableViewCell', () => TransactionDetailTableViewCell)
  AppRegistry.registerComponent('DappHeaderTableViewCell', () => DappHeaderTableViewCell)
  AppRegistry.registerComponent('DappMarketTableViewCell', () => DappMarketTableViewCell)

  AppRegistry.registerComponent('DappFooterTableViewCell', () => DappFooterTableViewCell)
  AppRegistry.registerComponent('DappCategoryTableViewCell', () => DappCategoryTableViewCell)
  AppRegistry.registerComponent('SmallDappTableViewCell', () => SmallDappTableViewCell)
  AppRegistry.registerComponent('NewsTableViewCell', () => NewsTableViewCell)

  Navigation.registerComponentWithRedux('BitPortal.Welcome', () => Welcome, Provider, store)

  Navigation.registerComponentWithRedux('BitPortal.Wallet', () => Wallet, PersistProvider, store)
  Navigation.registerComponentWithRedux('BitPortal.EOSAssets', () => EOSAssets, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ETHAssets', () => ETHAssets, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Asset', () => Asset, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.TransferAsset', () => TransferAsset, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ReceiveAsset', () => ReceiveAsset, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.WalletList', () => WalletList, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ManageWallet', () => ManageWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Voting', () => Voting, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AddIdentity', () => AddIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.MyIdentity', () => MyIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.IdentityHeader', () => IdentityHeader, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.CreateIdentity', () => CreateIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.RecoverIdentity', () => RecoverIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.BackupIdentity', () => BackupIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SelectChainType', () => SelectChainType, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ImportBTCWallet', () => ImportBTCWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.CreateEOSAccount', () => CreateEOSAccount, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ManageEOSResource', () => ManageEOSResource, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ImportETHWallet', () => ImportETHWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ImportEOSWallet', () => ImportEOSWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ImportChainxWallet', () => ImportChainxWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SelectEOSAccount', () => SelectEOSAccount, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SwitchEOSAccount', () => SwitchEOSAccount, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SwitchBTCAddress', () => SwitchBTCAddress, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportETHKeystore', () => ExportETHKeystore, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportETHPrivateKey', () => ExportETHPrivateKey, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportEOSPrivateKey', () => ExportEOSPrivateKey, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ExportBTCPrivateKey', () => ExportBTCPrivateKey, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.TransactionDetail', () => TransactionDetail, Provider, store)

  Navigation.registerComponentWithRedux('BitPortal.Market', () => Market, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Discovery', () => Discovery, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.DappList', () => DappList, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Profile', () => Profile, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Contacts', () => Contacts, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Contact', () => Contact, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.EditContact', () => EditContact, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.News', () => News, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.LanguageSetting', () => LanguageSetting, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.CurrencySetting', () => CurrencySetting, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.NodeSetting', () => NodeSetting, Provider, store)

  Navigation.registerComponentWithRedux('BitPortal.WebView', () => WebView, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Camera', () => Camera, Provider, store)
}

export const startApp = (callback) => {
  StatusBar.setHidden(false, 'fade')
  StatusBar.setBarStyle('default', true)
  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setDefaultOptions({
      statusBar: {
        visible: true
      },
      topBar: {
        background: {
          translucent: false,
          color: '#F7F7F7'
        },
        drawBehind: true,
        noBorder: false,
        title: {
          fontFamily: 'System'
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
        backgroundColor: '#F0EFF5',
        orientation: ['portrait']
      },
      bottomTabs: {
        visible: true,
        translucent: true,
        backgroundColor: '#F7F7F7',
        drawBehind: false
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
                  iconColor: '#9D9D9D',
                  selectedTextColor: '#007AFF',
                  icon: require('resources/images/wallet_tab.png'),
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
                  text: '市场',
                  textColor: '#9D9D9D',
                  iconColor: '#9D9D9D',
                  selectedTextColor: '#007AFF',
                  icon: require('resources/images/market_tab.png'),
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
                  iconColor: '#9D9D9D',
                  selectedTextColor: '#007AFF',
                  icon: require('resources/images/app_tab.png'),
                  selectedIconColor: '#007AFF',
                  testID: 'BITPORTAL_DISCOVERY'
                }
              }
            }
          },
          // {
          //   stack: {
          //     children: [
          //       {
          //         component: {
          //           id: 'BitPortal.News',
          //           name: 'BitPortal.News'
          //         }
          //       }
          //     ],
          //     options: {
          //       bottomTab: {
          //         text: '资讯',
          //         textColor: '#9D9D9D',
          //         iconColor: '#9D9D9D',
          //         selectedTextColor: '#007AFF',
          //         icon: require('resources/images/news_tab.png'),
          //         selectedIconColor: '#007AFF',
          //         testID: 'BITPORTAL_NEWS'
          //       }
          //     }
          //   }
          // },
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
                  iconColor: '#9D9D9D',
                  selectedTextColor: '#007AFF',
                  icon: require('resources/images/profile_tab.png'),
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
