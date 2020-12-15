import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const setActiveWallet = createAction('wallet/SET_ACTIVE_WALLET')
export const setActiveChain = createAction('wallet/SET_ACTIVE_CHAIN')
export const setManagingWallet = createAction('wallet/SET_MANAGING_WALLET')
export const setTransferWallet = createAction('wallet/SET_TRANSFER_WALLET')
export const setBridgeWallet = createAction('wallet/SET_BRIDGE_WALLET')
export const setBridgeChain = createAction('wallet/SET_BRIDGE_CHAIN')

export const addIdentityWallet = createAction('wallet/ADD_IDENTITY_WALLET')
export const addIdentityWallets = createAction('wallet/ADD_IDENTITY_WALLETS')
export const mergeIdentityWallets = createAction('wallet/MERGE_IDENTITY_WALLETS')

export const addImportedWallet = createAction('wallet/ADD_IMPORTED_WALLET')
export const addImportedWallets = createAction('wallet/ADD_IMPORTED_WALLETS')
export const mergeImportedWallets = createAction('wallet/MERGE_IMPORTED_WALLETS')

export const removeImportedWallet = createAction('wallet/REMOVE_IMPORTED_WALLET')
export const removeIdentityWallet = createAction('wallet/REMOVE_IDENTITY_WALLET')

export const updateEOSWalletAddress = createAction('wallet/UPDATE_EOS_ADDRESS')
export const updateWalletName = createAction('wallet/UPDATE_NAME')
export const updateBTCWalletAddressType = createAction('wallet/UPDATE_BTC_WALLET_ADDRESS_TYPE')

export const deleteWallet = createAsyncAction('wallet/DELETE_WALLET')
export const exportMnemonics = createAsyncAction('wallet/EXPORT_MNEMONICS')

export const importBTCMnemonics = createAsyncAction('wallet/IMPORT_BTC_MNEMONICS')
export const importBTCPrivateKey = createAsyncAction('wallet/IMPORT_BTC_PRIVATEKEY')
export const exportBTCPrivateKey = createAsyncAction('wallet/EXPORT_BTC_PRIVATEKEY')
export const generateNewBTCAddress = createAsyncAction('wallet/GENERATE_NEW_BTC_ADDRESS')
export const switchBTCAddressType = createAsyncAction('wallet/SWITCH_BTC_ADDRESS_TYPE')

export const importETHKeystore = createAsyncAction('wallet/IMPORT_ETH_KEYSTORE')
export const importETHMnemonics = createAsyncAction('wallet/IMPORT_ETH_MNEMONICS')
export const importETHPrivateKey = createAsyncAction('wallet/IMPORT_ETH_PRIVATEKEY')
export const exportETHPrivateKey = createAsyncAction('wallet/EXPORT_ETH_PRIVATEKEY')
export const exportETHKeystore = createAsyncAction('wallet/EXPORT_ETH_KEYSTORE')

export const importRioChainKeystore = createAsyncAction('wallet/IMPORT_RIOCHAIN_KEYSTORE')
export const importRioChainMnemonics = createAsyncAction('wallet/IMPORT_RIOCHAIN_MNEMONICS')
export const exportRioChainKeystore = createAsyncAction('wallet/EXPORT_RIOCHAIN_KEYSTORE')

export const getEOSKeyAccounts = createAsyncAction('wallet/GET_EOS_KEY_ACCOUNTS')
export const importEOSPrivateKey = createAsyncAction('wallet/IMPORT_EOS_PRIVATEKEY')
export const exportEOSPrivateKey = createAsyncAction('wallet/EXPORT_EOS_PRIVATEKEY')
export const setEOSWalletAddress = createAsyncAction('wallet/SET_EOS_ADDRESS')
export const setWalletName = createAsyncAction('wallet/SET_NAME')

export const importChainxMnemonics = createAsyncAction('wallet/IMPORT_CHAINX_MNEMONICS')
export const importChainxPrivateKey = createAsyncAction('wallet/IMPORT_CHAINX_PRIVATEKEY')
export const exportPCXPrivateKey = createAsyncAction('wallet/EXPORT_PCX_PRIVATEKEY')

export const updateBridgeWalletInfo = createAction('wallet/UPDATE_BRIDGE_WALLET_INFO')

export const importPolkadotKeystore = createAsyncAction('wallet/IMPORT_POLKADOT_KEYSTORE')
export const importPolkadotSuri = createAsyncAction('wallet/IMPORT_POLKADOT_SURI')
export const exportPolkadotKeystore = createAsyncAction('wallet/EXPORT_POLKADOT_KEYSTORE')
export const exportPolkadotSuri = createAsyncAction('wallet/EXPORT_POLKADOT_SURI')
