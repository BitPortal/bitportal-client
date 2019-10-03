import 'node-libs-react-native/globals'
import 'crypto'
import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/zh.js'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'
import React from 'react'
import { AppRegistry } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { registerCells } from 'navigators'
import Provider from 'components/Provider'
import { persistStore } from 'redux-persist'
import configure from 'store'
import sagas from 'sagas'

import Wallet from 'screens/Wallet'
import Profile from 'screens/Profile'
import Market from 'screens/Market'
import Discovery from 'screens/Discovery'
import Language from 'screens/Language'
import AddAssets from 'screens/AddAssets'
import Asset from 'screens/Asset'
import TransferAsset from 'screens/TransferAsset'
import ReceiveAsset from 'screens/ReceiveAsset'
import WalletList from 'screens/WalletList'
import SelectBridgeWallet from 'screens/SelectBridgeWallet'
import ManageWallet from 'screens/ManageWallet'
import Voting from 'screens/Voting'
import AddIdentity from 'screens/AddIdentity'
import AuthorizeEOSAccount from 'screens/AuthorizeEOSAccount'
import AuthorizeCreateEOSAccount from 'screens/AuthorizeCreateEOSAccount'
import MyIdentity from 'screens/MyIdentity'
import CreateIdentity from 'screens/CreateIdentity'
import RecoverIdentity from 'screens/RecoverIdentity'
import BackupIdentity from 'screens/BackupIdentity'
import SelectChainType from 'screens/SelectChainType'
import ImportBTCWallet from 'screens/ImportBTCWallet'
import CreateEOSAccount from 'screens/CreateEOSAccount'
import ManageEOSResource from 'screens/ManageEOSResource'
import ImportETHWallet from 'screens/ImportETHWallet'
import ImportEOSWallet from 'screens/ImportEOSWallet'
import ImportChainxWallet from 'screens/ImportChainxWallet'
import ExportETHKeystore from 'screens/ExportETHKeystore'
import ExportETHPrivateKey from 'screens/ExportETHPrivateKey'
import ExportEOSPrivateKey from 'screens/ExportEOSPrivateKey'
import ExportBTCPrivateKey from 'screens/ExportBTCPrivateKey'
import ExportPCXPrivateKey from 'screens/ExportPCXPrivateKey'
import SelectEOSAccount from 'screens/SelectEOSAccount'
import SwitchEOSAccount from 'screens/SwitchEOSAccount'
import SwitchBTCAddress from 'screens/SwitchBTCAddress'
import TransactionDetail from 'screens/TransactionDetail'
import ProducerDetail from 'screens/ProducerDetail'
import ChainXDeposit from 'screens/ChainX/Deposit'
import ChainXDepositClaim from 'screens/ChainX/Deposit/Claim'
import ChainXVoting from 'screens/ChainX/Voting'
import ChainXValidatorDetail from 'screens/ChainX/Voting/ValidatorDetail'
import DappList from 'screens/Discovery/DappList'
import Contacts from 'screens/Contacts'
import Contact from 'screens/Contact'
import EditContact from 'screens/EditContact'
import Currency from 'screens/Currency'
import Browser from 'screens/Browser'
import Camera from 'screens/Camera'

EStyleSheet.build({})

const locale = 'zh'
const store = configure({ intl: { locale }})
store.runSaga(sagas)

