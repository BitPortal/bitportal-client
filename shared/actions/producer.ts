import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const sortProducers = createAction<string>('producer/SORT')
export const toggleSelect = createAction<string>('producer/TOGGLE_SELECT')
export const setSelected = createAction<any>('producer/SET_SELECT')
export const clearProducer = createAction('producer/CLEAR')
export const updateProducer = createAction('producer/UPDATE')

export const handleProducerSearchTextChange = createAction('producer/HANDLE_SEARCH_TEXT')
export const setProducerSearchText = createAction('producer/SET_SEARCH_TEXT')

export const getProducer = createAsyncAction('producer/GET')
