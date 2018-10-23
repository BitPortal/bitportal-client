import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as tickerActions from 'actions/ticker'
import * as tokenActions from 'actions/token'
import { exchangeTickerSelector, sortFilterSelector } from 'selectors/ticker'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { bindActionCreators } from 'redux'
import { View, InteractionManager } from 'react-native'
import Modal from 'react-native-modal'
import { MARKET_CATEGORIES, MARKET_CATEGORY_NAMES } from 'constants/market'
import NavigationBar, { ListButton } from 'components/NavigationBar'
import SearchBar from 'components/SearchBar'
import { IntlProvider } from 'react-intl'
import Colors from 'resources/colors'
import { QUOTES_LIST_SELECTED } from 'constants/analytics'
import { onEventWithLabel } from 'utils/analytics'
import messages from 'resources/messages'
import styles from './styles'
import CategoryList from './CategoryList'
import MarketContent from './MarketContent'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    ticker: exchangeTickerSelector(state),
    loading: state.ticker.get('loading'),
    exchangeFilter: state.ticker.get('exchangeFilter'),
    sortFilter: sortFilterSelector(state),
    quoteAssetFilter: state.ticker.get('quoteAssetFilter'),
    baseAsset: state.ticker.get('baseAsset'),
    searchTerm: state.ticker.get('searchTerm'),
    marketCategory: state.ticker.get('marketCategory'),
    eosAccountName: eosAccountNameSelector(state)
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
export default class Market extends Component {
  static get options() {
    return {
      bottomTabs: {
        backgroundColor: Colors.minorThemeColor
      }
    }
  }

  state = {
    coinName: '',
    isVisible: false,
    activeQuoteAsset: null
  }

  searchCoin = coinName => {
    this.setState({ coinName })
  }

  selectExchange = () => {
    this.setState({ isVisible: true })
  }

  changeCategory = category => {
    //Umeng analytics
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isVisible: false }, () => {
        this.props.actions.setMarketCategory(category)
      })
    })
  }

  changeQuote = quote => {
    //Umeng analytics
    onEventWithLabel(QUOTES_LIST_SELECTED, quote)
    this.setState({ activeQuoteAsset: quote }, () => {
      InteractionManager.runAfterInteractions(() => {
        this.props.actions.selectTickersByQuoteAsset(quote)
      })
    })
  }
  //
  // pressListItem = (item) => {
  //   //Umeng analytics
  //   onEventWithLabel(MARKET_TOKEN_DETAIL, '行情 - token详情');
  //   const baseAsset = item.get('base_asset');
  //   InteractionManager.runAfterInteractions(() => {
  //     this.props.actions.selectCurrentSymbol(item);
  //     this.props.actions.selectBaseAsset(baseAsset);
  //     this.props.actions.getTokenDetailRequested({ symbol: baseAsset });
  //     Navigation.push(this.props.componentId, {
  //       component: {
  //         name: 'BitPortal.MarketDetails',
  //         passProps: { item }
  //       }
  //     });
  //   });
  // };

  onRefresh = () => {
    this.props.actions.getTickersRequested({
      // exchange: this.props.exchangeFilter,
      // quote_asset: this.props.quoteAssetFilter,
      // sort: this.props.sortFilter,
      limit: 200
    })
  }

  closeExchangeList = () => {
    this.setState({ isVisible: false })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.loading !== this.props.loading ||
      nextProps.locale !== this.props.locale ||
      nextProps.exchangeFilter !== this.props.exchangeFilter ||
      nextProps.sortFilter !== this.props.sortFilter ||
      nextProps.quoteAssetFilter !== this.props.quoteAssetFilter ||
      nextState.isVisible !== this.state.isVisible ||
      nextState.coinName !== this.state.coinName ||
      nextState.activeQuoteAsset !== this.state.activeQuoteAsset ||
      nextState.searchTerm !== this.props.searchTerm
    )
  }

  componentDidAppear() {
    this.onRefresh()
  }

  onChangeText = text => {
    this.props.actions.setSearchTerm(text)
  }

  render() {
    const { locale, searchTerm, marketCategory, componentId } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<ListButton label={MARKET_CATEGORY_NAMES[marketCategory]} onPress={this.selectExchange} />}
            rightButton={
              <SearchBar
                searchTerm={searchTerm}
                onChangeText={text => this.onChangeText(text)}
                clearSearch={() => {
                  this.props.actions.setSearchTerm('')
                }}
              />
            }
          />
          <MarketContent componentId={componentId} category={marketCategory} />
          <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ margin: 0 }}
            isVisible={this.state.isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            backdropOpacity={0.3}
          >
            <CategoryList
              loggedIn={this.props.eosAccountName}
              categoryList={MARKET_CATEGORIES}
              activeCategory={marketCategory}
              changeCategory={this.changeCategory}
              dismissModal={this.closeExchangeList}
            />
          </Modal>
        </View>
      </IntlProvider>
    )
  }
}
