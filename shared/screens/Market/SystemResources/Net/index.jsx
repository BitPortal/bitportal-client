import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import NavigationBar, { CommonButton } from "components/NavigationBar";
import { connect } from "react-redux";
import { FormattedMessage, IntlProvider } from "react-intl";
import { eosAccountSelector } from "selectors/eosAccount";
import DelegateBandwidthForm from "components/Form/DelegateBandwidthForm/index.new";
import { formatMemorySize } from "utils/format";
import Loading from "components/Loading";
import messages from "resources/messages";
import DescriptionPanel from "components/DescriptionPanel";
import styles from "./styles";
import ResourceBar from "../ResourceBar";

@connect(
  state => ({
    locale: state.intl.get("locale"),

    wallet: state.wallet,
    bandwidth: state.bandwidth,
    eosAccount: eosAccountSelector(state)
  }),
  null,
  null,
  { withRef: true }
)
export default class Net extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    };
  }

  render() {
    const { locale, eosAccount, bandwidth } = this.props;
    const activeEOSAccount = eosAccount.get("data");
    const percent =
      activeEOSAccount.getIn(["net_limit", "available"]) /
      activeEOSAccount.getIn(["net_limit", "max"]);
    const refund = activeEOSAccount.get("refund_request")
      ? activeEOSAccount.getIn(["refund_request", "net_amount"])
      : "0.0000 EOS";
    const delegating = bandwidth.get("delegating");
    const undelegating = bandwidth.get("undelegating");
    const loading = delegating || undelegating;
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
            >
              <View style={styles.progressContaner}>
                <ResourceBar percent={percent} />
                <View style={[styles.totalContainer, styles.between]}>
                  <Text style={styles.text14}>
                    <FormattedMessage id="resource_label_available_total" />
                  </Text>
                  <Text style={styles.text14}>
                    {formatMemorySize(activeEOSAccount.getIn(["net_limit", "available"]))}/
                    {formatMemorySize(activeEOSAccount.getIn(["net_limit", "max"]))}
                  </Text>
                </View>
                <View style={[styles.totalContainer, styles.between, { marginTop: 0 }]}>
                  <Text style={styles.text14}>
                    <FormattedMessage id="resource_label_unstaking" />
                  </Text>
                  <Text style={styles.text14}>{refund}</Text>
                </View>
              </View>
              <DelegateBandwidthForm resource="net" />
              <DescriptionPanel
                title={messages[locale].resource_label_tips}
                description={`${messages[locale].resource_net_text_tips}`}
              />
              {/* <View style={styles.tipsContainer}>
                <Text style={styles.text16}>
                  <FormattedMessage id="resource_label_tips" />
                </Text>
                <Text style={[styles.text14, { marginTop: 15 }]}>
                  <FormattedMessage id="resource_net_text_tips_1" />
                </Text>
                <Text style={[styles.text14, { marginTop: 10 }]}>
                  <FormattedMessage id="resource_net_text_tips_2" />
                </Text>
              </View> */}
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    );
  }
}
