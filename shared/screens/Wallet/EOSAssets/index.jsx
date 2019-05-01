import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import * as assetActions from 'actions/asset'
// import FastImage from 'react-native-fast-image'
import { eosAssetSelector } from 'selectors/asset'
import styles from './styles'

@connect(
  state => ({
    eosAsset: eosAssetSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...assetActions
    }, dispatch)
  })
)

export default class EOSAssets extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '添加EOS资产'
        },
      },
      bottomTabs: {
        visible: false,
        drawBehind: true,
        animate: true
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { searching: false }

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  searchBarUpdated({ text, isFocused }) {
    this.setState({ searching: isFocused })

  }

  onRefresh = () => {

  }

  onSwitchAccessoryChanged = (data) => {
    /* const { account, symbol, current_supply, max_supply, icon_url, rank_url } = data
     * this.props.actions.toggleEOSAssetForStorage({ contract: account, symbol, current_supply, max_supply, icon_url, rank_url })
     * this.pendingAssetQueue.push({ contract: account, symbol, current_supply, max_supply, icon_url, rank_url })*/
  }

  componentDidAppear() {
    // this.props.actions.getEOSAssetRequested()
    /* Navigation.mergeOptions(this.props.componentId, {
     *   topBar: {
     *     searchBar: true,
     *     searchBarHiddenWhenScrolling: true,
     *     searchBarPlaceholder: 'Search'
     *   }
     * })*/
  }

  componentWillUnmount() {
    /* if (this.pendingAssetQueue.length) {
     *   this.props.actions.toggleEOSAssetList(this.pendingAssetQueue)
     *   this.pendingAssetQueue = []
     * }*/
  }

  componentDidMount() {
    this.props.actions.getEOSAsset.requested()
  }

  render() {
    const { eosAsset } = this.props
    console.log(eosAsset)

    return (
      <View style={styles.container}>
        <TableView
          style={{ flex: 1 }}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          canRefresh={false && !this.state.searching}
          refreshing={false}
          onRefresh={this.onRefresh}
          detailTextColor="#666666"
          cellSeparatorInset={{ left: 66 }}
          onSwitchAccessoryChanged={this.onSwitchAccessoryChanged}
        >
          <TableView.Section>
            {eosAsset.map(item => (
               <TableView.Item
                 key={item.id}
                 height={60}
                 reactModuleForCell="AssetTableViewCell"
                 selectionStyle={TableView.Consts.CellSelectionStyle.None}
                 icon_url={item.icon_url}
                 symbol={item.symbol}
                 account={item.account}
                 current_supply={item.current_supply}
                 max_supply={item.max_supply}
                 rank_url={item.rank_url}
                 accessoryType={5}
                 switchOn={item.selected}
               />
             ))}
          </TableView.Section>
        </TableView>
      </View>
    )
  }
}
