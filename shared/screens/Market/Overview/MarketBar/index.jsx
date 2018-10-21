import React, { Component } from 'react';
import Colors from 'resources/colors';
import { connect } from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { sortFilterSelector } from 'selectors/ticker';
import { bindActionCreators } from 'redux';
import * as tickerActions from 'actions/ticker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DEFAULT_SORT_FILTER } from 'constants/market';
import messages from 'resources/messages';
import styles from './styles';

@connect(
  state => ({
    sortFilter: sortFilterSelector(state),
    exchangeFilter: state.ticker.get('exchangeFilter'),
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
class MarketBar extends Component {
  sortToggle(selector) {
    const { exchangeFilter, sortFilter } = this.props;
    switch (true) {
      case selector === 'percent' && sortFilter === 'price_change_percent_high':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: 'price_change_percent_low'
        });
        break;
      case selector === 'percent' && sortFilter === 'price_change_percent_low':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: DEFAULT_SORT_FILTER
        });
        break;
      case selector === 'percent':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: 'price_change_percent_high'
        });
        break;
      case selector === 'price' && sortFilter === 'current_price_high':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: 'current_price_low'
        });
        break;
      case selector === 'price' && sortFilter === 'current_price_low':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: DEFAULT_SORT_FILTER
        });
        break;
      case selector === 'price':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: 'current_price_high'
        });
        break;
      default:
        break;
    }
  }

  render() {
    const { sortFilter, locale } = this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.headerTitle]}>
          {/* <TouchableOpacity> */}
          <View style={[styles.coin, styles.center, { height: 25 }]}>
            <Text style={[[styles.text14]]}>
              {messages[locale].market_label_market_cap}
              {'  '}
            </Text>
            {/* <View style={{ flexDirection: 'column' }}>
                <View style={{ marginVertical: -6 }}>
                  <Ionicons
                    name="md-arrow-dropup"
                    size={20}
                    color={Colors.textColor_255_255_238}
                  />
                </View>
                <View style={{ marginVertical: -6 }}>
                  <Ionicons
                    name="md-arrow-dropdown"
                    size={20}
                    color={Colors.textColor_255_255_238}
                  />
                </View>
              </View> */}
          </View>
          {/* </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              this.sortToggle('price');
            }}
          >
            <View
              style={[
                styles.price,
                {
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  paddingRight: 10
                }
              ]}
            >
              <Text style={[styles.text14, {}]}>
                {messages[locale].market_label_price}
                {'  '}
              </Text>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ marginVertical: -6 }}>
                  <Ionicons
                    name="md-arrow-dropup"
                    size={20}
                    color={
                      sortFilter === 'current_price_low'
                        ? Colors.textColor_255_255_238
                        : Colors.textColor_181_181_181
                    }
                  />
                </View>
                <View style={{ marginVertical: -6 }}>
                  <Ionicons
                    name="md-arrow-dropdown"
                    size={20}
                    color={
                      sortFilter === 'current_price_high'
                        ? Colors.textColor_255_255_238
                        : Colors.textColor_181_181_181
                    }
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.sortToggle('percent');
            }}
          >
            <View
              style={[
                styles.change,
                {
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  paddingRight: 15
                }
              ]}
            >
              <Text style={[styles.text14]}>
                {messages[locale].market_label_change}
                {'  '}
              </Text>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ marginVertical: -6 }}>
                  <Ionicons
                    name="md-arrow-dropup"
                    size={20}
                    color={
                      sortFilter === 'price_change_percent_low'
                        ? Colors.textColor_255_255_238
                        : Colors.textColor_181_181_181
                    }
                  />
                </View>
                <View style={{ marginVertical: -6 }}>
                  <Ionicons
                    name="md-arrow-dropdown"
                    size={20}
                    color={
                      sortFilter === 'price_change_percent_high'
                        ? Colors.textColor_255_255_238
                        : Colors.textColor_181_181_181
                    }
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default MarketBar;
