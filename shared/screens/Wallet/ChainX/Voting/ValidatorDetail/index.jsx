import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TouchableHighlight, TextInput, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import assert from 'assert'
import FastImage from 'react-native-fast-image'
import { activeWalletSelector } from 'selectors/wallet'
import { voteClaim, vote } from 'core/chain/chainx'
import secureStorage from 'core/storage/secureStorage'
import Dialog from 'components/Dialog'
import chainxAccount from '@chainx/account'
import styles from './style'


const { Section, Item } = TableView


const TextField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  fieldName,
  placeholder,
  secureTextEntry,
  separator,
  change,
  showClearButton
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 56, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <Text style={{ fontSize: 17, fontWeight: 'bold', marginRight: 16, width: 70 }}>{label}</Text>
    <TextInput
      style={styles.textFiled}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      keyboardType="default"
      secureTextEntry={secureTextEntry}
      {...restInput}
    />
    {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />}
  </View>
)

const validate = (values) => {
  const errors = {}

  if (!values.votingAmount) {
    errors.votingAmount = '请输入投票数额'
  }

  return errors
}


@reduxForm({ form: 'chainxVotingAmountForm', validate })

@connect(
  state => ({
    activeWallet: activeWalletSelector(state),
    formValues: getFormValues('chainxVotingAmountForm')(state)
  })
)

export default class ChainXValidatorDetail extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'help',
            text: '详情'
          }
        ],
        largeTitle: {
          visible: false
        },
        title: {
          text: '节点详情'
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
    const account = this.props.account
    const url = `https://scan.chainx.org/validators/all/${account.toString()}`
    if (buttonId === 'help') {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.WebView',
          passProps: {
            url,
            id: 99998
          },
          largeTitle: {
            visible: false
          },
          options: {
            topBar: {
              title: {
                text: '节点详情 - 更多'
              }
            }
          }
        }
      })
    }
  }

  formatBalance = (balance, num = 8) => (parseInt(balance) * Math.pow(10, -8)).toFixed(num).toString()

  toVote = () => {
    const votingAmount = this.props.formValues && this.props.formValues.votingAmount
    if (!votingAmount) {
      Dialog.alert('提示', '请输入投票数量')
      return
    }
    const hint = `本次操作将为该节点投票${parseFloat(votingAmount).toFixed(8)} PCX`
    Alert.prompt(
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
          onPress: password => this.vote(
            chainxAccount.encodeAddress(this.props.account),
            votingAmount,
            password
          )
        }
      ],
      'secure-text'
    )
  }

  toClaim = () => {
    Alert.prompt(
      '请输入钱包密码',
      '本次操作将提取该节点的利息',
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: '确认',
          onPress: password => this.voteClaim(
            chainxAccount.encodeAddress(this.props.account),
            password
          )
        }
      ],
      'secure-text'
    )
  }

  vote = async (targetAddress, amount, password) => {
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
      const tx = await vote(password, keystore, activeWallet.address, targetAddress, amount)
      if (tx) {
        console.log('投票交易已发送, txId: ', tx.toString())
        Alert.alert(
          '发送交易成功',
          `投票交易发送成功，请检查区块链信息!交易id:${tx.toString()}`,
          {
            text: 'OK',
            onPress: () => {
              console.log('Ok Pressed')
              Navigation.pop(this.props.componentId, {
                component: {
                  name: 'BitPortal.ChainXVoting'
                },
                options: {
                  topBar: {
                    searchBar: false,
                    searchBarHiddenWhenScrolling: false,
                    searchBarPlaceholder: 'Search'
                  }
                }
              })
            },
            style: 'default'
          }
        )
      } else {
        console.error('投票失败', tx.toString())
        Dialog.alert('错误', '投票失败')
      }
    } catch (e) {
      Dialog.alert('投票失败', `错误：${e.toString()}`)
    }
  }

  voteClaim = async (targetAddress, password) => {
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
      const tx = await voteClaim(password, keystore, activeWallet.address, targetAddress)
      if (tx) {
        Dialog.alert('发送交易成功', `提息交易发送成功，请检查区块链信息!交易id:${tx.toString()}`)
      } else {
        console.error('提息失败', tx.toString())
        Dialog.alert('错误', '提息失败')
      }
    } catch (e) {
      Dialog.alert('提息失败', `错误：${e.toString()}`)
    }
  }

  render() {
    const { formValues, change, name, account, about, isActive, isValidator, isTruestee, jackpot, jackpotAccount, sessionKey, info } = this.props
    const votingAmount = formValues && formValues.passwordHint
    const formatedJackpot = jackpot && this.formatBalance(jackpot)

    const items = []

    if (name) {
      items.push(
        <Item
          reactModuleForCell="ChainXValidatorDetailTableViewCell"
          text="节点名称"
          type="name"
          key="name"
          detail={name}
          height={60}
          selectionStyle={TableView.Consts.CellSelectionStyle.None}
        />
      )
    }

    items.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="帐号"
        key="account"
        type="account"
        detail={chainxAccount.encodeAddress(account)}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    items.push(
      <Item
        key="jackpot"
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="奖池"
        type="jackpot"
        detail={formatedJackpot}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    items.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="出块公钥"
        type="sessionKey"
        key="sessionKey"
        detail={sessionKey}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.None}
      />
    )

    items.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text="介绍"
        key="about"
        type="about"
        detail={about}
        height={100}
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
            {items}
          </Section>
        </TableView>
        <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC' }}>
          <Field
            label="投票数量"
            placeholder="输入PCX数量"
            name="votingAmount"
            fieldName="votingAmount"
            component={TextField}
            showClearButton={!!votingAmount && votingAmount.length > 0}
            change={change}
            separator={false}
          />
          <TouchableOpacity style={styles.button} onPress={this.toVote.bind(this)}>
            <Text style={styles.buttonText}>投票</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#EFEFF4' }]} onPress={this.toClaim.bind(this)}>
            <Text style={[styles.buttonText, { color: '#007AFF' }]}>提息</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
