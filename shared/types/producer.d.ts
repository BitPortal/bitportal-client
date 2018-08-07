declare interface GetProducersInfoParams {
  _limit: number
}

declare type GetProducersInfoResult = any

declare interface GetProducersWithInfoParams {
  limit: number
}

declare interface GetProducersWithInfoResult {
  total_producer_vote_weight: string
  more: string
  rows: any[]
}
