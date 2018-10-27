import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as tickerActions from 'actions/ticker'
import * as tokenActions from 'actions/token'
import { exchangeTickerSelector, sortFilterSelector } from 'selectors/ticker'
import { bindActionCreators } from 'redux'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import styles from './styles'

const { Section, Item } = TableView

@connect(
  state => ({
    locale: state.intl.get('locale'),
    ticker: exchangeTickerSelector(state),
    loading: state.ticker.get('loading'),
    exchangeFilter: state.ticker.get('exchangeFilter'),
    sortFilter: sortFilterSelector(state),
    quoteAssetFilter: state.ticker.get('quoteAssetFilter'),
    baseAsset: state.ticker.get('baseAsset'),
    searchTerm: state.ticker.get('searchTerm')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...tickerActions,
        ...tokenActions
      },
      dispatch
    )
  })
)

export default class Market extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'Market'
        },
        drawBehind: true,
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search',
        background: {
          translucent: false
        },
        largeTitle: {
          visible: true,
          fontSize: 30,
          fontFamily: 'SFNSDisplay'
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  render() {
    return (
      <View style={styles.container}>
        <TableView
          style={{ flex: 1 }}
          tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
          canRefresh
        >
          <Section>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
            <Item>1</Item>
          </Section>
        </TableView>
      </View>
    )
  }
}
