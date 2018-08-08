import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedNumber, IntlProvider, FormattedMessage } from 'react-intl';
import Colors from 'resources/colors';
import { EXCHANGE_NAMES } from 'constants/market';
import { ASSET_FRACTION } from 'constants/market';
import * as tickerActions from 'actions/ticker';
import messages from './messages';

import styles from './styles';

const MarketElement = ({ onPress, data }) => (
  <TouchableHighlight
    // onPress={() => onPress(data)}
    underlayColor={Colors.hoverColor}
  >
    <View style={styles.marketElementContainer}>
      <View style={styles.spaceBetween}>
        <View>
          <Text style={styles.text18}> {EXCHANGE_NAMES[data.exchange]} </Text>
        </View>
        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
          <Text style={[styles.text16]}>
            {' '}
            <FormattedNumber
              value={data.price_last}
              maximumFractionDigits={ASSET_FRACTION[data.quote_asset]}
              minimumFractionDigits={ASSET_FRACTION[data.quote_asset]}
            />
            {` ${data.quote_asset}`}
          </Text>
          <Text
            style={[
              styles.text14,
              {
                color: Colors.textColor_142_142_147,
                textAlign: 'right',
                marginRight: 4
              }
            ]}
          >
            Vol:{' '}
            <FormattedNumber
              value={data.quote_volume}
              maximumFractionDigits={ASSET_FRACTION[data.quote_asset]}
              minimumFractionDigits={ASSET_FRACTION[data.quote_asset]}
            />
            {` ${data.quote_asset}`}
          </Text>
        </View>
      </View>
    </View>
  </TouchableHighlight>
);

@connect(
  state => ({
    listedExchange: state.ticker.get('listedExchange'),
    loading: state.ticker.get('loading'),
    locale: state.intl.get('locale')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...tickerActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class MarketList extends Component {
  componentWillUnmount() {
    this.props.actions.deleteListedExchange();
  }

  render() {
    const { changeMarket, listedExchange, loading, locale } = this.props;
    return (
      <IntlProvider messages={messages[locale]}>
        <View>
          <View style={styles.marketElementContainer}>
            <Text style={styles.headerText}>
              <FormattedMessage id="listed_exchange" />
            </Text>
          </View>
          {loading ? (
            <View style={styles.loadingSymbol}>
              <ActivityIndicator />
            </View>
          ) : (
            listedExchange.map(data => (
              <MarketElement
                key={data.market + data.exchange}
                data={data}
                onPress={e => changeMarket(e)}
              />
            ))
          )}
        </View>
      </IntlProvider>
    );
  }
}
