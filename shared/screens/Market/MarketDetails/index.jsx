import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { exchangeTickerSelector } from 'selectors/ticker'
import * as chartActions from 'actions/chart'
import * as tickerActions from 'actions/ticker'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import CoinInfoCard from './CoinInfoCard'
import MarketList from './MarketList'
import styles from './styles'
import messages from './messages'

const ButtonElement = ({ Title, onPress }) => (
  <TouchableOpacity
    style={[styles.btn, styles.center, styles.row]}
    onPress={() => onPress()}
  >
    <Ionicons
      name="ios-paper-outline"
      size={15}
      color={Colors.bgColor_FFFFFF}
    />

    <Text style={[styles.text14, { color: 'white' }]}> {Title}</Text>
  </TouchableOpacity>
)

@connect(
  state => ({
    locale: state.intl.get('locale'),
    ticker: exchangeTickerSelector(state),
    baseAsset: state.ticker.get('baseAsset'),
    quoteAssetFilter: state.ticker.get('quoteAssetFilter'),
    listedExchange: state.ticker.get('listedExchange'),
    loading: state.ticker.get('loading')
    // token: state.token.get('data')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...chartActions,
        ...tickerActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class MarketDetails extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  changeMarket = (data) => {
    console.log(JSON.stringify(data))
  }

  changeRoute = (screen) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: `BitPortal.${screen}`,
        passProps: { tokenDetails: this.props.token }
      }
    })
  }

  componentDidMount() {
    this.props.actions.getChartRequested({
      symbol_id: 'BITSTAMP_SPOT_BTC_USD',
      period_id: '1HRS',
      limit: 24
    })
  }

  componentDidAppear() {
    this.onRefresh()
  }

  // 获得listed exchanges
  onRefresh = () => {
    console.log('onRefresh called')
    this.props.actions.getPairListedExchangeRequested({
      quote_asset: this.props.quoteAssetFilter,
      base_asset: this.props.baseAsset
    })
  }

  render() {
    const {
      baseAsset,
      quoteAssetFilter,
      item,
      locale
    } = this.props

    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={
            <CommonButton
              iconName="md-arrow-back"
              onPress={() => Navigation.pop(this.props.componentId)}
            />
          }
          title={`${baseAsset} / ${quoteAssetFilter}`}
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CoinInfoCard item={item} />
            <MarketList changeMarket={e => this.changeMarket(e)} />
          </ScrollView>
        </View>
        <View
          style={[
            styles.btnContainer,
            styles.row,
            { paddingBottom: 50, paddingTop: 20 }
          ]}
        >
          <ButtonElement
            Title={messages[locale].token_details}
            onPress={() => this.changeRoute('TokenDetails')}
          />
        </View>
      </View>
    )
  }
}
