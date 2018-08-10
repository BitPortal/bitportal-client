import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ActivityIndicator, Image } from 'react-native'
import Colors from 'resources/colors'
import { filterBgColor } from 'utils'
import AccordionPanel from 'components/AccordionPanel'
import { EXCHANGE_NAMES } from 'constants/market'
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl'
import { tokenTickerSelector } from 'selectors/ticker'
import Images from 'resources/images'
<<<<<<< Updated upstream
=======
import { ASSET_FRACTION } from 'constants/market'

>>>>>>> Stashed changes
import styles from './styles'
import messages from './messages'

const NAMES = [
  'market_cap',
  'blockchain',
  'circulating_supply',
  'total_supply',
  'proof_type',
  'team_location',
  'first_announced',
  'algorithm',
  'block_time',
  'ico_start',
  'ico_end',
  'ico_capital'
]

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
export class Logo extends Component {
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
      console.log('item.price_change_percent', item.price_change_percent)
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

@connect(
  state => ({
    locale: state.intl.get('locale'),
    token: state.token.get('data'),
    loading: state.token.get('loading')
  }),
  null,
  null,
  { withRef: true }
)
export class Description extends Component {
  getDescription = (locale) => {
    const { description } = this.props.token.toJS()

    if (
      description
      && description[locale]
      && description[locale].length !== 0
    ) {
      return description[locale]
    } else if (description && description.en && description.en.length !== 0) {
      return description.en
    } else {
      return messages[locale].description_null
    }
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <AccordionPanel title={messages[locale].description}>
          <View
            style={{
              paddingHorizontal: 25,
              paddingBottom: 30,
              marginLeft: 4
            }}
          >
            <Text
              ellipseMode="clip"
              style={[
                styles.text14,
                {
                  // flex: 1
                  // paddingVertical: 20,
                  // paddingHorizontal: 25,
                  // paddingBottom: 30
                  // marginLeft: 4
                }
              ]}
            >
              {this.getDescription(locale)}
            </Text>
          </View>
        </AccordionPanel>
      </IntlProvider>
    )
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    token: state.token.get('data'),
    loading: state.token.get('loading')
  }),
  null,
  null,
  { withRef: true }
)
export class Details extends Component {
  render() {
    const {
      circulating_supply,
      total_supply,
      ...rest
    } = this.props.token.toJS()
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <AccordionPanel title={messages[locale].details}>
          <View
            style={{
              paddingHorizontal: 25,
              // paddingBottom: 30,
              marginLeft: 4
            }}
          >
            {!circulating_supply
            && !total_supply
            && Object.keys(rest).length === 0 ? (
              <Text style={styles.text14}>{messages[locale].details_null}</Text>
              ) : null}
            {circulating_supply && (
              <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                <Text style={styles.text14}>
                  <FormattedMessage id="circulating_supply" />
                </Text>
                <Text style={styles.text14}>
                  <FormattedNumber value={circulating_supply} />
                </Text>
              </View>
            )}
            {total_supply && (
              <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                <Text style={styles.text14}>
                  <FormattedMessage id="total_supply" />
                </Text>
                <Text style={styles.text14}>
                  <FormattedNumber value={total_supply} />
                </Text>
              </View>
            )}
            {Object.keys(rest).map(item => (NAMES.includes(item) ? (
              <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                <Text style={styles.text14}>
                  <FormattedMessage id={item} />
                </Text>
                <Text style={styles.text14}>{rest[item]}</Text>
              </View>
            ) : null)
            )}
            {/* <View style={[styles.spaceBetween, { marginTop: 10 }]}>
              <Text style={styles.text14}> Locations </Text>
              <Text style={styles.text14}> Hangzhou </Text>
            </View>
            <View style={[styles.spaceBetween, { marginTop: 10 }]}>
              <Text style={styles.text14}> Total Supply </Text>
              <Text style={styles.text14}> 1,706,000.000 </Text>
            </View>
            <View style={[styles.spaceBetween, { marginTop: 10 }]}>
              <Text style={styles.text14}> Funds Raised </Text>
              <Text style={styles.text14}> 8,900 BTC </Text>
            </View>
            <View style={[styles.spaceBetween, { marginTop: 10 }]}>
              <Text style={styles.text14}> Token Cost </Text>
              <Text style={styles.text14}> 0.4 USD </Text>
            </View>
            <View style={[styles.spaceBetween, { marginTop: 10 }]}>
              <Text style={styles.text14}> KYC Info </Text>
              <Text style={styles.text14}> None </Text>
            </View>
            <View style={[styles.spaceBetween, { marginTop: 10 }]}>
              <Text style={styles.text14}> ICO Date </Text>
              <Text style={styles.text14}> 2017.06.20 </Text>
            </View> */}
          </View>
        </AccordionPanel>
      </IntlProvider>
    )
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    token: state.token.get('data'),
    loading: state.token.get('loading')
  }),
  null,
  null,
  { withRef: true }
)
export class ListedExchange extends Component {
  render() {
    const { data, loading, locale } = this.props
    return (
      <AccordionPanel title={messages[locale].listed_exchange}>
        <View
          style={{
            paddingHorizontal: 25,
            marginLeft: 4
          }}
        >
          {loading ? (
            <View style={styles.loadingSymbol}>
              <ActivityIndicator />
            </View>
          ) : (
            data.map(item => (
              <View style={[styles.spaceBetween, { marginTop: 10 }]}>
                <Text style={styles.text14}>
                  {' '}
                  {EXCHANGE_NAMES[item.get('exchange')]}{' '}
                </Text>
                <Text style={styles.text14}>
                  {' '}
                  {
                    <FormattedNumber
                      value={item.get('price_last')}
                      maximumFractionDigits={
                        ASSET_FRACTION[item.get('quote_asset')]
                      }
                      minimumFractionDigits={
                        ASSET_FRACTION[item.get('quote_asset')]
                      }
                    />
                  }
                  {` ${item.get('quote_asset')}`}{' '}
                </Text>
              </View>
            ))
          )}
          {/* <View style={[styles.spaceBetween, { marginTop: 10 }]}>
          <Text style={styles.text14}> Huobi.pro </Text>
          <Text style={styles.text14}> 11,949.00 USD </Text>
        </View>
        <View style={[styles.spaceBetween, { marginTop: 10 }]}>
          <Text style={styles.text14}> Bibox </Text>
          <Text style={styles.text14}> 11,949.00 USD </Text>
        </View>
        <View style={[styles.spaceBetween, { marginTop: 10 }]}>
          <Text style={styles.text14}> Gate.io </Text>
          <Text style={styles.text14}> 11,949.00 USD </Text>
        </View> */}
        </View>
      </AccordionPanel>
    )
  }
}
