import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const setActiveWallet = createAction<SetActiveWalletParams>('wallet/SET_ACTIVE_WALLET')
export const setManagingWallet = createAction<SetManagingWalletParams>('wallet/SET_MANAGING_WALLET')
export const setTransferWallet = createAction<SetTransferWalletParams>('wallet/SET_TRANSFER_WALLET')

export const addIdentityWallet = createAction<AddIdentityWalletParams>('wallet/ADD_IDENTITY_WALLET')
export const addIdentityWallets = createAction<AddIdentityWalletsParams>('wallet/ADD_IDENTITY_WALLETS')
export const mergeIdentityWallets = createAction<AddIdentityWalletsParams>('wallet/MERGE_IDENTITY_WALLETS')

export const addImportedWallet = createAction<AddImportedWalletParams>('wallet/ADD_IMPORTED_WALLET')
export const addImportedWallets = createAction<AddImportedWalletsParams>('wallet/ADD_IMPORTED_WALLETS')
export const mergeImportedWallets = createAction<AddImportedWalletsParams>('wallet/MERGE_IMPORTED_WALLETS')

export const removeImportedWallet = createAction<RemoveImportedWalletParams>('wallet/REMOVE_IMPORTED_WALLET')
export const removeIdentityWallet = createAction<RemoveImportedWalletParams>('wallet/REMOVE_IDENTITY_WALLET')

export const updateEOSWalletAddress = createAction<SetEOSWalletAddressParams>('wallet/UPDATE_EOS_ADDRESS')
export const updateWalletName = createAction<UpdateWalletNameParams>('wallet/UPDATE_NAME')

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
export const getEOSKeyAccounts = createAsyncAction('wallet/GET_EOS_KEY_ACCOUNTS')
export const importEOSPrivateKey = createAsyncAction('wallet/IMPORT_EOS_PRIVATEKEY')
export const exportEOSPrivateKey = createAsyncAction('wallet/EXPORT_EOS_PRIVATEKEY')
export const setEOSWalletAddress = createAsyncAction('wallet/SET_EOS_ADDRESS')
export const setWalletName = createAsyncAction('wallet/SET_NAME')
