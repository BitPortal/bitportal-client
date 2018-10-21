import React, { Component } from "react";
import {
  Text,
  View,
  processColor,
  TouchableWithoutFeedback,
  InteractionManager,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as chartActions from "actions/chart";
import {
  formatChartDatasetSelector,
  yAxisSelector,
  xAxisSelector
} from "selectors/chart";
import { LineChart } from "react-native-charts-wrapper";
import { RANGES } from "constants/chart";
import {
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS
} from "utils/dimens";
import styles from "./styles";

const CHART_DESCRIPTION = {
  text: "Bitportal",
  textColor: processColor("rgba(255,255,255,0.3)")
};

@connect(state => ({
  locale: state.intl.get("locale"),
  chartData: state.chart.get("data"),
  loading: state.chart.get("loading"),
  data: formatChartDatasetSelector(state),
  yAxis: yAxisSelector(state),
  xAxis: xAxisSelector(state)
}))
export default class TokenChart extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      marker: {
        enabled: true,
        digits: 2,
        backgroundTint: processColor("teal"),
        markerColor: processColor("#F0C0FF8C"),
        textColor: processColor("white")
      },

      legend: { enabled: false }
      // visibleRange: {x: {min: 1, max: 2}}
    };
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

  handleData = () => this.props.data &&
      this.props.data.dataSets &&
      this.props.data.dataSets.values.length !== 0
      ? this.props.data
      : this.props.data;

  render() {
    const { loading, data } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <View style={styles.chartContainer}>
            {loading ? (
              <View style={styles.centerFlex}>
                <ActivityIndicator size="large" />
              </View>
            ) : data.dataSets[0].values.length === 0 ? (
              <View style={styles.centerFlex}>
                <Text>Chart Not Available</Text>
              </View>
            ) : (
              <LineChart
                style={{ flex: 1 }}
                data={data}
                chartDescription={{ text: "" }}
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
                dragDecelerationFrictionCoef={0.99}
                ref="chartt"
                keepPositionOnRotation={false}
                // onSelect={this.handleSelect.bind(this)}
                onChange={event => console.log(event.nativeEvent)}
                viewPortOffsets={{ left: 0, top: 10, right: 0, bottom: 5 }}
              />
            )}
          </View>
          <RangeBar />
        </View>
      </View>
    );
  }
}

@connect(
  state => ({
    locale: state.intl.get("locale"),
    token: state.token.get("data"),
    loading: state.chart.get("loading"),
    range: state.chart.get("range")
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
      this.props.actions.changeChartRange(range);
    });
  };

  render() {
    const { range } = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 30,
          paddingVertical: 10,
          width: FLOATING_CARD_WIDTH
        }}
      >
        {RANGES.map(e => (
          <TouchableWithoutFeedback
            key={e}
            onPress={() => {
              this.changeChartRange(e);
            }}
          >
            <View key={e}>
              <Text
                style={{ color: range === e ? "rgb(55,128,193)" : "white", fontSize: 12 }}
              >
                {e}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  }
}
