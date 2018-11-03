import { createAction } from 'redux-actions'

export const getChartRequested = createAction<ChartParams>(
  'chart/GET_REQUESTED'
)
export const getChartSucceeded = createAction<ChartResult>(
  'chart/GET_SUCCEEDED'
)
export const getChartFailed = createAction<ErrorMessage>('chart/GET_FAILED')
export const changeChartRange = createAction<string>('chart/CHANGE_RANGE')
export const clearChart = createAction<string>('chart/CLEAR')
