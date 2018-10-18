declare interface GetEOSBlockParams {
  block_num_or_id: number
}

declare interface GetEOSBlockResult {
  action_mroot: string
  block_mroot: string
  block_num: number
  id: string
  input_transactions: any[]
  new_producers: any
  previous: string
  producer: string
  producer_signature: string
  ref_block_prefix: number
  regions: any[]
  schedule_version: number
  timestamp: string
  transaction_mroot: string
}

declare interface EOSPushTransactionParams {
  compression: string
  signatures: string[]
  transaction: {
    actions: {
      account: string
      authorization: {
        actor: string
        permission: string
      }[]
      name: string
      data: string
    }[]
    context_free_actions: any[]
    delay_sec: number
    expiration: string
    max_kcpu_usage: number
    max_net_usage_words: number
    ref_block_num: number
    ref_block_prefix: number
    region: number
  }
}

declare interface EOSPushTransactionResult {
  processed: {}
  transaction_id: string
}

declare interface CreateAccountParams {
  bitportalAccountName: string
  password: string
  eosAccountName: string
}

declare interface CreateEOSAccountParams {
  eosAccountName: string
  privateKey?: string
  bpid?: string
  inviteCode: string
  password: string
  componentId?: string
  hint?: string
}

declare interface CreateEOSAccountAssistanceParams {
  eosAccountName: string
  privateKey?: string
  bpid?: string
  password: string
  componentId?: string
  hint?: string
}

declare interface CreateEOSAccountResult {
  name: string
  key?: string
  permissions?: {
    parent: string
    perm_name: string
    required_auth?: {
      accounts: any[]
      keys: {
        key: string
        weight: number
      }[]
    }
  }[]
}

declare interface CreateEOSAccountAssistanceResult {
  eosAccountName: string
  ownerPublicKey: string
  activePublicKey: string
  ownerKeystore: string
  activeKeystore: string
  timestamp: number
}

declare interface ImportEOSAccountParams {
  eosAccountName: string
  privateKey: string
  publicKey: string
  password: string
  name: string
  componentId?: string
  accountInfo: any
  permission: string
}

declare interface ImportEOSAccountResult {
  name: string
  permissions?: {
    parent: string
    perm_name: string
    required_auth?: {
      accounts: any[]
      keys: {
        key: string
        weight: number
      }[]
    }
  }[]
}

declare interface SwitchEOSAccountParams {
  name: string
  key?: string
}

declare interface GetEOSAccountParams {
  eosAccountName: string
}

declare interface GetEOSAccountResult {
  account_name: string
  core_liquid_balance: string
  permissions: {
    parent: string
    perm_name: string
    required_auth?: {
      accounts: any[]
      keys: {
        key: string
        weight: number
      }[]
    }
  }[]
}

declare interface AuthEOSAccountParams {
  key: string
  account: GetEOSAccountResult
}

declare interface AuthEOSAccountResult {
  account_name: string
  permissions: {
    parent: string
    perm_name: string
    required_auth?: {
      accounts: any[]
      keys: {
        key: string
        weight: number
      }[]
    }
  }[]
}

declare interface SetEOSAccountPasswordParams {
  name: string
  password: string
}

declare type SyncEOSAccountResult = string[]

declare interface ValidateEOSAccountParams {
  field: string
  value: string
  errorMessage: string
  resolve: any
  reject: any
}

declare interface ValidateEOSAccountResult {
  resolve: any
}

declare interface ValidateEOSAccountRejection {
  reject: any
  field: string
  message: string | object
}

declare interface GetEOSKeyAccountsParams {
  privateKey: string
  password: string
  hint?: string
  componentId?: string
}

declare interface GetEOSKeyAccountsResult {
  account_names: string[]
}

declare interface SyncEOSAccountCreationInfoResult {
  eosAccountName: string
  publicKey: string
  transactionId: string
  irreversible: boolean
  backup: boolean
  node: string
  timestamp: number
}
