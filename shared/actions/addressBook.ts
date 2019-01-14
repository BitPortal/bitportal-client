import { createAction } from 'redux-actions'

export const addContact = createAction<AddContactParams>('contact/ADD')
export const deleteContact = createAction<DeleteContactParams>('contact/DELETE')
