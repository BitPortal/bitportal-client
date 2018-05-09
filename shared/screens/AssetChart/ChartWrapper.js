import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  processColor
} from 'react-native'
import { connect } from 'react-redux'
import styles from './styles'
import Colors from 'resources/colors'

import { LineChart } from "react-native-charts-wrapper"

const greenBlue = "rgb(26, 182, 151)"
const petrel = "rgb(59, 145, 153)"

export default class ChartWrapper extends Component {

  state = {
    selectedEntry: ''
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({ ...this.state, selectedEntry: null })
    } else {
      this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
    }

    console.log(event.nativeEvent)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.chartContainer}>
          <LineChart
            style={styles.chartContainer}
            data={{
              dataSets: [
                {
                  values: [
                    { y: 65, x: 0, marker: "65 kg" },
                    { y: 76, x: 1, marker: "77 kg" },
                    { y: 74, x: 2, marker: "76 kg" },
                    { y: 69, x: 3, marker: "74 kg" },
                    { y: 73, x: 4, marker: "76 kg" }
                  ],
                  label: "",
                  config: {
                    mode: "LINEAR", // "LINEAR" "STEPPED" "CUBICBEZIER" "HORIZONTALBEZIER" 
                    drawValues: false,
                    lineWidth: 2,
                    drawCircles: false,
                    circleColor: processColor(petrel),
                    drawCircleHole: false,
                    circleRadius: 5,
                    highlightColor: processColor("transparent"),
                    color: processColor(petrel),
                    drawFilled: true,
                    fillGradient: {
                      colors: [processColor('red'), processColor('blue')],
                      positions: [0, 0.5],
                      angle: 90,
                      orientation: "TOP_BOTTOM"
                    },
                    fillAlpha: 1000,
                    valueTextSize: 15
                  }
                }
              ]
            }}
            chartDescription={{ text: "" }}
            legend={{
              enabled: false
            }}
            marker={{
              enabled: false,
              markerColor: processColor("white"),
              textColor: processColor("black")
            }}
            xAxis={{
              enabled: true,
              granularity: 1,
              drawLabels: true,
              position: "BOTTOM",
              drawAxisLine: true,
              drawGridLines: true,
              fontFamily: "HelveticaNeue-Medium",
              fontWeight: "bold",
              textSize: 12,
              textColor: processColor(Colors.textColor_181_181_181),
              valueFormatter: ["05-01", "05-02", "05-03", "05-03", "05-04"]
            }}
            yAxis={{
              left: {
                enabled: false,
                drawAxisLine: true,
                drawGridLines: false,
                textColor: processColor(Colors.textColor_181_181_181)
              },
              right: {
                enabled: true,
                drawAxisLine: true,
                drawGridLines: false,
                textColor: processColor(Colors.textColor_181_181_181)
              }
            }}
            autoScaleMinMaxEnabled={true}
            animation={{
              durationX: 0,
              durationY: 777,
              easingY: "EaseInOutQuart"
            }}
            drawGridBackground={false}
            drawBorders={false}
            touchEnabled={true}
            dragEnabled={false}
            scaleEnabled={false}
            scaleXEnabled={false}
            scaleYEnabled={false}
            pinchZoom={false}
            doubleTapToZoomEnabled={false}
            dragDecelerationEnabled={true}
            dragDecelerationFrictionCoef={0.99}
            keepPositionOnRotation={false}
            onSelect={this.handleSelect.bind(this)}
            onChange={event => console.log(event.nativeEvent)}
          />
        </View>
      </View>
    )
  }
}
