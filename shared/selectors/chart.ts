import { createSelector } from 'reselect'
import { CHART_RANGES, TIME_CONSTRAINT } from 'constants/chart'
import { processColor } from 'react-native'
import moment from 'moment'

const chartRangeSelector = (state: RootState) => state.chart.get('range')
const chartTypeSelector = (state: RootState) => state.chart.get('chartType')
const allDataSelector = (state: RootState) => state.chart.get('data')

const dataSourceSelector = createSelector(allDataSelector, chartTypeSelector, (data: any, chartType: any) =>
  data.get(chartType)
)

export const formatChartLengthSelector = createSelector(
  chartRangeSelector,
  dataSourceSelector,
  (range: any, data: any) => {
    const time = new Date()
    const result = data.filter(e => (e.get('time') * 1000 >= time - TIME_CONSTRAINT[range] ? e : null)).reverse()
    return result.size > 9 ? result : []
  }
)

export const formatChartDatasetSelector = createSelector(
  formatChartLengthSelector,
  chartTypeSelector,
  (chart: any, chartType: any) => {
    const f = chartType === 'histoday' ? 'YYYY-MM-DD' : 'MM-DD-HH:mm'
    values = chart.map((e, i) => ({
      x: i,
      y: e.get('close'),
      marker: `${moment(e.get('time') * 1000).format(f)}\n${e.get('close')}`
    }))
    return {
      dataSets: [
        {
          values,
          label: 'A',
          config: {
            mode: 'CUBIC_BEZIER',
            drawValues: false,
            lineWidth: 2,
            drawCircles: false,
            circleColor: processColor('rgb(59, 145, 153)'),
            drawCircleHole: false,
            circleRadius: 5,
            highlightColor: processColor('transparent'),
            color: processColor('rgb(55,128,193)'),
            drawFilled: true,
            fillGradient: {
              colors: [processColor('transparent'), processColor('rgb(43,79,114)')],
              positions: [0, 0.75],
              angle: 90,
              orientation: 'TOP_BOTTOM'
            },
            fillAlpha: 200,
            valueTextSize: 15
          }
        }
      ]
    }
  }
)

export const yAxisSelector = createSelector(formatChartLengthSelector, (chart: any) => {
  const axisMaximum = Math.max(chart.map(e => e.get('close'))) * 1.01

  return {
    left: {
      drawGridLines: true,
      textColor: processColor('rgba(255,255,255,0.3)'),
      position: 'INSIDE_CHART',
      drawAxisLine: false,
      labelCount: 3,
      axisMaximum
    },
    right: {
      drawGridLines: false
      // textColor: processColor("rgba(255,255,255,0.3)"),
      // position: "INSIDE_CHART",
      // drawAxisLine: false,
      // labelCount: 3,
      // axisMinimum: 0,
      // axisMaximum: 600
      // labelCountForce: true
      // axisMinimum: 0
      // axisMinimum: rightMin,
      // axisMaximum: rightMax
    }
  }
})

export const xAxisSelector = createSelector(formatChartLengthSelector, (chart: any) => {
  const axisMaximum = chart.size
  return {
    drawLabels: false,
    granularityEnabled: true,
    granularity: 1,
    drawGridLines: false,
    position: 'BOTTOM_INSIDE',
    drawLimitLinesBehindData: false,
    drawAxisLine: false,
    avoidFirstLastClipping: true,
    axisMinimum: 0,
    axisMaximum: axisMaximum - 1,
    textColor: processColor('rgba(255,255,255,0.3)')
  }
})
