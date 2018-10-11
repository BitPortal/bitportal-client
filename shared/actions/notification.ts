import { createAction } from 'redux-actions'

export const subscribe = createAction<SubscribeParams>('trace/SUBSCRIBE')
export const unsubscribe = createAction<UnsubscribeParams>('trace/UNSUBSCRIBE')

