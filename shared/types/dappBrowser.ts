declare interface BridgeMessage {
  type: string
  payload: any
  messageId: string
  info: BridgeTransferMessageInfo | BridgeVoteMessageInfo
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
