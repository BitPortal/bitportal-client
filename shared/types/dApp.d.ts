declare interface DappParams {}

declare interface Dapp {
  type: string
  category: string
  name: string
  display_name: object
  description: object
  url: string
  icon_url: string
  createdAt: string
  updatedAt: string
  _id: string
  __v: number
  id: string
  display_priority: number
}

declare type DappResult = Dapp[]
