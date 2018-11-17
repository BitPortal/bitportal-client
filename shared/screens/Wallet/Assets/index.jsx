import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
// import FastImage from 'react-native-fast-image'
import * as eosAssetsActions from 'actions/eosAsset'
import { eosAssetListSelector, eosAssetSearchResultListSelector } from 'selectors/eosAsset'
import styles from './styles'

@connect(
  state => ({
    eosAsset: eosAssetListSelector(state),
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
        title: {
          text: '添加资产'
        },
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { searching: false }

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  searchBarUpdated({ text, isFocused }) {
    this.setState({ searching: isFocused })
    if (this.pendingAssetQueue.length) {
      this.props.actions.toggleEOSAssetList(this.pendingAssetQueue)
      this.pendingAssetQueue = []
    }
    this.props.actions.searchEOSAssetRequested(text)
  }

  onRefresh = () => {
    this.props.actions.getEOSAssetRequested()
  }

  onSwitchAccessoryChanged = (data) => {
    const { account, symbol, current_supply, max_supply, icon_url, rank_url } = data
    this.props.actions.toggleEOSAssetForStorage({ contract: account, symbol, current_supply, max_supply, icon_url, rank_url })
    this.pendingAssetQueue.push({ contract: account, symbol, current_supply, max_supply, icon_url, rank_url })
  }

  componentDidAppear() {
    this.props.actions.getEOSAssetRequested()
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search'
      }
    })
  }

  componentWillUnmount() {
    if (this.pendingAssetQueue.length) {
      this.props.actions.toggleEOSAssetList(this.pendingAssetQueue)
      this.pendingAssetQueue = []
    }
  }

  render() {
    const { eosAsset, eosAssetSearchResult, loaded, loading } = this.props
    const data = this.state.searching ? eosAssetSearchResult : eosAsset

    return (
      <View style={styles.container}>
        <TableView
          style={{ flex: 1 }}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          canRefresh={loaded && !this.state.searching}
          refreshing={loaded && loading}
          onRefresh={this.onRefresh}
          detailTextColor="#666666"
          showsVerticalScrollIndicator={false}
          cellSeparatorInset={{ left: 66 }}
          reactModuleForCell="AssetTableViewCell"
          onSwitchAccessoryChanged={this.onSwitchAccessoryChanged}
        >
          <TableView.Section>
            {data.map(item => (
              <TableView.Item
                 key={`${item.get('symbol')}_${item.get('account')}`}
                 height={60}
                 selectionStyle={TableView.Consts.CellSelectionStyle.None}
                 icon_url={item.get('icon_url')}
                 symbol={item.get('symbol')}
                 account={item.get('account')}
                 current_supply={item.get('current_supply')}
                 max_supply={item.get('max_supply')}
                 rank_url={item.get('rank_url')}
                 accessoryType={5}
                 switchOn={item.get('selected')}
              />
            ))}
          </TableView.Section>
        </TableView>
      </View>
    )
  }
}
