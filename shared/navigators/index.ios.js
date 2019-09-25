import { AppRegistry, StatusBar } from 'react-native'
import { Navigation } from 'components/Navigation'
import Provider, { PersistProvider } from 'components/Provider'
import AssetTableViewCell from 'components/TableViewCell/AssetTableViewCell'
import HeaderTableViewCell from 'components/TableViewCell/HeaderTableViewCell'
import ContactHeaderTableViewCell from 'components/TableViewCell/ContactHeaderTableViewCell'
import AssetBalanceTableViewCell from 'components/TableViewCell/AssetBalanceTableViewCell'
import WalletOverviewTableViewCell from 'components/TableViewCell/WalletOverviewTableViewCell'
import WalletTableViewCell from 'components/TableViewCell/WalletTableViewCell'
import WalletManagementTableViewCell from 'components/TableViewCell/WalletManagementTableViewCell'
import ProducerTableViewCell from 'components/TableViewCell/ProducerTableViewCell'
import ChainXValidatorTableViewCell from 'components/TableViewCell/ChainXValidatorTableViewCell'
import ChainXValidatorDetailTableViewCell from 'components/TableViewCell/ChainXValidatorDetailTableViewCell'
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
import ProducerDetailTableViewCell from 'components/TableViewCell/ProducerDetailTableViewCell'
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
import LoadMoreTableViewCell from 'components/TableViewCell/LoadMoreTableViewCell'
import DappTrendingTableViewCell from 'components/TableViewCell/DappTrendingTableViewCell'
import IdentityHeader from 'components/Header/IdentityHeader'

import Market from 'screens/Market'
import Wallet from 'screens/Wallet'
import AddAssets from 'screens/Wallet/AddAssets'
import Asset from 'screens/Wallet/Asset'
import TransferAsset from 'screens/Wallet/TransferAsset'
import ReceiveAsset from 'screens/Wallet/ReceiveAsset'
import WalletList from 'screens/Wallet/WalletList'
import SelectBridgeWallet from 'screens/Wallet/SelectBridgeWallet'
import ManageWallet from 'screens/Wallet/ManageWallet'
import Voting from 'screens/Wallet/Voting'
import AddIdentity from 'screens/Wallet/AddIdentity'
import AuthorizeEOSAccount from 'screens/Wallet/AuthorizeEOSAccount'
import AuthorizeCreateEOSAccount from 'screens/Wallet/AuthorizeCreateEOSAccount'
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
import ExportPCXPrivateKey from 'screens/Wallet/ExportPCXPrivateKey'
import SelectEOSAccount from 'screens/Wallet/SelectEOSAccount'
import SwitchEOSAccount from 'screens/Wallet/SwitchEOSAccount'
import SwitchBTCAddress from 'screens/Wallet/SwitchBTCAddress'
import TransactionDetail from 'screens/Wallet/TransactionDetail'
import ProducerDetail from 'screens/Wallet/ProducerDetail'
import ChainXDeposit from 'screens/Wallet/ChainX/Deposit'
import ChainXDepositClaim from 'screens/Wallet/ChainX/Deposit/Claim'
import ChainXVoting from 'screens/Wallet/ChainX/Voting'
import ChainXValidatorDetail from 'screens/Wallet/ChainX/Voting/ValidatorDetail'
import Discovery from 'screens/Discovery'
import DappList from 'screens/Discovery/DappList'
import Profile from 'screens/Profile'
import Contacts from 'screens/Profile/Contacts'
import Contact from 'screens/Profile/Contact'
import EditContact from 'screens/Profile/EditContact'
import LanguageSetting from 'screens/Profile/LanguageSetting'
import CurrencySetting from 'screens/Profile/CurrencySetting'
import WebView from 'screens/WebView'
import Camera from 'screens/Camera'

import messages from 'resources/messages'

