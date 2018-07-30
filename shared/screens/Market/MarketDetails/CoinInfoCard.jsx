import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Colors from 'resources/colors';
import { FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';
import { exchangeTickerSelector } from 'selectors/ticker';
import { bindActionCreators } from 'redux';
import { ASSET_FRACTION } from 'constants/market';
import styles from './styles';

const filterBgColor = (data) => {
  if (data && parseFloat(data) > 0) {
    return Colors.bgColor_104_189_57;
  } else if (data && parseFloat(data) < 0) {
    return Colors.bgColor_255_50_50;
  }

  return Colors.bgColor_59_59_59;
};

@connect(
  state => ({
    ticker: exchangeTickerSelector(state),
    baseAsset: state.ticker.get('baseAsset'),
    quoteAssetFilter: state.ticker.get('quoteAssetFilter')
  })
  // dispatch => ({
  //   actions: bindActionCreators(
  //     {
  //       ...chartActions
  //     },
  //     dispatch
  //   )
  // }),
  // null,
  // { withRef: true }
)
export default class CoinInfoCard extends Component {
  render() {
    const { baseAsset, ticker, item, listedExchange } = this.props;
    const price_change_percent = item.get('price_change_percent');
    const price_last = item.get('price_last');
    const base_volume = item.get('base_volume');
    const quote_volume = item.get('quote_volume');
    const quote_asset = item.get('quote_asset');
    const base_asset = item.get('base_asset');
    console.log('price_last', price_last, 'base_asset', base_asset);
    return (
      <View style={styles.cardContainer}>
        <View style={styles.titleWrapper}>
          <View style={styles.iconPlacerholder}>
            <Text>LOGO</Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.text18, { fontWeight: 'bold' }]}>
              Full Name
            </Text>
            <Text style={[styles.text16, {}]}>{base_asset}</Text>
          </View>
        </View>
        <View style={[styles.spaceBetween, { paddingVertical: 5 }]}>
          <Text style={styles.text18}>
            <FormattedNumber
              value={price_last}
              maximumFractionDigits={ASSET_FRACTION[quote_asset]}
              minimumFractionDigits={ASSET_FRACTION[quote_asset]}
            />{' '}
            {quote_asset}
          </Text>
          <View
            style={[
              styles.center,
              {
                minWidth: 70,
                borderRadius: 4,
                padding: 2,
                backgroundColor: filterBgColor(price_change_percent)
              }
            ]}
          >
            <Text
              style={[styles.text14, { color: Colors.textColor_255_255_238 }]}
            >
              <FormattedNumber
                value={price_change_percent}
                maximumFractionDigits={2}
                minimumFractionDigits={2}
              />
              %
            </Text>
          </View>
        </View>

        <View style={[styles.spaceBetween, { marginTop: 4 }]}>
          <Text
            style={[styles.text14, { color: Colors.textColor_255_255_238 }]}
          >
            Vol:{' '}
            <FormattedNumber
              value={quote_volume}
              maximumFractionDigits={ASSET_FRACTION[quote_asset]}
              minimumFractionDigits={ASSET_FRACTION[quote_asset]}
            />{' '}
            {quote_asset}
          </Text>
          <Text
            style={[styles.text14, { color: Colors.textColor_255_255_238 }]}
          >
            {' '}
            <FormattedNumber
              value={base_volume}
              maximumFractionDigits={ASSET_FRACTION[base_asset]}
              minimumFractionDigits={ASSET_FRACTION[base_asset]}
            />{' '}
            {base_asset}
          </Text>
        </View>
      </View>
    );
  }
}
