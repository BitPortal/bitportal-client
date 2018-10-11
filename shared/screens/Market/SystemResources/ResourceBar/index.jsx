import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import Colors from "resources/colors";
import LinearGradientContainer from "components/LinearGradientContainer";
import { FLOATING_CARD_WIDTH, FontScale } from "utils/dimens";

const styles = StyleSheet.create({
  container: {
    width: FLOATING_CARD_WIDTH - 64,
    height: 38,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  }
});

export default class ResourceBar extends Component {
  render() {
    const { colors, percent, extraStyle } = this.props;
    const mrLeft = percent * (FLOATING_CARD_WIDTH - 64) > 40 ? -35 : 5;
    const truePercent = isNaN(parseInt(percent, 10)) ? 0 : percent;
    return (
      <View
        style={[styles.container, { backgroundColor: Colors.mainThemeColor }, { ...extraStyle }]}
      >
        <LinearGradientContainer
          type="right"
          colors={colors}
          style={[
            styles.container,
            { alignItems: "center", width: percent * (FLOATING_CARD_WIDTH - 64) }
          ]}
        />
        <Text style={[styles.text12, { marginLeft: mrLeft }]}>
          {parseInt(truePercent * 100, 10)}%
        </Text>
      </View>
    );
  }
}
