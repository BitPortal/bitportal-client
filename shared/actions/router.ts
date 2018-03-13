import { createAction } from 'redux-actions'

export const locationInit = createAction('router/LOCATION_INIT')
export const matchPublicRouter = createAction('router/MATCH_PUBLIC_ROUTER')
export const matchPrivateRouter = createAction('router/MATCH_PRIVATE_ROUTER')
