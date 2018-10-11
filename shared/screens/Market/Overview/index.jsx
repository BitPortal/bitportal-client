import React, { Component } from "react";
import { View, Text, InteractionManager } from "react-native";
import tickerData from "screens/Market/tickerData.json";
import { Navigation } from "react-native-navigation";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { sortFilterSelector } from "selectors/ticker";
import * as tokenActions from "actions/token";
import MarketList from "./MarketList";
import MarketBar from "./MarketBar";

@connect(
  state => ({
    sortFilter: sortFilterSelector(state),
    exchangeFilter: state.ticker.get("exchangeFilter")
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...tokenActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
class Overview extends Component {
  pressListItem = item => {
    //Umeng analytics
    // const symbol = item.get('symbol');
    InteractionManager.runAfterInteractions(() => {
      // this.props.actions.selectCurrentPair(item);
      // this.props.actions.selectBaseAsset(baseAsset);
      this.props.actions.getTokenDetailRequested({ symbol: item.get("symbol") });
      Navigation.push(this.props.componentId, {
        component: {
          name: "BitPortal.TokenPage",
          passProps: { item }
        }
      });
    });
  };

  render() {
    return (
      <View>
        <MarketBar />
        <MarketList data={tickerData} onPress={this.pressListItem} />
      </View>
    );
  }
}

export default Overview;
