import { createAction } from 'redux-actions'

export const initDappBrowser = createAction<any>('dappBrwoser/INIT')
export const closeDappBrowser = createAction<any>('dappBrwoser/CLOSE')
export const receiveMessage = createAction<any>('dappBrwoser/RECEIVE_MESSAGE')
export const sendMessage = createAction<any>('dappBrwoser/SEND_MESSAGE')
export const pendMessage = createAction<BridgeMessage>('dappBrwoser/PEND_MESSAGE')
export const rejectMessage = createAction('dappBrwoser/REJECT_MESSAGE')
export const resolveMessage = createAction('dappBrwoser/RESOLVE_MESSAGE')
export const resolveMessageFinished = createAction('dappBrwoser/RESOLVE_MESSAGE_FINISHED')
export const clearMessage = createAction('dappBrwoser/CLEAR_MESSAGE')
