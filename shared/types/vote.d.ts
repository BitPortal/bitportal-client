declare interface GetProducersParams {

}

declare interface Producer  {
  name: string
  location: string
  producer: string
  totalVotes: number
}

declare type GetProducersResult = Producer[]
