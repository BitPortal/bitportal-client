import { createAction } from 'redux-actions'

export const setActiveNode = createAction<SetActiveNodeParams>('eosNode/SET_ACTIVE_NODE')
export const addCustomNode = createAction<AddCustomNodeParams>('eosNode/ADD_CUSTOM_NODE')
export const deleteCustomNode = createAction<DeleteCustomNodeParams>('eosNode/DELETE_CUSTOM_NODE')
