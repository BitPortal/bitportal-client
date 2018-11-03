import React, { Component } from 'react'
import { Text, View, processColor, TouchableWithoutFeedback, InteractionManager, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as chartActions from 'actions/chart'
import { formatChartDatasetSelector, yAxisSelector, xAxisSelector } from 'selectors/chart'
import { LineChart } from 'react-native-charts-wrapper'
import { RANGES, CHART_RANGES } from 'constants/chart'
import { FLOATING_CARD_WIDTH } from 'utils/dimens'
import { IntlProvider, FormattedMessage } from 'react-intl'

import messages from 'resources/messages'
import styles from './styles'

const CHART_DESCRIPTION = {
  text: 'Bitportal',
  textColor: processColor('rgba(255,255,255,0.3)')
}

@connect(state => ({
  locale: state.intl.get('locale'),
  chartData: state.chart.get('data'),
  loading: state.chart.get('loading'),
  data: formatChartDatasetSelector(state),
  yAxis: yAxisSelector(state),
  xAxis: xAxisSelector(state)
}))
export default class TokenChart extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      marker: {
        enabled: true,
        digits: 2,
        backgroundTint: processColor('teal'),
        markerColor: processColor('#F0C0FF8C'),
        textColor: processColor('white')
      },

      legend: { enabled: false }
      // visibleRange: {x: {min: 1, max: 2}}
    }
  }

  componentDidMount() {}

  // handleSelect(event) {
  //   const entry = event.nativeEvent;
  //   if (entry == null) {
  //     this.setState({ ...this.state, selectedEntry: null });
  //   } else {
  //     this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) });
  //   }
  //
  //   console.log(event.nativeEvent);
  // }

  handleData = () =>
    this.props.data && this.props.data.dataSets && this.props.data.dataSets.values.length !== 0
      ? this.props.data
      : this.props.data

  render() {
    const { loading, data, locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <View style={styles.cardContainer}>
            <View style={styles.chartContainer}>
              {loading ? (
                <View style={styles.centerFlex}>
                  <ActivityIndicator size="large" />
                </View>
              ) : data.dataSets[0].values.length === 0 ? (
                <View style={styles.centerFlex}>
                  <Text style={styles.text14}>
                    <FormattedMessage id="market_chart_text_notavailable" />
                  </Text>
                </View>
              ) : (
                <LineChart
                  style={{ flex: 1 }}
                  data={data}
                  legend={this.state.legend}
                  marker={this.state.marker}
                  xAxis={this.props.xAxis}
                  yAxis={this.props.yAxis}
                  // drawGridBackground={false}
                  // borderColor={processColor("transparent")}
                  // borderWidth={0}
                  drawBorders={false}
                  autoScaleMinMaxEnabled={true}
                  // touchEnabled={true}
                  // dragEnabled={true}
                  // scaleEnabled={true}
                  scaleXEnabled={true}
                  scaleYEnabled={false}
                  pinchZoom={true}
                  doubleTapToZoomEnabled={true}
                  highlightPerTapEnabled={true}
                  highlightPerDragEnabled={true}
                  chartDescription={CHART_DESCRIPTION}
                  // visibleRange={this.state.visibleRange}
                  dragDecelerationEnabled={true}
                  dragDecelerationFrictionCoef={0.89}
                  ref="chartt"
                  keepPositionOnRotation={false}
                  // onSelect={this.handleSelect.bind(this)}
                  onChange={event => {}}
                  viewPortOffsets={{ left: 0, top: 10, right: 0, bottom: 5 }}
                />
              )}
            </View>
            <RangeBar />
          </View>
        </View>
      </IntlProvider>
    )
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    token: state.token.get('data'),
    loading: state.chart.get('loading'),
    range: state.chart.get('range')
    // ticker: tokenTickerSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...chartActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
class RangeBar extends Component {
  changeChartRange = range => {
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.changeChartRange(range)
    })
  }

  render() {
    const { range, locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.rangeBar}>
          {RANGES.map(e => (
            <TouchableWithoutFeedback
              key={e}
              onPress={() => {
                this.changeChartRange(e)
              }}

              // style={styles.rangeButtonWrapper}
            >
              <View key={e} style={styles.rangeButtonWrapper}>
                <Text style={{ color: range === e ? 'rgb(55,128,193)' : 'white', fontSize: 12 }}>
                  <FormattedMessage id={`market_chart_text_${CHART_RANGES[e]}`} />
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </IntlProvider>
    )
  }
}