import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import Colors from "resources/colors";
import { filterBgColor } from "utils";
import { ASSET_FRACTION } from "constants/market";
import { IntlProvider, FormattedNumber } from "react-intl";
import abbreviate from "number-abbreviate";

import messages from "resources/messages";
import styles from "./styles";

const Tag = props => (
  <View style={styles.tag}>
    <Text
      style={{
        fontSize: 12,
        textAlign: "center",
        color: Colors.textColor_255_255_238
      }}
    >
      {props.tag}
    </Text>
  </View>
);

@connect(
  state => ({
    locale: state.intl.get("locale"),
    token: state.token.get("data"),
    loading: state.token.get("loading")
    // ticker: tokenTickerSelector(state),
  }),
  null,
  null,
  { withRef: true }
)
export default class TokenCard extends Component {
  render() {
    const { token, ticker, locale } = this.props;
    console.log("TokenCard", this.props, token.size === 0);
    const tags = token.get("tags");

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <View style={styles.cardContainer}>
            <View style={styles.titleWrapper}>
              <FastImage
                style={styles.icon}
                source={{uri:`https://cdn.bitportal.io/tokenicon/128/color/${token.get("symbol")?.toLowerCase()}.png`}}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: "row"
                }}
              >
                <View
                  style={{ flex: 1, marginLeft: 10, justifyContent: "center" }}
                >
                  <Text style={[styles.text16, { fontWeight: "bold" }]}>
                    {token.size === 0
                      ? ticker.get("symbol")
                      : locale === "zh"
                        ? token.get("name_zh") && token.get("name_zh").trim()
                        : token.get("name_en") && token.get("name_en")}
                  </Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      maxWidth: 150,
                      flexWrap: "wrap",
                      justifyContent: "flex-end"
                    }
                  ]}
                >
                  {locale === "zh" &&
                  tags &&
                  tags.get("zh") &&
                  tags.get("zh").length !== 0
                    ? tags.get("zh").map(item => <Tag key={item} tag={item} />)
                    : tags &&
                      tags.get("en") &&
                      tags.get("en").length !== 0 &&
                      tags.get("en").map(item => <Tag key={item} tag={item} />)}
                </View>
              </View>
            </View>
            <View style={[styles.spaceBetween]}>
              <Text style={styles.text26}>
                {`$ `}
                {
                  <FormattedNumber
                    value={ticker.get("price_usd")}
                    maximumFractionDigits={
                      ticker.get("price_usd") < 10 ? 6 : ASSET_FRACTION.USD
                    }
                    minimumFractionDigits={
                      ticker.get("price_usd") < 10 ? 4 : ASSET_FRACTION.USD
                    }
                  />
                }
              </Text>
              <View style={[styles.column, { alignItems: "flex-end" }]}>
                <PercentageChange
                  value={ticker.get("percent_change_1h")}
                  timePeriod="1H"
                />
                <PercentageChange
                  value={ticker.get("percent_change_24h")}
                  timePeriod="24H"
                />
                <PercentageChange
                  value={ticker.get("percent_change_7d")}
                  timePeriod="7D"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.innerCardContainer}>
                <Text style={[styles.keyText]}>Market Cap</Text>
                <Text style={{ color: "white" }}>{`$${abbreviate(
                  ticker.get("market_cap_usd"),
                  2
                )}`}</Text>
              </View>
              <View style={styles.innerCardContainer}>
                <Text style={styles.keyText}>Market Cap</Text>
                <Text style={{ color: "white" }}>{`$${abbreviate(
                  ticker.get("volume_24h_usd"),
                  2
                )}`}</Text>
              </View>
            </View>
          </View>
        </View>
      </IntlProvider>
    );
  }
}

const PercentageChange = props => {
  const { value, timePeriod } = props;
  return (
    <View style={[styles.row, { margin: 1 }]}>
      <Text
        style={[
          styles.text14,
          { color: filterBgColor(value), fontWeight: "bold" }
        ]}
      >
        {value > 0 ? "+" : null}
        <FormattedNumber
          value={value}
          maximumFractionDigits={2}
          minimumFractionDigits={2}
        />
        %{"  "}
      </Text>
      <View style={styles.miniTag}>
        <Text
          style={{
            fontSize: 12,
            textAlign: "center",
            color: Colors.textColor_255_255_238
          }}
        >
          {timePeriod}
        </Text>
      </View>
    </View>
  );
};
