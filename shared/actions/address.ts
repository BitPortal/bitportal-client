import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const setActiveAddress = createAction<SetActiveAddressParams>('address/SET_ACTIVE_ADDRESS')
export const updateAddress = createAction<UpdateAddressParams>('address/UPDATE')
export const scanHDAddresses = createAsyncAction('address/SCAN_HD')