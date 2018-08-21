// import { List, Map } from 'immutable'

// declare interface ContactItem {
//   id: number
//   eosAccountName: string
//   note?: string
// }

// declare interface ContactStateObject {
//   data: ContactItem[]
// }

// declare interface ContactState extends Map<string, any> {
//   toJS(): ContactStateObject
//   get<K extends keyof ContactStateObject>(key: K): ContactStateObject[K]
// }

declare interface AddContactParams {
  eosAccountName: string
  note?: string
  componentId?: string
}

declare type DeleteContactParams = number
