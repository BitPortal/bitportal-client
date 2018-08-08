/* @tsx */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import TableView, { HeaderTitle } from 'screens/Market/TableView';
import * as tickerActions from 'actions/ticker';
import * as tokenActions from 'actions/token';
import { exchangeTickerSelector, sortFilterSelector } from 'selectors/ticker';
import { bindActionCreators } from 'redux';
import { View, InteractionManager, LayoutAnimation } from 'react-native';
import Modal from 'react-native-modal';
import { Navigation } from 'react-native-navigation';
import { EXCHANGES, EXCHANGE_NAMES, QUOTE_ASSETS } from 'constants/market';
import NavigationBar, { ListButton } from 'components/NavigationBar';
import { IntlProvider } from 'react-intl';
import ExchangeList from './ExchangeList';
import { Quotes } from './Quotes';
import messages from './messages';
import styles from './styles';

@connect(
  state => ({
    locale: state.intl.get('locale'),
    ticker: exchangeTickerSelector(state),
    loading: state.ticker.get('loading'),
    exchangeFilter: state.ticker.get('exchangeFilter'),
    sortFilter: sortFilterSelector(state),
    quoteAssetFilter: state.ticker.get('quoteAssetFilter'),
    baseAsset: state.ticker.get('baseAsset')
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
  constructor(props, context) {
    super(props, context);
    this.state = {
      coinName: '',
      isVisible: false,
      activeQuoteAsset: null
    };
  }

  // 搜索币种
  searchCoin = (coinName) => {
    this.setState({ coinName });
  };

  // 弹出交易所列表
  selectExchange = () => {
    this.setState({ isVisible: true });
  };

  // 选择交易所
  changeExchange = (exchange) => {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isVisible: false, activeQuoteAsset: null }, () => {
        this.props.actions.selectTickersByExchange(exchange);
      });
    });
  };

  // 选择货币单位
  changeQuote = (quote) => {
    this.setState({ activeQuoteAsset: quote }, () => {
      InteractionManager.runAfterInteractions(() => {
        this.props.actions.selectTickersByQuoteAsset(quote);
      });
    });
  };

  // 点击查看币种行情
  pressListItem = (item) => {
    const baseAsset = item.get('base_asset');
    // console.log('pressListItem', item.toJS());
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.selectCurrentPair(item);
      this.props.actions.selectBaseAsset(baseAsset);
      this.props.actions.getTokenDetailRequested({ symbol: baseAsset });
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.MarketDetails',
          passProps: { item }
        }
      });
    });
  };

  // 刷新数据
  onRefresh = () => {
    // console.log('onRefresh called');
    this.props.actions.getTickersRequested({
      exchange: this.props.exchangeFilter,
      quote_asset: this.props.quoteAssetFilter,
      sort: this.props.sortFilter,
      limit: 200
    });
  };

  UNSAFE_componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.loading !== this.props.loading
      || nextProps.locale !== this.props.locale
      || nextProps.exchangeFilter !== this.props.exchangeFilter
      || nextProps.sortFilter !== this.props.sortFilter
      || nextProps.quoteAssetFilter !== this.props.quoteAssetFilter
      || nextState.isVisible !== this.state.isVisible
      || nextState.coinName !== this.state.coinName
      || nextState.activeQuoteAsset !== this.state.activeQuoteAsset
    );
  }

  componentDidAppear() {
    this.onRefresh();
  }

  render() {
    const {
      ticker,
      locale,
      loading,
      exchangeFilter,
      quoteAssetFilter,
      sortFilter,
      baseAsset
    } = this.props;

    // console.log(
    //   'exchangeFilter',
    //   exchangeFilter,
    //   'sortFilter',
    //   sortFilter,
    //   'quoteAssetFilter',
    //   quoteAssetFilter,
    //   'baseAsset',
    //   baseAsset
    // );

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={
              <ListButton
                label={EXCHANGE_NAMES[exchangeFilter]}
                onPress={() => this.selectExchange()}
              />
            }
          />
          <Quotes
            onPress={e => this.changeQuote(e)}
            quote={this.state.activeQuoteAsset || quoteAssetFilter}
            quoteList={QUOTE_ASSETS[exchangeFilter]}
          />
          <HeaderTitle messages={messages[locale]} />
          <TableView
            refreshing={loading}
            onRefresh={() => this.onRefresh()}
            data={ticker}
            onPress={(item) => {
              this.pressListItem(item);
            }}
          />

          <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ margin: 0 }}
            isVisible={this.state.isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            backdropOpacity={0.3}
          >
            <ExchangeList
              exchangeList={EXCHANGES}
              activeExchange={exchangeFilter}
              changeExchange={e => this.changeExchange(e)}
              dismissModal={() => this.setState({ isVisible: false })}
            />
          </Modal>
        </View>
      </IntlProvider>
    );
  }
}
