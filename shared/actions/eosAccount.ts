import { createAction } from 'redux-actions'

export const createEOSAccountRequested = createAction<CreateEOSAccountParams>('eosAccount/CREATE_REQUESTED')
export const createEOSAccountSucceeded = createAction<CreateEOSAccountResult>('eosAccount/CREATE_SUCCEEDED')
export const createEOSAccountFailed = createAction<ErrorMessage>('eosAccount/CREATE_FAILED')
export const syncEOSAccount = createAction<SyncEOSAccountResult>('eosAccount/SYNC')
export const syncEOSAccountCreationInfo = createAction<SyncEOSAccountCreationInfoResult>('eosAccount/SYNC_CREATION_INFO')
export const importEOSAccountRequested = createAction<ImportEOSAccountParams>('eosAccount/IMPORT_EOS_ACCOUNT_REQUESTED')
export const importEOSAccountSucceeded = createAction<ImportEOSAccountResult>('eosAccount/IMPORT_EOS_ACCOUNT_SUCCEEDED')
export const importEOSAccountFailed = createAction<ErrorMessage>('eosAccount/IMPORT_EOS_ACCOUNT_FAILED')
export const resetEOSAccount = createAction('eosAccount/RESET')
export const clearEOSAccountError = createAction('eosAccount/CLEAR_ERROR')
export const getEOSAccountRequested = createAction<GetEOSAccountParams>('eosAccount/GET_REQUESTED')
export const getEOSAccountSucceeded = createAction<GetEOSAccountResult>('eosAccount/GET_SUCCEEDED')
export const getEOSAccountFailed = createAction<ErrorMessage>('eosAccount/GET_FAILED')
export const validateEOSAccountRequested = createAction<ValidateEOSAccountParams>('eosAccount/VALIDATE_REQUESTED')
export const validateEOSAccountSucceeded = createAction<ValidateEOSAccountResult>('eosAccount/VALIDATE_SUCCEEDED')
export const validateEOSAccountFailed = createAction<ValidateEOSAccountRejection>('eosAccount/VALIDATE_FAILED')
export const hiddenAssetDisplay = createAction<string>('eosAccount/HIDDEN_ASSET_DISPLAY')
export const completeBackup = createAction('eosAccount/COMPLETE_BACKUP')
export const getEOSKeyAccountsRequested = createAction<GetEOSKeyAccountsParams>('eosAccount/GET_KEY_ACCOUNTS_REQUESTED')
export const getEOSKeyAccountsSucceeded = createAction<object>('eosAccount/GET_KEY_ACCOUNTS_SUCCEEDED')
export const getEOSKeyAccountsFailed = createAction<ErrorMessage>('eosAccount/GET_KEY_ACCOUNTS_FAILED')

export const createEOSAccountAssistanceRequested = createAction<CreateEOSAccountAssistanceParams>('eosAccount/CREATE_ASSISTANCE_REQUESTED')
export const createEOSAccountAssistanceSucceeded = createAction<CreateEOSAccountAssistanceResult>('eosAccount/CREATE_ASSISTANCE_SUCCEEDED')
export const createEOSAccountAssistanceFailed = createAction<ErrorMessage>('eosAccount/CREATE_ASSISTANCE_FAILED')
export const cancelEOSAccountAssistanceRequestd = createAction('eosAccount/CANCEL_ASSISTANCE')
export const showAssistanceAccountInfo = createAction('eosAccount/SHOW_TEMP_ACCOUNT_INFO')

export const createEOSAccountForOthersRequested = createAction<CreateEOSAccountForOthersParams>('eosAccount/CREATE_FOR_OTHERS_REQUESTED')
export const createEOSAccountForOthersSucceeded = createAction<CreateEOSAccountForOthersResult>('eosAccount/CREATE_FOR_OTHERS_SUCCEEDED')
export const createEOSAccountForOthersFailed = createAction<ErrorMessage>('eosAccount/CREATE_FOR_OTHERS_FAILED')

export const checkEOSAccountCreationStatusRequested = createAction<CheckEOSAccountStatusParams>('eosAccount/CHECK_CREATION_STATUS_REQUESTED')
export const checkEOSAccountCreationStatusSucceeded = createAction<CheckEOSAccountStatusResult>('eosAccount/CHECK_CREATION_STATUS_SUCCEEDED')
export const checkEOSAccountCreationStatusFailed = createAction<ErrorMessage>('eosAccount/CHECK_CREATION_STATUS_FAILED')

export const selectAccount = createAction<object>('eosAccount/SELECT_ACCOUNT')
export const selectAllAccount = createAction<object>('eosAccount/SELECT_ALL_ACCOUNT')
export const cancelSelectAllAccount = createAction<object>('eosAccount/CANCEL_SELECT_ALL_ACCOUNT')