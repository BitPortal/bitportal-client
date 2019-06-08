import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TouchableHighlight, AlertIOS, TextInput, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import assert from 'assert'
import FastImage from 'react-native-fast-image'
import { activeWalletSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector } from 'selectors/balance'
import { depositClaim, getAsset, getPseduIntentions, getPseduNominationRecords, getBlockHeight } from 'core/chain/chainx'
import secureStorage from 'core/storage/secureStorage'
import Dialog from 'components/Dialog'
import chainxAccount from '@chainx/account'
import styles from './style'


const { Section, Item } = TableView

@connect(
  state => ({
    activeWallet: activeWalletSelector(state),
    formValues: getFormValues('chainxVotingAmountForm')(state),
    balance: activeWalletBalanceSelector(state)
  })
)

export default class ChainXDepositClaim extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        },
        title: {
          text: '充值提息'
        },
        backButton: {
          title: '返回'
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    }
  }

  state = {
    currentBlock: 0,
    btcBalance: 0,
    sdotBalance: 0,
    btcIntention: {},
    sdotIntention: {},
    userBtcIntention: {},
    userSdotIntention: {},
    loaded: false
  }

  formatBalance = (balance, num = 8) => (parseInt(balance) * Math.pow(10, -num)).toFixed(num).toString()


  updatePseduIntentions = async() => {
    const pseduIntentions = await getPseduIntentions()
    if (pseduIntentions && pseduIntentions.length > 0) {
      pseduIntentions.forEach((item) => {
        if (item.id === 'BTC') {
          this.setState({ btcIntention: item })
        } else if (item.id === 'SDOT') {
          this.setState({ sdotIntention: item })
        } else {
          console.error('invalid pseduIntention', item)
        }
      })
    }
  }

  updateUserIntentions = async (userAddress) => {
    const userIntentions = await getPseduNominationRecords(userAddress)
    if (userIntentions && userIntentions.length > 0) {
      userIntentions.forEach((item) => {
        if (item.id === 'BTC') {
          this.setState({userBtcIntention: item})
        } else if (item.id === 'SDOT') {
          this.setState({userSdotIntention: item})
        } else {
          console.error('invalid User Intention', item)
        }
      })
    }
  }

  updateBlockHeight = async () => {
    const blockHeight = await getBlockHeight()
    if (blockHeight) {
      this.setState({ blockHeight: blockHeight })
    }
  }

  componentDidMount = async () => {
    const activeWallet = this.props.activeWallet
    const userAddress = activeWallet.address

    try {
      await this.updatePseduIntentions()
      await this.updateUserIntentions(userAddress)
      await this.updateBlockHeight()
    } catch (e) {
      console.error(e)
    }

    this.timer = setInterval(() => {
      this.updateBlockHeight();
    }, 5000);
    this.setState({ loaded: true })
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  toDepositClaim = (asset) => {
    if (['BTC', 'SDOT'].indexOf(asset) === -1) {
      Dialog.alert('提示', '请指定资产')
      return
    }

    const hint = `本次操作将提取${asset}的充值利息`
    AlertIOS.prompt(
      '请输入钱包密码',
      hint,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: '确认',
          onPress: password => this.DepositClaim(
            asset,
            password
          )
        }
      ],
      'secure-text'
    )
  }

  DepositClaim = async (asset, password) => {
    const { activeWallet } = this.props
    const id = activeWallet.id

    if (!activeWallet || activeWallet.chain !== 'CHAINX' || !activeWallet.id) {
      Dialog.alert('Error', '当前钱包并非有效的ChainX钱包')
      console.error('当前钱包并非有效的ChainX钱包', activeWallet)
      return
    }

    const importedKeystore = await secureStorage.getItem(`IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = await secureStorage.getItem(`IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    try {
      const tx = await depositClaim(password, keystore, activeWallet.address, asset)
      if (tx) {
        console.log('提取充值利息交易已发送, txId: ', tx.toString())
        Alert.alert(
          '提取成功',
          `提取充值交易发送成功，请检查区块链信息!交易id:${tx.toString()}`,
          {
            text: 'OK',
            onPress: () => {
              console.log('Ok Pressed')
            },
            style: 'default'
          }
        )
      } else {
        console.error('提息失败', tx.toString())
        Dialog.alert('错误', '提息失败')
      }
      setTimeout(async () => {
        await this.updatePseduIntentions()
        await this.updateUserIntentions(activeWallet.address)
        await this.updateBlockHeight()
      }, 2000)
    } catch (e) {
      Dialog.alert('提息失败', `错误：${e.toString()}`)
    }
  }

  /*
   最新总币龄 = 总币龄 + 发行量 *（当前高度 - 总币龄更新高度）

   最新用户币龄 = 用户币龄 + 持有量 *（当前高度 - 用户币龄更新高度）

   总待领利息 = （最新用户币龄 / 最新总币龄） * 奖池金额
   */
  calcPendingInterest = (intention, userIntention, blockHeight) => {
    const latestTotalDepositWeight = intention.lastTotalDepositWeight + intention.circulation * (blockHeight - intention.lastTotalDepositWeightUpdate)
    const latestUserDepositWeight = userIntention.lastTotalDepositWeight + userIntention.balance * (blockHeight - userIntention.lastTotalDepositWeightUpdate)
    const pendingInterestWithoutDiscount = (latestUserDepositWeight / latestTotalDepositWeight) * intention.jackpot
    const pendingInterest = pendingInterestWithoutDiscount * ((100 - intention.discount) / 100)
    return pendingInterest > 0 ? pendingInterest : 0
  }

  render() {
    const { asset } = this.props

    const blockHeight = parseInt(this.state.blockHeight)
    const btcPendingInterest = this.calcPendingInterest(this.state.btcIntention, this.state.userBtcIntention, blockHeight)
    const sdotPendingInterest = this.calcPendingInterest(this.state.sdotIntention, this.state.userSdotIntention, blockHeight)
    const btcPendingInterestStr = this.formatBalance(btcPendingInterest, 8) + ' PCX'
    const sdotPendingInterestStr = this.formatBalance(sdotPendingInterest, 8) + ' PCX'

    const btcBalanceStr = this.formatBalance(this.state.userBtcIntention.balance, 8) + ' BTC'
    const sdotBalanceStr = this.formatBalance(this.state.userSdotIntention.balance, 3) + ' SDOT'

    const btcCirculationStr = this.formatBalance(this.state.btcIntention.circulation, 8) + ' BTC'
    const sdotCirculationStr = this.formatBalance(this.state.sdotIntention.circulation, 3) + ' SDOT'

    const btcJackpotBalanceStr = this.formatBalance(this.state.btcIntention.jackpot, 8) + ' PCX'
    const sdotJackpotBalanceStr = this.formatBalance(this.state.sdotIntention.jackpot, 8) + ' PCX'

    // const btcJackpotBalanceStr = this.formatBalance(this.state.btcIntention.jackpot, 8)
    // const sdotJackpotBalanceStr = this.formatBalance(this.state.sdotIntention.jackpot, 8)

    let globalItems = []
    let userItems =[]

    userItems.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="挖矿BTC余额"
        type="btcBalance"
        key="btcBalance"
        detail={btcBalanceStr}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    userItems.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="挖矿SDOT余额"
        type="sdotBalance"
        key="sdotBalance"
        detail={sdotBalanceStr}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    globalItems.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="BTC全链总余额"
        type="btcCirculationStr"
        key="btcCirculationStr"
        detail={btcCirculationStr}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    globalItems.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="SDOT全链总余额"
        type="sdotCirculationStr"
        key="sdotCirculationStr"
        detail={sdotCirculationStr}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    globalItems.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="BTC资产奖池"
        type="btcJackpotBalanceStr"
        key="btcJackpotBalanceStr"
        detail={btcJackpotBalanceStr}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    globalItems.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="SDOT资产奖池"
        type="sdotJackpotBalanceStr"
        key="sdotJackpotBalanceStr"
        detail={sdotJackpotBalanceStr}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    userItems.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="BTC充值待领利息"
        type="asset"
        key="asset"
        detail={btcPendingInterestStr}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    userItems.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="SDOT映射待领利息"
        type="asset"
        key="asset"
        detail={sdotPendingInterestStr}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    return (
      <View style={{ flex: 1 }}>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
        >
          <Section />
          <Section>
            {userItems}
          </Section>
          <Section>
            {globalItems}
          </Section>
        </TableView>
        <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC' }}>
          <TouchableOpacity style={styles.button} onPress={this.toDepositClaim.bind(this, 'BTC')}>
            <Text style={styles.buttonText}>BTC充值提息</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#EFEFF4' }]} onPress={this.toDepositClaim.bind(this, 'SDOT')}>
            <Text style={[styles.buttonText, { color: '#007AFF' }]}>SDOT映射提息</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