const WalletScreen = () => (<Provider store={store}><Wallet /></Provider>)
const MarketScreen = () => (<Provider store={store}><Market /></Provider>)
const DiscoveryScreen = () => (<Provider store={store}><Discovery /></Provider>)
const ProfileScreen = () => (<Provider store={store}><Profile /></Provider>)
const LanguageScreen = () => (<Provider store={store}><Language /></Provider>)
const AddAssetsScreen = () => (<Provider store={store}><AddAssets /></Provider>)
const AssetScreen = () => (<Provider store={store}><Asset /></Provider>)
const TransferAssetScreen = () => (<Provider store={store}><TransferAsset /></Provider>)
const ReceiveAssetScreen = () => (<Provider store={store}><ReceiveAsset /></Provider>)
const WalletListScreen = () => (<Provider store={store}><WalletList /></Provider>)
const SelectBridgeWalletScreen = () => (<Provider store={store}><SelectBridgeWallet /></Provider>)
const ManageWalletScreen = () => (<Provider store={store}><ManageWallet /></Provider>)
const VotingScreen = () => (<Provider store={store}><Voting /></Provider>)
const AddIdentityScreen = () => (<Provider store={store}><AddIdentity /></Provider>)
const AuthorizeEOSAccountScreen = () => (<Provider store={store}><AuthorizeEOSAccount /></Provider>)
const AuthorizeCreateEOSAccountScreen = () => (<Provider store={store}><AuthorizeCreateEOSAccount /></Provider>)
const MyIdentityScreen = () => (<Provider store={store}><MyIdentity /></Provider>)
const CreateIdentityScreen = () => (<Provider store={store}><CreateIdentity /></Provider>)
const RecoverIdentityScreen = () => (<Provider store={store}><RecoverIdentity /></Provider>)
const BackupIdentityScreen = () => (<Provider store={store}><BackupIdentity /></Provider>)
const SelectChainTypeScreen = () => (<Provider store={store}><SelectChainType /></Provider>)
const ImportBTCWalletScreen = () => (<Provider store={store}><ImportBTCWallet /></Provider>)
const CreateEOSAccountScreen = () => (<Provider store={store}><CreateEOSAccount /></Provider>)
const ManageEOSResourceScreen = () => (<Provider store={store}><ManageEOSResource /></Provider>)
const ImportETHWalletScreen = () => (<Provider store={store}><ImportETHWallet /></Provider>)
const ImportEOSWalletScreen = () => (<Provider store={store}><ImportEOSWallet /></Provider>)
const ImportChainxWalletScreen = () => (<Provider store={store}><ImportChainxWallet /></Provider>)
const ExportETHKeystoreScreen = () => (<Provider store={store}><ExportETHKeystore /></Provider>)
const ExportETHPrivateKeyScreen = () => (<Provider store={store}><ExportETHPrivateKey /></Provider>)
const ExportEOSPrivateKeyScreen = () => (<Provider store={store}><ExportEOSPrivateKey /></Provider>)
const ExportBTCPrivateKeyScreen = () => (<Provider store={store}><ExportBTCPrivateKey /></Provider>)
const ExportPCXPrivateKeyScreen = () => (<Provider store={store}><ExportPCXPrivateKey /></Provider>)
const SelectEOSAccountScreen = () => (<Provider store={store}><SelectEOSAccount /></Provider>)
const SwitchEOSAccountScreen = () => (<Provider store={store}><SwitchEOSAccount /></Provider>)
const SwitchBTCAddressScreen = () => (<Provider store={store}><SwitchBTCAddress /></Provider>)
const TransactionDetailScreen = () => (<Provider store={store}><TransactionDetail /></Provider>)
const ProducerDetailScreen = () => (<Provider store={store}><ProducerDetail /></Provider>)
const ChainXDepositScreen = () => (<Provider store={store}><ChainXDeposit /></Provider>)
const ChainXDepositClaimScreen = () => (<Provider store={store}><ChainXDepositClaim /></Provider>)
const ChainXVotingScreen = () => (<Provider store={store}><ChainXVoting /></Provider>)
const ChainXValidatorDetailScreen = () => (<Provider store={store}><ChainXValidatorDetail /></Provider>)
const DappListScreen = () => (<Provider store={store}><DappList /></Provider>)
const ContactsScreen = () => (<Provider store={store}><Contacts /></Provider>)
const ContactScreen = () => (<Provider store={store}><Contact /></Provider>)
const EditContactScreen = () => (<Provider store={store}><EditContact /></Provider>)
const CurrencyScreen = () => (<Provider store={store}><Currency /></Provider>)
const BrowserScreen = () => (<Provider store={store}><Browser /></Provider>)
const CameraScreen = () => (<Provider store={store}><Camera /></Provider>)

registerCells()

