import { createAction } from 'redux-actions'

export const receiveMessage = createAction<any>('dappBrwoser/RECEIVE_MESSAGE')
export const sendMessage = createAction<any>('dappBrwoser/SEND_MESSAGE')
export const pendMessage = createAction<BridgeMessage>('dappBrwoser/PEND_MESSAGE')
export const rejectMessage = createAction('dappBrwoser/REJECT_MESSAGE')
export const resolveMessage = createAction('dappBrwoser/RESOLVE_MESSAGE')
export const resolveMessageFinished = createAction('dappBrwoser/RESOLVE_MESSAGE_FAILED')
export const resolveMessageFailed = createAction<ErrorMessage>('dappBrwoser/RESOLVE_MESSAGE_FINISHED')
export const loadContract = createAction('dappBrwoser/LOAD_CONTRACT')
export const clearMessage = createAction('dappBrwoser/CLEAR_MESSAGE')
export const clearPasswordError = createAction('dappBrwoser/CLEAR_PASSWORD_ERROR')
