import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TouchableHighlight, TextInput, Alert, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'utils/redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Field, reduxForm, getFormSyncWarnings, getFormValues } from 'redux-form'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import Modal from 'react-native-modal'
import assert from 'assert'
import * as balanceActions from 'actions/balance'
import FastImage from 'react-native-fast-image'
import { activeWalletSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector } from 'selectors/balance'
import { voteClaim, vote } from 'core/chain/chainx'
import secureStorage from 'core/storage/secureStorage'
import Dialog from 'components/Dialog'
import chainxAccount from '@chainx/account'
import styles from './style'


const { Section, Item, Cell } = TableView

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
    errors.votingAmount = gt('请输入投票数额')
  }

  return errors
}

@injectIntl

@reduxForm({ form: 'chainxVotingAmountForm', validate })

@connect(
  state => ({
    activeWallet: activeWalletSelector(state),
    formValues: getFormValues('chainxVotingAmountForm')(state),
    balance: activeWalletBalanceSelector(state),
    getBalance: state.getBalance
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...balanceActions
    }, dispatch)
  })
)

export default class ChainXValidatorDetail extends Component {
  static get options() {
    return {
      topBar: {
        leftButtons: [
          {
            id: 'cancel',
            text: gt('返回')
          }
        ],
        rightButtons: [
          {
            id: 'help',
            text: gt('详情')
          }
        ],
        largeTitle: {
          visible: false
        },
        title: {
          text: gt('节点详情')
        },
        backButton: {
          title: gt('返回')
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissAllModals()
    } else if (buttonId === 'help') {
      const account = this.props.account
      const url = `https://scan.chainx.org/validators/all/${account.toString()}`
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
                text: t(this,'节点详情 - 更多')
              }
            }
          }
        }
      })
    }
  }

  state = {
    txLoading: false,
    txError: ''
  }

  formatBalance = (balance, num = 8) => (parseInt(balance) * Math.pow(10, -num)).toFixed(num).toString()

  toVote = () => {
    const { intl } = this.props
    const votingAmount = this.props.formValues && this.props.formValues.votingAmount
    if (!votingAmount) {
      Dialog.alert(t(this,'提示'), t(this,'请输入投票数量'))
      return
    }
    const hint = t(this,'本次操作将为该节点投票{message} PCX',{message:parseFloat(votingAmount).toFixed(8)})
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      hint,
      [
        {
          text: intl.formatMessage({ id: 'alert_button_cancel' }),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
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
    const { intl } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
     t(this,'本次操作将提取该节点的利息'),
      [
        {
          text: intl.formatMessage({ id: 'alert_button_cancel' }),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
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

    this.setState({ txLoading: true })
    setTimeout(() => {
      if (this.state.txLoading === true) {
        this.setState({
          txLoading: false,
          txError: t(this,'交易超时，请检查区块链浏览器以确认交易是否完成')
        })
      }
    }, 30000)

    if (!activeWallet || activeWallet.chain !== 'CHAINX' || !activeWallet.id) {
      Dialog.alert('Error', t(this,'当前钱包并非有效的ChainX钱包'))
      console.error( t(this,'当前钱包并非有效的ChainX钱包'), activeWallet)
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
          t(this,'发送交易成功'),
          t(this,"投票交易发送成功，请检查区块链信息!交易id:{message}",{message:tx.toString()}),
          {
            text: 'OK',
            onPress: () => {
              console.log('Ok Pressed')
              this.setState({ txLoading: false })
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
        Alert.alert(
          t(this,'错误'),
          `${t(this,'错误')}：${tx.toString()}`,
          [
            { text: 'OK', onPress: () => this.setState({ txLoading: false }) }
          ]
        )
      }
      this.props.actions.getBalance.refresh(this.props.activeWallet)
    } catch (e) {
      Alert.alert(
        t(this,'错误'),
        `${t(this,'错误')}：${e.toString()}`,
        [
          { text: 'OK', onPress: () => this.setState({ txLoading: false }) }
        ]
      )
    }
  }

  voteClaim = async (targetAddress, password) => {
    const { activeWallet } = this.props
    const id = activeWallet.id

    if (!activeWallet || activeWallet.chain !== 'CHAINX' || !activeWallet.id) {
      Dialog.alert('Error', t(this,'当前钱包并非有效的ChainX钱包'))
      console.error( t(this,'当前钱包并非有效的ChainX钱包'), activeWallet)
      return
    }

    const importedKeystore = await secureStorage.getItem(`IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = await secureStorage.getItem(`IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    try {
      const tx = await voteClaim(password, keystore, activeWallet.address, targetAddress)
      if (tx) {
        Dialog.alert(t(this,'发送交易成功'), t(this,'提息交易发送成功，请检查区块链信息!交易id:{message}',{message:tx.toString()}))
      } else {
        console.error(t(this,'提息失败'), tx.toString())
        Dialog.alert(t(this,'错误'), t(this,'提息失败'))
      }
      this.props.actions.getBalance.refresh(this.props.activeWallet)
    } catch (e) {
      Dialog.alert(t(this,'提息失败'), `${t(this,'错误')}：${e.toString()}`)
    }
  }

  onModalHide = () => {
    const error = this.state.txError

    if (error !== '') {
      setTimeout(() => {
        Alert.alert(
          'Error',
          this.state.txError.toString(),
          [
            { text: t(this,'确定'), onPress: () => this.setState({ txError: '' }) }
          ]
        )
      }, 20)
    }
  }

  render() {
    const { formValues, change, intl, balance, name, account, about, isActive, isValidator, isTruestee, jackpot, jackpotAccount, sessionKey, pendingInterestStr } = this.props
    const votingAmount = formValues && formValues.passwordHint
    const formatedJackpot = jackpot && this.formatBalance(jackpot)

    const items = []

    if (name) {
      items.push(
        <Item
          reactModuleForCell="ChainXValidatorDetailTableViewCell"
          text={intl.formatMessage({ id: 'chainx_validator_detail_item_name' })}
          type="name"
          key="name"
          detail={name}
          height={60}
          selectionStyle={TableView.Consts.CellSelectionStyle.Default}
        />
      )
    }

    items.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text={intl.formatMessage({ id: 'chainx_validator_detail_item_account' })}
        key="account"
        type="account"
        detail={chainxAccount.encodeAddress(account)}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.Default}
      />
    )

    items.push(
      <Item
        key="jackpot"
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text={intl.formatMessage({ id: 'chainx_validator_detail_item_jackpot' })}
        type="jackpot"
        detail={formatedJackpot}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.Default}
      />
    )

    // items.push(
    //   <Item
    //     reactModuleForCell="ChainXValidatorDetailTableViewCell"
    //     text="出块公钥"
    //     type="sessionKey"
    //     key="sessionKey"
    //     detail={sessionKey}
    //     height={60}
    //     selectionStyle={TableView.Consts.CellSelectionStyle.Default}
    //   />
    // )

    items.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text={intl.formatMessage({ id: 'chainx_validator_detail_item_about' })}
        key="about"
        type="about"
        detail={about}
        height={100}
        selectionStyle={TableView.Consts.CellSelectionStyle.Default}
      />
    )

    items.push(
      <Item
        reactModuleForCell="ChainXValidatorDetailTableViewCell"
        text={t(this,'待领利息')}
        key="pendingInterest"
        type="pendingInterest"
        detail={pendingInterestStr}
        height={60}
        selectionStyle={TableView.Consts.CellSelectionStyle.Default}
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
          <Section>
            <Cell>
              <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC' }}>
                <View style={{ width: '100%', alignItems: 'center', height: 56, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 17, fontWeight: 'bold', marginRight: 16, width: 70 }}>{t(this,'可用余额')}</Text>
                  <Text style={{ fontSize: 17 }}>{balance && balance.balance && balance.balance.toFixed(balance.precision)} {balance.symbol}</Text>
                  <Text style={{ fontSize: 17 }}>{!balance && t(this,'暂时无法显示')}</Text>
                </View>
                <Field
                  label={t(this,'投票数量')}
                  placeholder={t(this,'输入PCX数量')}
                  name="votingAmount"
                  fieldName="votingAmount"
                  component={TextField}
                  showClearButton={!!votingAmount && votingAmount.length > 0}
                  change={change}
                  separator={false}
                />
                <TouchableOpacity style={styles.button} onPress={this.toVote.bind(this)}>
                  <Text style={styles.buttonText}>{t(this,'投票')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#EFEFF4' }]} onPress={this.toClaim.bind(this)}>
                  <Text style={[styles.buttonText, { color: '#007AFF' }]}>{t(this,'提息')}</Text>
                </TouchableOpacity>
              </View>
            </Cell>
          </Section>
        </TableView>
        <Modal
          isVisible={this.state.txLoading}
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
          {this.state.txLoading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#000000" />
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>{t(this,'交易发送中...')}</Text>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
