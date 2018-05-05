declare type PeriodId =
  '1SEC' | '2SEC' | '3SEC' | '4SEC' | '5SEC' | '6SEC' | '10SEC' | '15SEC' | '20SEC' | '30SEC' |
  '1MIN' | '2MIN' | '3MIN' | '4MIN' | '5MIN' | '6MIN' | '10MIN' | '15MIN' | '20MIN' | '30MIN' |
  '1HRS' | '2HRS' | '3HRS' | '4HRS' | '6HRS' | '8HRS' | '12HRS' |
  '1DAY' | '2DAY' | '3DAY' | '5DAY' | '7DAY' | '10DAY' |
  '1MTH' | '2MTH' | '3MTH' | '4MTH' | '6MTH' |
  '1YRS' | '2YRS' | '3YRS' | '4YRS' | '5YRS'

declare interface ChartParams {
  symbol_id: string
  period_id: PeriodId
  limit: number
  include_empty_items?: boolean
}

declare interface Slot {
  time_period_start: string
  time_period_end: string
  time_open: string
  time_close: string
  price_open: number
  price_high: number
  price_low: number
  price_close: number
  volume_traded: number
  trades_count: number
}

declare type ChartResult = Slot[]
