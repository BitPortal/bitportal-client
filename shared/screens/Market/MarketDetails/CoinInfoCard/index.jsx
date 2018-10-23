import React, { Component } from 'react'
import { Text, View } from 'react-native'
import BPImage from 'components/BPNativeComponents/BPImage'
import Colors from 'resources/colors'
import { FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'
import { exchangeTickerSelector } from 'selectors/ticker'
import { ASSET_FRACTION } from 'constants/market'
import { filterBgColor } from 'utils'
import Images from 'resources/images'
import styles from './styles'

@connect(state => ({
  ticker: exchangeTickerSelector(state),
  baseAsset: state.ticker.get('baseAsset'),
  quoteAssetFilter: state.ticker.get('quoteAssetFilter'),
  token: state.token.get('data'),
  locale: state.intl.get('locale')
}))
export default class CoinInfoCard extends Component {
  render() {
    const { item, locale } = this.props

    // const price_change_percent = item.get('price_change_percent')
    // const price_last = item.get('price_last')
    // const base_volume = item.get('base_volume')
    // const quote_volume = item.get('quote_volume')
    // const quote_asset = item.get('quote_asset')
    // const base_asset = item.get('base_asset')
    // const name_zh = token.get('name_zh')
    // const name_en = token.get('name_en')

    return (
      <View style={styles.cardContainer}>
        <View style={styles.titleWrapper}>
          <BPImage style={styles.icon} source={Images.coin_logo_default} />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.text18, { fontWeight: 'bold' }]}>
              {locale === 'zh' ? 'name_zh' || 'name_en' : 'name_en'}
            </Text>
            <Text style={[styles.text16, {}]}>base_asset</Text>
          </View>
        </View>
        <View style={[styles.spaceBetween, { paddingVertical: 5 }]}>
          <Text style={styles.text18}>
            <FormattedNumber
              value={item.price_usd}
              maximumFractionDigits={ASSET_FRACTION.USD}
              minimumFractionDigits={ASSET_FRACTION.USD}
            />{' '}
            {'USD'}
          </Text>
          <View
            style={[
              styles.center,
              {
                minWidth: 70,
                borderRadius: 4,
                padding: 2,
                backgroundColor: filterBgColor(item.percent_change_1h)
              }
            ]}
          >
            <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
              <FormattedNumber value={item.percent_change_1h} maximumFractionDigits={2} minimumFractionDigits={2} />%
            </Text>
          </View>
        </View>
        <View style={[styles.spaceBetween, { marginTop: 4 }]}>
          <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
            Vol:{' '}
            <FormattedNumber
              value={item.volume_24h_usd}
              maximumFractionDigits={ASSET_FRACTION.USD}
              minimumFractionDigits={ASSET_FRACTION.USD}
            />{' '}
            {'quote_asset'}
          </Text>
          <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
            {' '}
            <FormattedNumber
              value={item.volume_24h_usd}
              maximumFractionDigits={ASSET_FRACTION.USD}
              minimumFractionDigits={ASSET_FRACTION.USD}
            />{' '}
            {'base_asset'}
          </Text>
        </View>
      </View>
    )
  }
}
