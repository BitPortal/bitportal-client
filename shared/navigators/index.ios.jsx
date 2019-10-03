import React from 'react'
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

import messages from 'resources/messages'

export const registerCells = () => {
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
}
