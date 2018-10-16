declare interface BridgeMessage {
  type: string
  payload: any
  messageId: string
  info: BridgeTransferMessageInfo | BridgeVoteMessageInfo | BridgePushActionsMessageInfo | BridgeSignDataMessageInfo | BridgeSignatureMessageInfo
}

declare interface BridgeTransferMessageInfo {
  blockchain: string
  amount: string | number
  symbol: string
  contract: string
  fromAccount: string
  toAccount: string
  memo?: string
}

declare interface BridgeVoteMessageInfo {
  blockchain: string
  producers: any
  voter: string
}

declare interface BridgePushActionsMessageInfo {
  blockchain: string
  actions: any
}

declare interface BridgeSignDataMessageInfo {
  blockchain: string
  signData: string
  account: string
  publicKey: string
  isHash: boolean
}

declare interface BridgeSignatureMessageInfo {
  requiredFields: any
  buf: any
  transaction: any
}
