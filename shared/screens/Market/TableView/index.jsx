import React, { Component } from 'react'
import { injectIntl, FormattedNumber } from 'react-intl'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import {
  Text,
  View,
  TouchableHighlight,
  VirtualizedList,
  TouchableOpacity
} from 'react-native'
import { sortFilterSelector } from 'selectors/ticker'
import { bindActionCreators } from 'redux'
import * as tickerActions from 'actions/ticker'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FontScale } from 'utils/dimens'
import { filterBgColor } from 'utils'
import { ASSET_FRACTION, DEFAULT_SORT_FILTER } from 'constants/market'
import styles from './styles'

@injectIntl

@connect(
  state => ({
    sortFilter: sortFilterSelector(state),
    exchangeFilter: state.ticker.get('exchangeFilter')
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
export class HeaderTitle extends Component {
  sortToggle(selector) {
    const { exchangeFilter, sortFilter } = this.props
    switch (true) {
      case selector === 'percent' && sortFilter === 'price_change_percent_high':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: 'price_change_percent_low'
        })
        break
      case selector === 'percent' && sortFilter === 'price_change_percent_low':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: DEFAULT_SORT_FILTER
        })
        break
      case selector === 'percent':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: 'price_change_percent_high'
        })
        break
      case selector === 'price' && sortFilter === 'current_price_high':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: 'current_price_low'
        })
        break
      case selector === 'price' && sortFilter === 'current_price_low':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: DEFAULT_SORT_FILTER
        })
        break
      case selector === 'price':
        this.props.actions.setSortFilter({
          exchangeFilter,
          sortFilter: 'current_price_high'
        })
        break
      default:
        break
    }
  }

  render() {
    const { messages, sortFilter } = this.props
    return (
      <View>
        <View style={[styles.headerTitle]}>
          {/* <TouchableOpacity> */}
          <View style={[styles.coin, styles.center, { height: 25 }]}>
            <Text style={[[styles.text14]]}>
              {messages.market_label_market_cap}
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
              this.sortToggle('price')
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
                {messages.market_label_price}
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
              this.sortToggle('percent')
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
                {messages.market_label_change}
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
    )
  }
}

class ListItem extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.data.get('base_asset') !== this.props.data.get('base_asset')
      || nextProps.data.get('price_last') !== this.props.data.get('price_last')
      || nextProps.data.get('price_change_percent')
        !== this.props.data.get('price_change_percent')
    )
  }

  render() {
    const { data, index, itemExtraStyle, onPress } = this.props

    return (
      <TouchableHighlight
        key={index}
        // disabled={true}
        underlayColor={Colors.hoverColor}
        onPress={() => onPress(data)}
      >
        <View style={[styles.listItem, { ...itemExtraStyle }]}>
          <View style={styles.coin}>
            <Text
              style={[
                styles.text16,
                { minWidth: FontScale(25), paddingRight: 10, marginLeft: 10 }
              ]}
            >
              {index + 1}
            </Text>
            <Text style={[styles.text16, { marginRight: 10 }]}>
              {data.get('base_asset')}
            </Text>
          </View>
          <View
            style={[
              styles.price,
              {
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row'
              }
            ]}
          >
            <Text style={[styles.text16, { marginHorizontal: 10 }]}>
              <FormattedNumber
                value={data.get('price_last')}
                maximumFractionDigits={ASSET_FRACTION[data.get('quote_asset')]}
                minimumFractionDigits={ASSET_FRACTION[data.get('quote_asset')]}
              />
            </Text>
          </View>
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
            <View
              style={[
                styles.center,
                {
                  minWidth: 70,
                  borderRadius: 4,
                  padding: 7,
                  backgroundColor: filterBgColor(
                    data.get('price_change_percent')
                  )
                }
              ]}
            >
              <Text
                style={[styles.text16, { color: Colors.textColor_255_255_238 }]}
              >
                <FormattedNumber
                  value={data.get('price_change_percent')}
                  maximumFractionDigits={2}
                  minimumFractionDigits={2}
                />
                %
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default class TableView extends Component {
  render() {
    const { data, refreshing, onRefresh, onPress } = this.props

    return (
      <View style={styles.scrollContainer}>
        <VirtualizedList
          data={data}
          style={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          getItem={(items, index) => (items.get ? items.get(index) : items[index])
          }
          getItemCount={items => items.count() || 0}
          keyExtractor={item => String(item.get('symbol'))}
          renderItem={({ item, index }) => (
            <ListItem key={index} data={item} index={index} onPress={onPress} />
          )}
        />
      </View>
    )
  }
}
