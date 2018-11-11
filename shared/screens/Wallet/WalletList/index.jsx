import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, Switch, ActionSheetIOS } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import FastImage from 'react-native-fast-image'
import * as eosAssetsActions from 'actions/eosAsset'
import { eosAssetListSelector, eosAssetSearchResultListSelector } from 'selectors/eosAsset'
import styles from './styles'

const { Section, Item } = TableView

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

export default class WalletList extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '管理钱包列表'
        },
        leftButtons: [
          {
            id: 'cancel',
            text: '取消'
          }
        ],
        rightButtons: [
          {
            id: 'edit',
            text: '编辑'
          }
        ],
        largeTitle: {
          visible: false
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { searching: false, editting: false }
  tableViewRef = React.createRef()
  pendingAssetQueue = []


  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissAllModals()
    } else if (buttonId === 'edit') {
      this.setState({ editting: true })
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'done',
              text: '完成'
            }
          ]
        }
      })
    } else if (buttonId === 'done') {
      this.setState({ editting: false })
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'edit',
              text: '编辑'
            }
          ]
        }
      })
    }
  }

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

  onPress = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['取消', '创建新身份', '恢复已有身份'],
      cancelButtonIndex: 0,
    }, (buttonIndex) => {
      if (buttonIndex === 1) { /* destructive action */ }
    })
  }

  onSwitchAccessoryChanged = (data) => {
    const { account, symbol, current_supply, max_supply, icon_url, rank_url } = data
    this.props.actions.toggleEOSAssetForStorage({ contract: account, symbol, current_supply, max_supply, icon_url, rank_url })
    this.pendingAssetQueue.push({ contract: account, symbol, current_supply, max_supply, icon_url, rank_url })
  }

  componentDidAppear() {
    this.props.actions.getEOSAssetRequested()
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
          tableViewStyle={TableView.Consts.Style.Grouped}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          detailTextColor="#666666"
          showsVerticalScrollIndicator={false}
          cellSeparatorInset={{ left: 66 }}
          reactModuleForCell="WalletTableViewCell"
          moveWithinSectionOnly
        >
          <Section label="身份钱包" canEdit canMove>
            <Item
              height={60}
              onPress={this.onPress}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              name="BTC-Wallet"
              blockchain="BTC-SEGWIT"
              address="12ESfU8aaUyxepfMbxee9vt688eeS2QEsF"
              selected
            />
            <Item
              height={60}
              onPress={this.onPress}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              name="ETH-Wallet"
              blockchain="ETH"
              address="0xdc91b2Df92E06D3FA74D23F47d3A9C3899f43556"
            />
            <Item
              height={60}
              onPress={this.onPress}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              name="EOS-Wallet"
              blockchain="EOS"
              account="terencegehui"
            />
          </Section>
          <Section label="导入钱包">
            <Item
              height={60}
              onPress={this.onPress}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              type="add"
              text="导入新钱包..."
            />
            <Item
              height={60}
              onPress={this.onPress}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              name="BTC-Wallet"
              blockchain="BTC-SEGWIT"
              address="12ESfU8aaUyxepfMbxee9vt688eeS2QEsF"
            />
            <Item
              height={60}
              onPress={this.onPress}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              name="ETH-Wallet"
              blockchain="ETH"
              address="0xdc91b2Df92E06D3FA74D23F47d3A9C3899f43556"
            />
            <Item
              height={60}
              onPress={this.onPress}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              name="EOS-Wallet"
              blockchain="EOS"
              account="terencegehui"
            />
            <Item
              height={60}
              onPress={this.onPress}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              name="BTC-Wallet"
              blockchain="BTC-SEGWIT"
              address="12ESfU8aaUyxepfMbxee9vt688eeS2QEsF"
            />
          </Section>
        </TableView>
      </View>
    )
  }
}
