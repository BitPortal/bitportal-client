declare interface EOSAuthorization {
  actor: string
  permission: string
}

declare interface EOSAction {
  account: string
  authorization: EOSAuthorization[]
  name: string
  data: string
}

declare interface EOSTransaction {
  actions: EOSAction[]
  context_free_actions: []
  delay_sec: number
  expiration: string
  max_kcpu_usage: number
  max_net_usage_words: number
  ref_block_num: number
  ref_block_prefix: number
  region: number
}

declare interface EOSAccountKey {
  key: string
  weight: number
}

declare interface EOSAccountRequiredAuth {
  accounts: []
  keys: EOSAccountKey[]
}

declare interface Permission {
  parent: string
  perm_name: string
  required_auth?: EOSAccountRequiredAuth
}

declare interface EOSInfo {
  head_block_id: string
  head_block_num: number
  head_block_producer: string
  head_block_time: string
  last_irreversible_block_num: number
  server_version: string
}

declare interface GetEOSBlockParams {
  block_num_or_id: number
}

declare interface GetEOSBlockResult {
  action_mroot: string
  block_mroot: string
  block_num: number
  id: string
  input_transactions: []
  new_producers: any
  previous: string
  producer: string
  producer_signature: string
  ref_block_prefix: number
  regions: []
  schedule_version: number
  timestamp: string
  transaction_mroot: string
}

declare interface EOSPushTransactionParams {
  compression: string
  signatures: string[]
  transaction: EOSTransaction
}

declare interface EOSPushTransactionResult {
  processed: {}
  transaction_id: string
}

declare interface CreateEOSAccountParams {
  creator: string
  name: string
  recovery: string
  keyProvider?: string | string[]
}

declare interface CreateEOSAccountResult {
  name: string
  key?: string
  permissions?: Permission[]
}

declare interface SwitchEOSAccountParams {
  name: string
  key?: string
}

declare interface GetEOSAccountParams {
  name: string
}

declare interface GetEOSAccountResult {
  account_name: string
  permissions: Permission[]
}

declare interface AuthEOSAccountParams {
  key: string
  permissions: Permission[]
}