AppRegistry.registerComponent('Wallet', () => WalletScreen)
AppRegistry.registerComponent('Market', () => MarketScreen)
AppRegistry.registerComponent('Discovery', () => DiscoveryScreen)
AppRegistry.registerComponent('Profile', () => ProfileScreen)
AppRegistry.registerComponent('Language', () => LanguageScreen)
AppRegistry.registerComponent('AddAssets', () => AddAssetsScreen)
AppRegistry.registerComponent('Asset', () => AssetScreen)
AppRegistry.registerComponent('TransferAsset', () => TransferAssetScreen)
AppRegistry.registerComponent('ReceiveAsset', () => ReceiveAssetScreen)
AppRegistry.registerComponent('WalletList', () => WalletListScreen)
AppRegistry.registerComponent('SelectBridgeWallet', () => SelectBridgeWalletScreen)
AppRegistry.registerComponent('ManageWallet', () => ManageWalletScreen)
AppRegistry.registerComponent('Voting', () => VotingScreen)
AppRegistry.registerComponent('AddIdentity', () => AddIdentityScreen)
AppRegistry.registerComponent('AuthorizeEOSAccount', () => AuthorizeEOSAccountScreen)
AppRegistry.registerComponent('AuthorizeCreateEOSAccount', () => AuthorizeCreateEOSAccountScreen)
AppRegistry.registerComponent('MyIdentity', () => MyIdentityScreen)
AppRegistry.registerComponent('CreateIdentity', () => CreateIdentityScreen)
AppRegistry.registerComponent('RecoverIdentity', () => RecoverIdentityScreen)
AppRegistry.registerComponent('BackupIdentity', () => BackupIdentityScreen)
AppRegistry.registerComponent('SelectChainType', () => SelectChainTypeScreen)
AppRegistry.registerComponent('ImportBTCWallet', () => ImportBTCWalletScreen)
AppRegistry.registerComponent('CreateEOSAccount', () => CreateEOSAccountScreen)
AppRegistry.registerComponent('ManageEOSResource', () => ManageEOSResourceScreen)
AppRegistry.registerComponent('ImportETHWallet', () => ImportETHWalletScreen)
AppRegistry.registerComponent('ImportEOSWallet', () => ImportEOSWalletScreen)
AppRegistry.registerComponent('ImportChainxWallet', () => ImportChainxWalletScreen)
AppRegistry.registerComponent('ExportETHKeystore', () => ExportETHKeystoreScreen)
AppRegistry.registerComponent('ExportETHPrivateKey', () => ExportETHPrivateKeyScreen)
AppRegistry.registerComponent('ExportEOSPrivateKey', () => ExportEOSPrivateKeyScreen)
AppRegistry.registerComponent('ExportBTCPrivateKey', () => ExportBTCPrivateKeyScreen)
AppRegistry.registerComponent('ExportPCXPrivateKey', () => ExportPCXPrivateKeyScreen)
AppRegistry.registerComponent('SelectEOSAccount', () => SelectEOSAccountScreen)
AppRegistry.registerComponent('SwitchEOSAccount', () => SwitchEOSAccountScreen)
AppRegistry.registerComponent('SwitchBTCAddress', () => SwitchBTCAddressScreen)
AppRegistry.registerComponent('TransactionDetail', () => TransactionDetailScreen)
AppRegistry.registerComponent('ProducerDetail', () => ProducerDetailScreen)
AppRegistry.registerComponent('ChainXDeposit', () => ChainXDepositScreen)
AppRegistry.registerComponent('ChainXDepositClaim', () => ChainXDepositClaimScreen)
AppRegistry.registerComponent('ChainXVoting', () => ChainXVotingScreen)
AppRegistry.registerComponent('ChainXValidatorDetail', () => ChainXValidatorDetailScreen)
AppRegistry.registerComponent('DappList', () => DappListScreen)
AppRegistry.registerComponent('Contacts', () => ContactsScreen)
AppRegistry.registerComponent('Contact', () => ContactScreen)
AppRegistry.registerComponent('EditContact', () => EditContactScreen)
AppRegistry.registerComponent('Currency', () => CurrencyScreen)
AppRegistry.registerComponent('Browser', () => BrowserScreen)
AppRegistry.registerComponent('Camera', () => CameraScreen)
