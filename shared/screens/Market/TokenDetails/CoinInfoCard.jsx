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
import messages from 'resources/messages'

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
    ticker.forEach((item) => {
      result += item.get('price_change_percent')
    })
    result /= ticker.count()
    this.setState({ priceChangeAverage: result })
  }

  calculateListedExchangeinUSD() {}

  render() {
    const { token, currentPair, locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.cardContainer}>
          <View style={styles.titleWrapper}>
            <Image style={styles.icon} source={Images.coin_logo_default} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.text18, { fontWeight: 'bold' }]}>
                {locale === 'zh'
                  ? token.get('name_zh') && token.get('name_zh').trim()
                  : token.get('name_en') && token.get('name_en')}
              </Text>
              <Text style={[styles.text16, {}]}>
                {currentPair.get('base_asset')}
              </Text>
            </View>
          </View>
          <View style={[styles.spaceBetween, { paddingVertical: 5 }]}>
            <Text style={styles.text18}>
              {
                <FormattedNumber
                  value={currentPair.get('price_last')}
                  maximumFractionDigits={
                    ASSET_FRACTION[currentPair.get('quote_asset')]
                  }
                  minimumFractionDigits={
                    ASSET_FRACTION[currentPair.get('quote_asset')]
                  }
                />
              }
              {` ${currentPair.get('quote_asset')}`}
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
              {token.get('market_cap') && <FormattedMessage id="market_cap" />}
              {token.get('market_cap') && ` ${token.get('market_cap')}`}
            </Text>
          </View>
          <View style={[styles.spaceBetween, { marginTop: 4 }]}>
            <Text
              style={[styles.text14, { color: Colors.textColor_142_142_147 }]}
            >
              {token.get('volume_24h') && <FormattedMessage id="volume_24h" />}
              {token.get('volume_24h') && ` ${token.get('volume_24h')}`}
            </Text>
          </View>
          <View style={[styles.row, { paddingVertical: 10 }]}>
            {locale === 'zh'
            && token.get('tags')
            && token.get('tags').get('zh')
            && token.get('tags').get('zh').length !== 0
              ? token
                .get('tags')
                .get('zh')
                .map(item => <Tag tag={item} />)
              : token.get('tags')
                && token.get('tags').get('en')
                && token.get('tags').get('en').length !== 0
                && token
                  .get('tags')
                  .get('en')
                  .map(item => <Tag key={item} tag={item} />)}
          </View>
        </View>
      </IntlProvider>
    )
  }
}