export const registerScreens = (store) => {
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
  AppRegistry.registerComponent('ChainXValidatorTableViewCell', () => ChainXValidatorTableViewCell)
  AppRegistry.registerComponent('ChainXValidatorDetailTableViewCell', () => ChainXValidatorDetailTableViewCell)

  AppRegistry.registerComponent('WalletCardCollectionViewCell', () => WalletCardCollectionViewCell)
  AppRegistry.registerComponent('FeaturedDappCollectionViewCell', () => FeaturedDappCollectionViewCell)
  AppRegistry.registerComponent('SmallDappCollectionViewCell', () => SmallDappCollectionViewCell)
  AppRegistry.registerComponent('LargeDappCollectionViewCell', () => LargeDappCollectionViewCell)
  AppRegistry.registerComponent('IdentityTableViewCell', () => IdentityTableViewCell)
  AppRegistry.registerComponent('ContactTableViewCell', () => ContactTableViewCell)
  AppRegistry.registerComponent('SelectContactTableViewCell', () => SelectContactTableViewCell)
  AppRegistry.registerComponent('ContactDeleteTableViewCell', () => ContactDeleteTableViewCell)
  AppRegistry.registerComponent('AddressTableViewCell', () => AddressTableViewCell)
  AppRegistry.registerComponent('LoadMoreTableViewCell', () => LoadMoreTableViewCell)

  AppRegistry.registerComponent('SelectEOSAccountTableViewCell', () => SelectEOSAccountTableViewCell)
  AppRegistry.registerComponent('SwitchEOSAccountTableViewCell', () => SwitchEOSAccountTableViewCell)
  AppRegistry.registerComponent('SwitchBTCAddressTableViewCell', () => SwitchBTCAddressTableViewCell)
  AppRegistry.registerComponent('IdentityDetailTableViewCell', () => IdentityDetailTableViewCell)
  AppRegistry.registerComponent('ProducerDetailTableViewCell', () => ProducerDetailTableViewCell)
  AppRegistry.registerComponent('TransactionDetailTableViewCell', () => TransactionDetailTableViewCell)
  AppRegistry.registerComponent('DappHeaderTableViewCell', () => DappHeaderTableViewCell)
  AppRegistry.registerComponent('DappMarketTableViewCell', () => DappMarketTableViewCell)

  AppRegistry.registerComponent('DappFooterTableViewCell', () => DappFooterTableViewCell)
  AppRegistry.registerComponent('DappCategoryTableViewCell', () => DappCategoryTableViewCell)
  AppRegistry.registerComponent('SmallDappTableViewCell', () => SmallDappTableViewCell)
  AppRegistry.registerComponent('DappTrendingTableViewCell', () => DappTrendingTableViewCell)

  Navigation.registerComponentWithRedux('BitPortal.Wallet', () => Wallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AddAssets', () => AddAssets, Provider, store)

  Navigation.registerComponentWithRedux('BitPortal.Asset', () => Asset, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.TransferAsset', () => TransferAsset, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ReceiveAsset', () => ReceiveAsset, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.WalletList', () => WalletList, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.SelectBridgeWallet', () => SelectBridgeWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ManageWallet', () => ManageWallet, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Voting', () => Voting, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AddIdentity', () => AddIdentity, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AuthorizeEOSAccount', () => AuthorizeEOSAccount, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.AuthorizeCreateEOSAccount', () => AuthorizeCreateEOSAccount, Provider, store)
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
  Navigation.registerComponentWithRedux('BitPortal.ExportPCXPrivateKey', () => ExportPCXPrivateKey, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.TransactionDetail', () => TransactionDetail, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ProducerDetail', () => ProducerDetail, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.ChainXDeposit', () => ChainXDeposit, PersistProvider, store)
  Navigation.registerComponentWithRedux('BitPortal.ChainXDepositClaim', () => ChainXDepositClaim, PersistProvider, store)
  Navigation.registerComponentWithRedux('BitPortal.ChainXVoting', () => ChainXVoting, PersistProvider, store)
  Navigation.registerComponentWithRedux('BitPortal.ChainXValidatorDetail', () => ChainXValidatorDetail, PersistProvider, store)

  Navigation.registerComponentWithRedux('BitPortal.Market', () => Market, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Discovery', () => Discovery, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.DappList', () => DappList, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Profile', () => Profile, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Contacts', () => Contacts, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Contact', () => Contact, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.EditContact', () => EditContact, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.LanguageSetting', () => LanguageSetting, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.CurrencySetting', () => CurrencySetting, Provider, store)

  Navigation.registerComponentWithRedux('BitPortal.WebView', () => WebView, Provider, store)
  Navigation.registerComponentWithRedux('BitPortal.Camera', () => Camera, Provider, store)
}

export const setDefaultOptions = () => {
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
      translucent: false,
      backgroundColor: '#F7F7F7',
      drawBehind: false
    },
    // modalPresentationStyle: 'sheets'
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
      bottomTabs: {
        id: 'BottomTabsId',
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'BitPortal.Wallet',
                    name: 'BitPortal.Wallet',
                    options: {
                      topBar: {
                        title: {
                          text: messages[locale].top_bar_title_wallet
                        }
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].tab_bar_title_wallet,
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
                    name: 'BitPortal.Market',
                    options: {
                      topBar: {
                        title: {
                          text: messages[locale].top_bar_title_market
                        }
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].tab_bar_title_market,
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
                  text: '浏览器',
                  textColor: '#9D9D9D',
                  iconColor: '#9D9D9D',
                  selectedTextColor: '#007AFF',
                  icon: require('resources/images/browser.png'),
                  selectedIconColor: '#007AFF',
                  testID: 'BITPORTAL_DISCOVERY'
                }
              }
            }
          },
          /* {
           *   stack: {
           *     children: [
           *       {
           *         component: {
           *           id: 'BitPortal.News',
           *           name: 'BitPortal.News'
           *         }
           *       }
           *     ],
           *     options: {
           *       bottomTab: {
           *         text: '资讯',
           *         textColor: '#9D9D9D',
           *         iconColor: '#9D9D9D',
           *         selectedTextColor: '#007AFF',
           *         icon: require('resources/images/news_tab.png'),
           *         selectedIconColor: '#007AFF',
           *         testID: 'BITPORTAL_NEWS'
           *       }
           *     }
           *   }
           * },*/
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'BitPortal.Profile',
                    name: 'BitPortal.Profile',
                    options: {
                      topBar: {
                        title: {
                          text: messages[locale].top_bar_title_profile
                        }
                      }
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: messages[locale].tab_bar_title_profile,
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

  Navigation.mergeOptions('BitPortal.Market', {
    topBar: {
      title: {
        text: messages[locale].top_bar_title_market
      }
    },
    bottomTab: {
      text: messages[locale].tab_bar_title_market,
      textColor: '#9D9D9D',
      iconColor: '#9D9D9D',
      selectedTextColor: '#007AFF',
      icon: require('resources/images/market_tab.png'),
      selectedIconColor: '#007AFF',
      testID: 'BITPORTAL_MARKET'
    }
  })

  Navigation.mergeOptions('BitPortal.Discovery', {
    bottomTab: {
      text: messages[locale].general_nav_discovery,
      textColor: '#9D9D9D',
      selectedTextColor: '#007AFF',
      icon: require('resources/images/browser.png'),
      selectedIconColor: '#007AFF',
      testID: 'BITPORTAL_DISCOVERY'
    }
  })

  Navigation.mergeOptions('BitPortal.Profile', {
    topBar: {
      title: {
        text: messages[locale].top_bar_title_profile
      }
    },
    bottomTab: {
      text: messages[locale].tab_bar_title_profile,
      textColor: '#9D9D9D',
      iconColor: '#9D9D9D',
      selectedTextColor: '#007AFF',
      icon: require('resources/images/profile_tab.png'),
      selectedIconColor: '#007AFF',
      testID: 'BITPORTAL_PROFILE'
    }
  })
}
