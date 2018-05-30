declare interface VoteParams {
  
}

declare interface VoteRow  {
  name: string
  location: string
  producer: string
  totalVotes: number
}

declare type VoteResult = VoteRow[]
