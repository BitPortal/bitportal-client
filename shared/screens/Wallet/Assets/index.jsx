import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import * as eosAssetsActions from 'actions/eosAsset'
import { eosAssetSelector, eosAssetSearchResultListSelector } from 'selectors/eosAsset'
import styles from './styles'

const { Section, Item } = TableView

@connect(
  state => ({
    eosAsset: eosAssetSelector(state),
    eosAssetSearchResult: eosAssetSearchResultListSelector(state),
    loading: state.eosAsset.get('loading'),
    loaded: state.eosAsset.get('loaded')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAssetsActions
    }, dispatch)
  })
)

export default class Wallet extends Component {
  static get options() {
    return {
      topBar: {
        drawBehind: true,
        title: {
          text: '添加资产'
        },
        largeTitle: {
          visible: true,
          fontSize: 30,
          fontFamily: 'SFNSDisplay'
        },
        background: {
          translucent: false
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search'
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { searching: false }

  searchBarUpdated({ text, isFocused }) {
    this.setState({ searching: isFocused })
    this.props.actions.searchEOSAssetRequested(text)
  }

  onRefresh = () => {
    this.props.actions.getEOSAssetRequested()
  }

  componentDidAppear() {
    this.props.actions.getEOSAssetRequested()
  }

  render() {
    const { eosAsset, eosAssetSearchResult, loaded, loading } = this.props
    const data = this.state.searching ? eosAssetSearchResult : eosAsset

    return (
      <View style={styles.container}>
        <TableView
          style={{ flex: 1 }}
          tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
          canRefresh={loaded}
          refreshing={loaded && loading}
          onRefresh={this.onRefresh}
          detailTextColor="#666666"
          allowsToggle
          showsVerticalScrollIndicator={false}
        >
          <Section>
            {data.map(item => (
              <Item
                 key={`${item.get('symbol')}_${item.get('account')}`}
                 detail={item.get('account')}
              >
                {item.get('symbol')}
              </Item>
            ))}
          </Section>
        </TableView>
      </View>
    )
  }
}
