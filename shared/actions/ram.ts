import { createAction } from 'redux-actions'

export const buyRAMRequested = createAction<BuyRAMParams>('ram/BUY_REQUESTED')
export const buyRAMSucceeded = createAction<BuyRAMResult>('ram/BUY_SUCCEEDED')
export const buyRAMFailed = createAction<ErrorMessage>('ram/BUY_FAILED')
export const sellRAMRequested = createAction<SellRAMParams>('ram/SELL_REQUESTED')
export const sellRAMSucceeded = createAction<SellRAMResult>('ram/SELL_SUCCEEDED')
export const sellRAMFailed = createAction<ErrorMessage>('ram/SELL_FAILED')
export const getRAMMarketRequested = createAction('ram/GET_MARKET_REQUESTED')
export const getRAMMarketSucceeded = createAction<GetRAMMarketResult>('ram/GET_MARKET_SUCCEEDED')
export const getRAMMarketFailed = createAction<ErrorMessage>('ram/GET_MARKET_FAILED')
export const clearRAMError = createAction('ram/CLEAR_ERROR')
export const hideSuccessModal = createAction('ram/HIDE_SUCCESS_MODAL')
