import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import Colors from "resources/colors";
import { filterBgColor } from "utils";
import { ASSET_FRACTION } from "constants/market";
import { IntlProvider, FormattedMessage, FormattedNumber } from "react-intl";
import { tokenTickerSelector } from "selectors/ticker";
import abbreviate from "number-abbreviate";

import Images from "resources/images";

import messages from "resources/messages";
import styles from "./styles";

const Tag = props => (
  <View style={styles.tag}>
    <Text style={{ fontSize: 12, textAlign: "center", color: Colors.textColor_255_255_238 }}>
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
  constructor() {
    super();

    this.state = { priceChangeAverage: null };
  }

  componentDidMount() {
    // this.calculatePriceChangeAverage();
  }

  // calculatePriceChangeAverage() {
  //   const { ticker } = this.props;
  //   let result = 0;
  //   ticker.forEach(item => {
  //     result += item.get("price_change_percent");
  //   });
  //   result /= ticker.count();
  //   this.setState({ priceChangeAverage: result });
  // }

  calculateListedExchangeinUSD() {}

  render() {
    const { token, ticker, locale } = this.props;

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <View style={styles.cardContainer}>
            <View style={styles.titleWrapper}>
              <FastImage style={styles.icon} source={token.get("") || Images.coin_logo_default} />
              <View
                style={{
                  flex: 1,
                  flexDirection: "row"
                }}
              >
                <View style={{ flex: 1, marginLeft: 10, justifyContent: "center" }}>
                  <Text style={[styles.text16, { fontWeight: "bold" }]}>
                    {locale === "zh"
                      ? token.get("name_zh") && token.get("name_zh").trim()
                      : token.get("name_en") && token.get("name_en")}
                  </Text>
                </View>
                <View
                  style={[
                    styles.row,
                    { maxWidth: 150, flexWrap: "wrap", justifyContent: "flex-end" }
                  ]}
                >
                  {locale === "zh" &&
                  token.get("tags") &&
                  token.get("tags").get("zh") &&
                  token.get("tags").get("zh").length !== 0
                    ? token
                        .get("tags")
                        .get("zh")
                        .map(item => <Tag key={item} tag={item} />)
                    : token.get("tags") &&
                      token.get("tags").get("en") &&
                      token.get("tags").get("en").length !== 0 &&
                      token
                        .get("tags")
                        .get("en")
                        .map(item => <Tag key={item} tag={item} />)}
                </View>
              </View>
            </View>
            <View style={[styles.spaceBetween, { paddingVertical: 5 }]}>
              <Text style={styles.text26}>
                {`$ `}
                {
                  <FormattedNumber
                    value={ticker.get("price_usd")}
                    maximumFractionDigits={ASSET_FRACTION.USD}
                    minimumFractionDigits={ASSET_FRACTION.USD}
                  />
                }
              </Text>
              <View style={[styles.column, { alignItems: "flex-end" }]}>
                <PercentageChange value={ticker.get("percent_change_1h")} timePeriod="1H" />
                <PercentageChange value={ticker.get("percent_change_24h")} timePeriod="24H" />
                <PercentageChange value={ticker.get("percent_change_7d")} timePeriod="7D" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.innerCardContainer}>
                <Text style={[styles.keyText]}>Market Cap</Text>
                <Text style={{ color: "white" }}>
                  {`$${abbreviate(ticker.get("market_cap_usd"), 2)}`}
                </Text>
              </View>
              <View style={styles.innerCardContainer}>
                <Text style={styles.keyText}>Market Cap</Text>
                <Text style={{ color: "white" }}>
                  {`$${abbreviate(ticker.get("volume_24h_usd"), 2)}`}
                </Text>
              </View>
            </View>

            {/* <View style={[styles.spaceBetween, { marginTop: 4 }]}>
              <Text style={[styles.text14, { color: Colors.textColor_142_142_147 }]}>
                {token.get("market_label_market_cap") && (
                  <FormattedMessage id="market_label_market_cap" />
                )}
                {token.get("market_label_market_cap") && ` ${token.get("market_label_market_cap")}`}
              </Text>
            </View>
            <View style={[styles.spaceBetween, { marginTop: 4 }]}>
              <Text style={[styles.text14, { color: Colors.textColor_142_142_147 }]}>
                {token.get("market_token_detail_label_24h_volumn") && (
                  <FormattedMessage id="market_token_detail_label_24h_volumn" />
                )}
                {token.get("market_token_detail_label_24h_volumn") &&
                  ` ${token.get("market_token_detail_label_24h_volumn")}`}
              </Text>
            </View> */}
          </View>
        </View>
      </IntlProvider>
    );
  }
}

const PercentageChange = props => {
  const { value, timePeriod } = props;
  return (
    <View style={[styles.center, { margin: 1 }]}>
      <Text style={[styles.text14, { color: filterBgColor(value), fontWeight: "bold" }]}>
        {value > 0 ? "+" : null}
        <FormattedNumber value={value} maximumFractionDigits={2} minimumFractionDigits={2} />%{"  "}
        <View style={styles.miniTag}>
          <Text style={{ fontSize: 12, textAlign: "center", color: Colors.textColor_255_255_238 }}>
            {timePeriod}
          </Text>
        </View>
      </Text>
    </View>
  );
};
