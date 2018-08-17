import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, Image } from 'react-native'
import Colors from 'resources/colors'
import { filterBgColor } from 'utils'
import { ASSET_FRACTION } from 'constants/market'
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl'
import { tokenTickerSelector } from 'selectors/ticker'
import Images from 'resources/images'

import styles from './styles'
import messages from './messages'

const Tag = props => (
  <View style={styles.tag}>
    <Text style={{ textAlign: 'center', color: Colors.textColor_89_185_226 }}>
      {props.tag}
    </Text>
  </View>
)

@connect(
  state => ({
    locale: state.intl.get('locale'),
    token: state.token.get('data'),
    loading: state.token.get('loading'),
    ticker: tokenTickerSelector(state),
    currentPair: state.ticker.get('currentPair')
  }),
  null,
  null,
  { withRef: true }
)
export default class CoinInfoCard extends Component {
  constructor() {
    super()

    this.state = { priceChangeAverage: null }
  }

  componentDidMount() {
    this.calculatePriceChangeAverage()
  }

  calculatePriceChangeAverage() {
    const { ticker } = this.props
    let result = 0
    ticker.toJS().forEach((item) => {
      result += item.price_change_percent
    })
    result /= ticker.toJS().length
    this.setState({ priceChangeAverage: result })
  }

  calculateListedExchangeinUSD() {}

  render() {
    const {
      name_en,
      name_zh,
      tags,
      market_cap,
      volume_24h
    } = this.props.token.toJS()

    // const { price_change_percent } = this.props.ticker.toJS();
    const { locale } = this.props
    const {
      price_last,
      quote_asset,
      base_asset
    } = this.props.currentPair.toJS()

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.cardContainer}>
          <View style={styles.titleWrapper}>
            <Image style={styles.icon} source={Images.coin_logo_default} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.text18, { fontWeight: 'bold' }]}>
                {locale === 'zh' ? name_zh && name_zh : name_en && name_en}
              </Text>
              <Text style={[styles.text16, {}]}>{base_asset}</Text>
            </View>
          </View>
          <View style={[styles.spaceBetween, { paddingVertical: 5 }]}>
            <Text style={styles.text18}>
              {
                <FormattedNumber
                  value={price_last}
                  maximumFractionDigits={ASSET_FRACTION[quote_asset]}
                  minimumFractionDigits={ASSET_FRACTION[quote_asset]}
                />
              }
              {` ${quote_asset}`}
            </Text>
            <View
              style={[
                styles.center,
                {
                  minWidth: 70,
                  borderRadius: 4,
                  padding: 2,
                  backgroundColor: filterBgColor(this.state.priceChangeAverage)
                }
              ]}
            >
              <Text
                style={[styles.text14, { color: Colors.textColor_255_255_238 }]}
              >
                <FormattedNumber
                  value={this.state.priceChangeAverage}
                  maximumFractionDigits={2}
                  minimumFractionDigits={2}
                />
                %
              </Text>
            </View>
          </View>

          <View style={[styles.spaceBetween, { marginTop: 4 }]}>
            <Text
              style={[styles.text14, { color: Colors.textColor_142_142_147 }]}
            >
              {market_cap && <FormattedMessage id="market_cap" />}
              {market_cap && ` ${market_cap}`}
            </Text>
          </View>
          <View style={[styles.spaceBetween, { marginTop: 4 }]}>
            <Text
              style={[styles.text14, { color: Colors.textColor_142_142_147 }]}
            >
              {volume_24h && <FormattedMessage id="volume_24h" />}
              {volume_24h && ` ${volume_24h}`}
            </Text>
          </View>
          <View style={[styles.row, { paddingVertical: 10 }]}>
            {locale === 'zh' && tags && tags.zh && tags.zh.length !== 0
              ? tags.zh.map(item => <Tag tag={item} />)
              : tags
                && tags.en
                && tags.en.length !== 0
                && tags.en.map(item => <Tag key={item} tag={item} />)}
          </View>
        </View>
      </IntlProvider>
    )
  }
}
