import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateTicker = createAction<UpdateTickerParams>('ticker/UPDATE')
export const getTicker = createAsyncAction('ticker/GET')

export const updateEOSRAMTicker = createAction<UpdateEOSRAMTickerParams>('ticker/UPDATE_EOS_RAM')
export const getEOSRAMTicker = createAsyncAction('ticker/GET_EOS_RAM')

export const handleTickerSearchTextChange = createAction('ticker/HANDLE_SEARCH_TEXT')
export const setTickerSearchText = createAction('ticker/SET_SEARCH_TEXT')
