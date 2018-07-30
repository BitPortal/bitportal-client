import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from 'resources/colors';
import { EXCHANGE_NAMES } from 'constants/market';
import * as tickerActions from 'actions/ticker';
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
        <View>
          <Text style={[styles.text16]}>
            {' '}
            {`${data.price_last} ${data.quote_asset}`}{' '}
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
            Vol: {`${data.quote_volume} ${data.quote_asset}`}
          </Text>
        </View>
      </View>
    </View>
  </TouchableHighlight>
);

@connect(
  state => ({
    listedExchange: state.ticker.get('listedExchange'),
    loading: state.ticker.get('loading')
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
    const { changeMarket, listedExchange, loading } = this.props;
    return (
      <View>
        <View style={styles.marketElementContainer}>
          <Text style={styles.headerText}>Listed Exchange</Text>
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
    );
  }
}
