import React, { Component } from 'react'
import { FormattedNumber } from 'react-intl'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { Text, View, TouchableHighlight, VirtualizedList } from 'react-native'
import { sortFilterSelector, tickerSelector } from 'selectors/ticker'
import { bindActionCreators } from 'redux'
import * as tickerActions from 'actions/ticker'
import * as tokenActions from 'actions/token'
import FastImage from 'react-native-fast-image'

import { FontScale } from 'utils/dimens'
import abbreviate from 'number-abbreviate'
import { filterBgColor } from 'utils'
import { ASSET_FRACTION, DEFAULT_SORT_FILTER } from 'constants/market'
import Images from 'resources/images'
import messages from 'resources/messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)
class ListItem extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.item.get('price_usd') !== this.props.item.get('price_usd') ||
      nextProps.item.get('volume_24h_usd') !== this.props.item.get('volume_24h_usd') ||
      nextProps.item.get('market_cap_usd') !== this.props.item.get('market_cap_usd') ||
      nextProps.item.get('available_supply') !== this.props.item.get('available_supply') ||
      nextProps.item.get('percent_change_1h') !== this.props.item.get('percent_change_1h') ||
      nextProps.item.get('percent_change_7d') !== this.props.item.get('percent_change_7d')
    )
  }

  render() {
    const { locale, item, index, itemExtraStyle, onPress } = this.props
    const price_usd = item.get('price_usd')
    console.log('itemm', item.toJS())
    return (
      <TouchableHighlight key={index} underlayColor={Colors.hoverColor} onPress={() => onPress(item)}>
        <View style={[styles.listItem, { ...itemExtraStyle }]}>
          <View style={{ paddingRight: 10, marginLeft: 10 }}>
            {/* <FastImage
              style={styles.icon}
              // source={token.get("") || Images.coin_logo_default}
              source={Images.coin_logo_default}
            /> */}
            <FastImage
              style={styles.icon}
              source={{
                uri: `https://cdn.bitportal.io/tokenicon/32/color/${item.get('symbol')?.toLowerCase()}.png`
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'column'
            }}
          >
            <View style={styles.coin}>
              <Text style={[styles.text17, { marginRight: 5 }]}>{item.get('symbol')}</Text>
              <Text numberOfLines={1} style={[styles.nameWrapper, styles.text14, { marginRight: 1 }]}>
                {item.get('name')}
              </Text>
            </View>
            <View style={styles.coin}>
              <Text style={[styles.text14, { marginRight: 5 }]}>
                {locale === 'en' ? 'M Cap' : messages[locale].market_label_market_cap}
              </Text>
              <Text style={[styles.text14, { marginRight: 1 }]}>{abbreviate(item.get('market_cap_usd'), 2)}</Text>
            </View>
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
                value={item.get('price_usd')}
                maximumFractionDigits={price_usd < 10 ? 6 : ASSET_FRACTION.USD}
                minimumFractionDigits={price_usd < 10 ? 4 : ASSET_FRACTION.USD}
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
                  padding: 4,
                  backgroundColor: filterBgColor(item.get('percent_change_1h'))
                }
              ]}
            >
              <Text style={[styles.text16, { color: Colors.textColor_255_255_238 }]}>
                <FormattedNumber
                  value={item.get('percent_change_1h')}
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

@connect(
  state => ({
    locale: state.intl.get('locale'),
    ticker: tickerSelector(state),
    loading: state.ticker.get('loading'),
    exchangeFilter: state.ticker.get('exchangeFilter'),
    sortFilter: sortFilterSelector(state),
    quoteAssetFilter: state.ticker.get('quoteAssetFilter'),
    baseAsset: state.ticker.get('baseAsset'),
    searchTerm: state.ticker.get('searchTerm'),
    marketCategory: state.ticker.get('marketCategory')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...tickerActions,
        ...tokenActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class MarketList extends Component {
  onRefresh = () => {
    this.props.actions.getTickersRequested({
      // sort: this.props.sortFilter,
      limit: 200
    })
  }

  componentDidAppear() {
    this.onRefresh()
  }

  render() {
    const { data, ticker, loading, onPress } = this.props
    console.log('marketlist', ticker)
    return (
      <View style={styles.scrollContainer}>
        <VirtualizedList
          data={ticker}
          style={styles.list}
          refreshing={loading}
          onRefresh={this.onRefresh}
          getItem={(items, index) => (items.get ? items.get(index) : items[index])}
          getItemCount={items => items.count() || 0}
          keyExtractor={item => String(item.get('symbol'))}
          renderItem={({ item, index }) => <ListItem key={index} item={item} index={index} onPress={onPress} />}
        />
      </View>
    )
  }
}
