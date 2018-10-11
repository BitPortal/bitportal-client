import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, View, ActivityIndicator } from "react-native";
import AccordionPanel from "components/AccordionPanel";
import { MARKET_DETAIL_KEYS } from "constants/market";
import { IntlProvider, FormattedMessage, FormattedNumber } from "react-intl";
import messages from "resources/messages";
import styles from "./styles";

@connect(
  state => ({
    locale: state.intl.get("locale"),
    token: state.token.get("data"),
    loading: state.token.get("loading")
  }),
  null,
  null,
  {
    withRef: true
  }
)
export default class TokenDetails extends Component {
  render() {
    const { locale, token, loading } = this.props;
    console.log("tokendetails", token);
    return loading ? (
      <View>
        <DetailPanel>
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        </DetailPanel>
      </View>
    ) : (
      <IntlProvider messages={messages[locale]}>
        <View>
          <DescriptionPanel
            messages={messages}
            title="Description"
            description={token.get("description").get(locale)}
          />
          <DetailPanel messages={messages[locale]} title="Token Details" token={token}>
            {token.get("circulating_supply") && (
              <View>
                <View style={[styles.spaceBetween, { marginVertical: 10 }]}>
                  <Text style={styles.keyText}>
                    <FormattedMessage id="circulating_supply" />
                  </Text>
                  <Text style={styles.text14}>
                    <FormattedNumber value={token.get("circulating_supply")} />
                  </Text>
                </View>
                <View style={styles.hairlineSpacer} />
              </View>
            )}
            {token.get("total_supply") && (
              <View>
                <View style={[styles.spaceBetween, { marginVertical: 10 }]}>
                  <Text style={styles.keyText}>
                    <FormattedMessage id="total_supply" />
                  </Text>
                  <Text style={styles.text14}>
                    <FormattedNumber value={token.get("total_supply")} />
                  </Text>
                </View>
                <View style={styles.hairlineSpacer} />
              </View>
            )}
            {token.keySeq().map(
              item =>
                item !== "total_supply" &&
                item !== "circulating_supply" &&
                MARKET_DETAIL_KEYS.includes(item) ? (
                  <View>
                    <View style={[styles.spaceBetween, { marginVertical: 10 }]}>
                      <Text style={styles.keyText}>
                        <FormattedMessage id={item} />
                      </Text>
                      <Text style={styles.text14}>{token.get(item)}</Text>
                    </View>
                    <View style={styles.hairlineSpacer} />
                  </View>
                ) : null
            )}
          </DetailPanel>
        </View>
      </IntlProvider>
    );
  }
}

const DescriptionPanel = props => {
  const { messages, title, description, loading } = props;
  return description ? (
    <IntlProvider messages={messages}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <View style={styles.detailPanelTitle}>
            <Text style={styles.text16}>{title}</Text>
          </View>
          <View style={styles.hairlineSpacer} />
          <View style={styles.textContainer}>
            <Text style={[styles.text14, { textAlign: "justify" }]}>{description}</Text>
          </View>
        </View>
      </View>
    </IntlProvider>
  ) : null;
};

const DetailPanel = props => {
  const { messages, title, loading } = props;
  return (
    <IntlProvider messages={messages}>
      <View style={styles.container}>
        <View style={[styles.cardContainer, { paddingBottom: 20 }]}>
          {title && (
            <View>
              <View style={styles.detailPanelTitle}>
                <Text style={styles.text16}>{title}</Text>
              </View>
              <View style={styles.hairlineSpacer} />
            </View>
          )}
          {props.children}
        </View>
      </View>
    </IntlProvider>
  );
};
