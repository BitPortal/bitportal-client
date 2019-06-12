import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, ActivityIndicator, Alert } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import { managingWalletSelector, activeWalletSelector } from 'selectors/wallet'
import { getIntentions, getAsset, getNominationRecords } from 'core/chain/chainx'
import Modal from 'react-native-modal'
import Dialog from 'components/Dialog'
import styles from './styles'


export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return '密码错误'
    case 'EOS System Error':
      return 'EOS系统错误'
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
    voteLoding: false,
  }

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      // Navigation.dismissAllModals()
      Navigation.pop(this.props.componentId)
    } else if (buttonId === 'vote') {
      Alert.prompt(
        '请输入钱包密码',
        null,
        [
          {
            text: '取消',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: '确认',
            onPress: password => this.props.actions.vote.requested({
              chain: this.props.wallet.chain,
              id: this.props.wallet.id,
              accountName: this.props.wallet.address,
              producers: this.props.selectedIds,
              password
            })
          }
        ],
        'secure-text'
      )
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
  }

  async componentDidMount() {
    await this.getValidators()
    this.getNominationRecords()
  }

  getValidators = async () => {
    const intentions = await getIntentions()
    // console.log('getIntentions', intentions)
    this.setState({ validator: intentions })
    this.setState({ loading: false })
    this.setState({ loaded: true })
  }

  getNominationRecords = async () => {
    if (this.props.activeWallet && this.props.activeWallet.address) {
      const records = await getNominationRecords(this.props.activeWallet.address)
      this.setState({ userNominationRecords: records })
      // console.log('ui getNominationRecords', this.state.userNominationRecords)
      this.updateValidatorsByNomination()
    } else {
      console.log('no active chainx address')
    }
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
  }

  onModalHide = () => {
    const error = this.props.vote.error

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          errorDetail(error),
          [
            { text: '确定', onPress: () => this.props.actions.vote.clearError() }
          ]
        )
      }, 20)
    } else {
      setTimeout(() => {
        Alert.alert(
          '投票成功',
          '',
          [
            { text: '确定', onPress: () => {} }
          ]
        )
      }, 20)
    }
  }

  onAccessoryPress = (item) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ChainXValidatorDetail',
        passProps: item
      }
    })
  }

  render() {
    const { statusBarHeight } = this.props
    const loading = this.state.voteLoding

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
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <TableView
          style={{ flex: 1, width: '100%', marginTop: !this.state.searching ? (statusBarHeight + 44 + 56) : (statusBarHeight + 56) }}
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
            {this.state.validator.filter(vali => vali.name === 'BitPortal').map(item => (
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
                totalNomination={item.totalNomination}
                userNomination={(item && item.userNomination) || '-'}
                onPress={this.onAccessoryPress.bind(this, item)}
                accessoryType={TableView.Consts.AccessoryType.DetailButton}
                onAccessoryPress={this.onAccessoryPress.bind(this, item)}
              />
            ))}
          </TableView.Section>
          <TableView.Section label="验证节点 / 总票数">
            {this.state.validator.filter(vali => vali.isActive && vali.isValidator).sort((a, b) => b.totalNomination - a.totalNomination).map(item => (
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
                totalNomination={item.totalNomination}
                userNomination={(item && item.userNomination) || '-'}
                onPress={this.onAccessoryPress.bind(this, item)}
                accessoryType={TableView.Consts.AccessoryType.DetailButton}
                onAccessoryPress={this.onAccessoryPress.bind(this, item)}
              />
            ))}
          </TableView.Section>
          <TableView.Section label="备选节点 / 总票数">
            {this.state.validator.filter(vali => !vali.isValidator).sort((a, b) => b.totalNomination - a.totalNomination).map(item => (
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
                totalNomination={item.totalNomination}
                userNomination={(item && item.userNomination) || '-'}
                url={item.url}
                onPress={this.onAccessoryPress.bind(this, item)}
                accessoryType={TableView.Consts.AccessoryType.DetailButton}
                onAccessoryPress={this.onAccessoryPress.bind(this, item)}
              />
            ))}
          </TableView.Section>
        </TableView>
        <Modal
          isVisible={loading}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
          onModalHide={this.onModalHide}
        >
          {loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#000000" />
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>投票中...</Text>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}