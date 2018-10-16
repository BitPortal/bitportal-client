
declare interface SubscribeParams {
  deviceToken?: string,
  bpId?: any,
  chainType?: string,
  walletId?: string,
  topic?: any,
  platform?: string,
  language?: string,
}


declare interface UnsubscribeParams {
  deviceId?: string,
  chainType?: string,
  walletId?: string
}

