export const RANGES = ['1H', '1D', '1W', '1M', '1Y', 'ALL']

export const CHART_RANGES = {
  '1H': 'h',
  '1D': 'd',
  '1W': 'w',
  '1M': 'm',
  '1Y': 'y',
  ALL: 'all'
}

export const RANGE_TO_CHART_TYPE = {
  '1H': 'histominute',
  '1D': 'histohour',
  '1W': 'histohour',
  '1M': 'histoday',
  '1Y': 'histoday',
  ALL: 'histoday'
}

export const TIME_CONSTRAINT = {
  '1H': 3600000,
  '1D': 86400000,
  '1W': 604800000,
  '1M': 2628000000,
  '1Y': 31540000000,
  ALL: new Date()
}
