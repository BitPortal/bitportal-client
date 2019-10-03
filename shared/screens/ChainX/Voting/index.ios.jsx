import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, ActivityIndicator, Alert, SafeAreaView } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import { managingWalletSelector, activeWalletSelector } from 'selectors/wallet'
import { getIntentions, getAsset, getNominationRecords, getBlockHeight } from 'core/chain/chainx'
import Modal from 'react-native-modal'
import Chainx from 'chainx.js'
import Dialog from 'components/Dialog'
import styles from './styles'


export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return '密码错误'
    default:
      return '投票失败'
  }
}

export const errorDetail = (error) => {
  if (!error) { return null }

  const detail = typeof error === 'object' ? error.detail : ''

  return detail
}

@connect(
  state => ({
    wallet: managingWalletSelector(state),
    activeWallet: activeWalletSelector(state),
  })
)

export default class ChainXVoting extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'ChainX 节点投票'
        },
        drawBehind: true,
        searchBar: false,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: 'Search',
        largeTitle: {
          visible: false
        },
        leftButtons: [
          {
            id: 'cancel',
            text: '取消'
          }
        ]
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    searching: false,
    validator: [],
    userNominationRecords: [],
    loading: true,
    loaded: false,
    blockHeight: 0
  }

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      // Navigation.dismissAllModals()
      Navigation.pop(this.props.componentId)
    }
  }

  searchBarUpdated({ text, isFocused }) {
    this.setState({ searching: isFocused })
  }

  onRefresh = () => {
    this.getNominationRecords()
  }

  onSelectedPress = (owner) => {
    const index = this.props.allIds.findIndex(item => item === owner)

    if (index !== -1) {
      if (index < 21) {
        this.tableViewRef.scrollToIndex({ index, section: 0, animated: true })
      } else {
        this.tableViewRef.scrollToIndex({ index: index - 21, section: 1, animated: true })
      }
    }
  }

  componentDidUpdate(prevProps) {
  }

  componentDidAppear() {
    // only update user voting info
    if (this.state.loaded) {
      this.getNominationRecords()
    }
    this.updateBlockHeight()
  }

  async componentDidMount() {
    await this.getValidators()
    this.getNominationRecords()
    this.timer = setInterval(() => {
      this.updateBlockHeight();
    }, 1000);
  }

  updateBlockHeight = async () => {
    const blockHeight = await getBlockHeight()
    if (blockHeight) {
      this.setState({ blockHeight: blockHeight })
    }
  }

  getValidators = async () => {
    const intentions = await getIntentions()
    console.log('getIntentions', intentions)
    this.setState({ validator: intentions })
    this.setState({ loading: false })
    this.setState({ loaded: true })
  }

  getNominationRecords = async () => {
    if (!this.props.activeWallet || !this.props.activeWallet.address) {
      console.log('no active chainx address')
      return
    }
    const records = await getNominationRecords(this.props.activeWallet.address)
    this.setState({ userNominationRecords: records })
    // console.log('ui getNominationRecords', this.state.userNominationRecords)
    this.updateValidatorsByNomination()
  }

  updateValidatorsByNomination = () => {
    const validatorWithUserInfo = this.state.validator.map((item) => {
      for (let v of this.state.userNominationRecords) {
        if (v[0] === item.account) {
          item.userLastVoteWeight = v[1].lastVoteWeight
          item.userLastVoteWeightUpdate = v[1].lastVoteWeightUpdate
          item.userNomination = v[1].nomination
        }
      }
      return item
    })
    this.setState({ validator: validatorWithUserInfo })
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  onAccessoryPress = (item, pendingInterestStr = '-') => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.ChainXValidatorDetail',
            passProps: {
              ...item,
              pendingInterestStr
            }
          }
        }]
      }
    })
  }

  formatBalance = (balance, num = 8) => (parseInt(balance) * Math.pow(10, -num)).toFixed(num)

  render() {
    const validator = this.state.validator

    if (!this.state.loaded && this.state.loading) {
      return (
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator size="small" color="#000000" />
            <Text style={{ fontSize: 17, marginLeft: 5 }}>获取节点中...</Text>
          </View>
        </View>
      )
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <TableView
          style={{ flex: 1, width: '100%', marginTop: 0 }}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          detailTextColor="#666666"
          canRefresh
          showsVerticalScrollIndicator={false}
          cellSeparatorInset={{ left: 46 }}
          reactModuleForCell="ChainXValidatorTableViewCell"
          headerBackgroundColor="#F7F7F7"
          ref={(ref) => { this.tableViewRef = ref; return null }}
        >
          <TableView.Section label="特别推荐 / 总票数">
            {validator.filter(vali => vali.name === 'BitPortal').map(item => {
              let pendingInterest = 0
              if (item && item.userNomination) {
                // 最新总票龄 = 总票龄 + 总投票金额 *（当前高度 - 总票龄更新高度）
                const latestTotalVoteWeight = item.lastTotalVoteWeight + item.totalNomination * (this.state.blockHeight - item.lastTotalVoteWeightUpdate)

                // 最新用户票龄 = 用户票龄 + 投票金额 *（当前高度 - 用户票龄更新高度）
                const latestUserVoteWeight = item.userLastVoteWeight + item.userNomination * (this.state.blockHeight - item.userLastVoteWeightUpdate)

                if (latestUserVoteWeight > 0 && latestTotalVoteWeight > 0 && item.jackpot > 0) {
                  // 用户待领利息 = 最新用户票龄 / 最新总票龄 * 奖池金额
                  pendingInterest = latestUserVoteWeight / latestTotalVoteWeight * item.jackpot
                }
              }
              const pendingInterestStr = this.formatBalance(pendingInterest, 8)

              // pendingInterestStr
              const userNominationStr = (item && item.userNomination && this.formatBalance(item.userNomination, 8)) || '-'
              const totalNominationStr = this.formatBalance(item.totalNomination)
              return (
                <TableView.Item
                  key={item.name}
                  height={60}
                  cellHeight={60}
                  selectionStyle={TableView.Consts.CellSelectionStyle.None}
                  name={item.name}
                  account={item.account}
                  isActive={item.isActive}
                  isTrustee={item.isTrustee}
                  isValidator={item.isValidator}
                  about={item.about}
                  jackpot={item.jackpot}
                  jackpotAccount={item.jackpotAccount}
                  sessionKey={item.sessionKey}
                  url={item.url}
                  blockHeight={this.state.blockHeight}
                  lastTotalVoteWeight={item.lastTotalVoteWeight}
                  lastTotalVoteWeightUpdate={item.lastTotalVoteWeightUpdate}
                  totalNomination={item.totalNomination}
                  userLastVoteWeight={item.userLastVoteWeight}
                  userLastVoteWeightUpdate={item.userLastVoteWeightUpdate}
                  userNomination={(item && item.userNomination) || '-'}
                  userNominationStr={userNominationStr}
                  pendingInterestStr={pendingInterestStr}
                  totalNominationStr={totalNominationStr}
                  onPress={this.onAccessoryPress.bind(this, item, pendingInterestStr)}
                  accessoryType={TableView.Consts.AccessoryType.DetailButton}
                  onAccessoryPress={this.onAccessoryPress.bind(this, item, pendingInterestStr)}
                />
              )
            })}
          </TableView.Section>
          <TableView.Section label="验证节点 / 总票数">
            {validator.filter(vali => vali.isActive && vali.isValidator).sort((a, b) => b.totalNomination - a.totalNomination).map(item => {

              let pendingInterest = 0
              if (item && item.userNomination) {
                // 最新总票龄 = 总票龄 + 总投票金额 *（当前高度 - 总票龄更新高度）
                const latestTotalVoteWeight = item.lastTotalVoteWeight + item.totalNomination * (this.state.blockHeight - item.lastTotalVoteWeightUpdate)

                // 最新用户票龄 = 用户票龄 + 投票金额 *（当前高度 - 用户票龄更新高度）
                const latestUserVoteWeight = item.userLastVoteWeight + item.userNomination * (this.state.blockHeight - item.userLastVoteWeightUpdate)

                if (latestUserVoteWeight > 0 && latestTotalVoteWeight > 0 && item.jackpot > 0) {
                  // 用户待领利息 = 最新用户票龄 / 最新总票龄 * 奖池金额
                  pendingInterest = latestUserVoteWeight / latestTotalVoteWeight * item.jackpot
                }
              }
              const pendingInterestStr = this.formatBalance(pendingInterest, 8)

              // pendingInterestStr
              const userNominationStr = (item && item.userNomination && this.formatBalance(item.userNomination, 8)) || '-'
              const totalNominationStr = this.formatBalance(item.totalNomination)

              return (
                <TableView.Item
                  key={item.name}
                  height={60}
                  cellHeight={60}
                  selectionStyle={TableView.Consts.CellSelectionStyle.None}
                  name={item.name}
                  account={item.account}
                  isActive={item.isActive}
                  isTrustee={item.isTrustee}
                  isValidator={item.isValidator}
                  about={item.about}
                  jackpot={item.jackpot}
                  jackpotAccount={item.jackpotAccount}
                  sessionKey={item.sessionKey}
                  url={item.url}
                  blockHeight={this.state.blockHeight}
                  lastTotalVoteWeight={item.lastTotalVoteWeight}
                  lastTotalVoteWeightUpdate={item.lastTotalVoteWeightUpdate}
                  totalNomination={item.totalNomination}
                  userLastVoteWeight={item.userLastVoteWeight}
                  userLastVoteWeightUpdate={item.userLastVoteWeightUpdate}
                  userNomination={(item && item.userNomination) || '-'}
                  userNominationStr={userNominationStr}
                  pendingInterestStr={pendingInterestStr}
                  totalNominationStr={totalNominationStr}
                  onPress={this.onAccessoryPress.bind(this, item, pendingInterestStr)}
                  accessoryType={TableView.Consts.AccessoryType.DetailButton}
                  onAccessoryPress={this.onAccessoryPress.bind(this, item, pendingInterestStr)}
                />
              )
            })}
          </TableView.Section>
          <TableView.Section label="备选节点 / 总票数">
            {validator.filter(vali => !vali.isValidator).sort((a, b) => b.totalNomination - a.totalNomination).map(item => {

              let pendingInterest = 0
              if (item && item.userNomination) {
                // 最新总票龄 = 总票龄 + 总投票金额 *（当前高度 - 总票龄更新高度）
                const latestTotalVoteWeight = item.lastTotalVoteWeight + item.totalNomination * (this.state.blockHeight - item.lastTotalVoteWeightUpdate)

                // 最新用户票龄 = 用户票龄 + 投票金额 *（当前高度 - 用户票龄更新高度）
                const latestUserVoteWeight = item.userLastVoteWeight + item.userNomination * (this.state.blockHeight - item.userLastVoteWeightUpdate)

                if (latestUserVoteWeight > 0 && latestTotalVoteWeight > 0 && item.jackpot > 0) {
                  // 用户待领利息 = 最新用户票龄 / 最新总票龄 * 奖池金额
                  pendingInterest = latestUserVoteWeight / latestTotalVoteWeight * item.jackpot
                }
              }
              const pendingInterestStr = this.formatBalance(pendingInterest, 8)

              // pendingInterestStr
              const userNominationStr = (item && item.userNomination && this.formatBalance(item.userNomination, 8)) || '-'
              const totalNominationStr = this.formatBalance(item.totalNomination)

              return (
                  <TableView.Item
                    key={item.name}
                    height={60}
                    cellHeight={60}
                    selectionStyle={TableView.Consts.CellSelectionStyle.None}
                    name={item.name}
                    account={item.account}
                    isActive={item.isActive}
                    isTrustee={item.isTrustee}
                    isValidator={item.isValidator}
                    about={item.about}
                    jackpot={item.jackpot}
                    jackpotAccount={item.jackpotAccount}
                    sessionKey={item.sessionKey}
                    url={item.url}
                    blockHeight={this.state.blockHeight}
                    lastTotalVoteWeight={item.lastTotalVoteWeight}
                    lastTotalVoteWeightUpdate={item.lastTotalVoteWeightUpdate}
                    totalNomination={item.totalNomination}
                    userLastVoteWeight={item.userLastVoteWeight}
                    userLastVoteWeightUpdate={item.userLastVoteWeightUpdate}
                    userNomination={(item && item.userNomination) || '-'}
                    userNominationStr={userNominationStr}
                    pendingInterestStr={pendingInterestStr}
                    totalNominationStr={totalNominationStr}
                    onPress={this.onAccessoryPress.bind(this, item, pendingInterestStr)}
                    accessoryType={TableView.Consts.AccessoryType.DetailButton}
                    onAccessoryPress={this.onAccessoryPress.bind(this, item, pendingInterestStr)}
                  />
                )
            })}
          </TableView.Section>
        </TableView>
      </SafeAreaView>
    )
  }
}
