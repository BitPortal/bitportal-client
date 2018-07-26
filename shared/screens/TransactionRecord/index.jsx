import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Text, View, ScrollView, TouchableOpacity, Clipboard } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { IntlProvider, FormattedMessage, FormattedNumber, FormattedDate, FormattedTime, FormattedRelative } from 'react-intl'
import * as transactionActions from 'actions/transaction'
import QRCode from 'react-native-qrcode-svg'
import LinearGradientContainer from 'components/LinearGradientContainer'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    transactionDetail: state.transaction.get('detail')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class TransactionRecord extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    isCopied: false
  }

  checkBlockInfo = () => {
    const uri = 'https://explorer.eoseco.com/'
    Navigation.push(this.props.componentId, {
      component: { name: 'BitPortal.BPWebView', passProps: { uri, needLinking: true } }
    })
  }

  goBack = () => {
    Navigation.pop(this.props.componentId)
  }

  clipboard = () => {
    Clipboard.setString(this.props.transactionInfo.getIn(['action_trace', 'trx_id']))
    this.setState({ isCopied: true })
  }

  getInfo = (transactionInfo, transactionResult) => {
    let time
    let blockHeight
    let fromAccount
    let toAccount
    let memo
    let quantity
    let amount
    let symbol
    let transactionId

    if (transactionInfo) {
      time = transactionInfo.get('block_time')
      blockHeight = transactionInfo.get('block_num')
      fromAccount = transactionInfo.getIn(['action_trace', 'act', 'data', 'from'])
      toAccount = transactionInfo.getIn(['action_trace', 'act', 'data', 'to'])
      quantity = transactionInfo.getIn(['action_trace', 'act', 'data', 'quantity'])
      memo = transactionInfo.getIn(['action_trace', 'act', 'data', 'memo'])
      amount = quantity && quantity.split(' ')[0]
      symbol = quantity && quantity.split(' ')[1]
      transactionId = transactionInfo.getIn(['action_trace', 'trx_id'])
    } else if (transactionResult) {
      time = Date.now()
      blockHeight = null
      fromAccount = transactionResult.getIn(['processed', 'action_traces', '0', 'act', 'data', 'from'])
      toAccount = transactionResult.getIn(['processed', 'action_traces', '0', 'act', 'data', 'to'])
      quantity = transactionResult.getIn(['processed', 'action_traces', '0', 'act', 'data', 'quantity'])
      memo = transactionResult.getIn(['processed', 'action_traces', '0', 'act', 'data', 'memo'])
      amount = quantity && quantity.split(' ')[0]
      symbol = quantity && quantity.split(' ')[1]
      transactionId = transactionResult.get('transaction_id')
    }

    return { time, blockHeight, fromAccount, toAccount, memo, amount, symbol, transactionId }
  }

  componentDidMount() {
    if (this.props.transferResult) {
      const id = this.props.transferResult.get('transaction_id')
      this.props.actions.getTransactionDetailRequested({ id })
    }
  }

  getBgColor = (info) => {
    if (info && info.get && info.get('broadcast') ) return Colors.tradeSuccess
    else return Colors.tradeFailed
  }

  getIconName = (info) => {
    if (info && info.get && info.get('broadcast') ) return "ios-checkmark"
    else return "ios-close"
  }

  getStatus = (info) => {
    if (info && info.get && info.get('broadcast') ) return <FormattedMessage id="tx_sec_title_sdsuc" />
    else return <FormattedMessage id="tx_sec_title_sdfail" />
  }
  
  render() {
    const { isCopied } = this.state
    const { locale, transactionInfo, transactionResult } = this.props
    const {
      time,
      blockHeight,
      fromAccount,
      toAccount,
      memo,
      amount,
      symbol,
      transactionId
    } = this.getInfo(transactionInfo, transactionResult)
    const graBgColor = this.getBgColor(transactionInfo || transactionResult)
    const iconMark = this.getIconName(transactionInfo || transactionResult)
    const txStatus = this.getStatus(transactionInfo || transactionResult)
    console.log('###', transactionInfo, transactionResult.toJS())
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].tx_title_name_txrcd}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.goBack()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.content}>

                <LinearGradientContainer type="right" colors={graBgColor} style={[styles.between, styles.header]}>
                  <Text style={styles.text12}>
                    {transactionResult && <FormattedRelative value={time} updateInterval={1000} />}
                    {!transactionResult && <FormattedDate value={+new Date(`${time}Z`)} year="numeric" month="long" day="2-digit" />} {!transactionResult && <FormattedTime value={+new Date(`${time}Z`)} />}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={iconMark} size={26} color={Colors.bgColor_FAFAFA} />
                    <Text style={[styles.text14, { marginLeft: 10 }]}>
                      {txStatus}
                    </Text>
                  </View>
                </LinearGradientContainer>
                
                <View style={[styles.header2, styles.between]}>
                  <View style={[styles.center, { marginHorizontal: 15 }]}>
                    <Text style={styles.text10}><FormattedMessage id="tx_sec_title_from" /></Text>
                    <Text numberOfLines={1} style={styles.text12}>{fromAccount}</Text>
                  </View>
                  <View style={{ marginTop: 15 }}>
                    <Ionicons
                      size={20}
                      color={Colors.textColor_74_74_74}
                      name="ios-arrow-round-forward-outline"
                    />
                  </View>
                  <View style={[styles.center, { marginHorizontal: 15 }]}>
                    <Text style={styles.text10}><FormattedMessage id="tx_sec_title_to" /></Text>
                    <Text numberOfLines={1} style={styles.text12}>{toAccount}</Text>
                  </View>
                </View>
                <View style={styles.amountContent}>
                  <Text style={[styles.text14, { marginLeft: -3, marginBottom: 3 }]}>
                    <FormattedMessage id="tx_sec_title_amount" />:
                  </Text>
                  <View style={[styles.between, { alignItems: 'center' }]}>
                    <Text style={styles.text24}>
                      <FormattedNumber
                        value={amount}
                        maximumFractionDigits={4}
                        minimumFractionDigits={4}
                      />
                    </Text>
                    <Text style={styles.text14}> {symbol}</Text>
                  </View>
                  <Text style={[styles.text14, { marginLeft: -3, marginTop: 15 }]}>
                    <FormattedMessage id="tx_sec_button_detail" />:
                  </Text>
                  <Text style={[styles.text14, { marginLeft: -3, marginTop: 4, marginBottom: 10 }]}># {memo}</Text>
                </View>
                <View style={styles.card}>
                  <View style={[styles.separator, styles.between]}>
                    <View style={[styles.semicircle, { marginLeft: -5 }]} />
                    <View style={[styles.semicircle, { marginRight: -5 }]} />
                  </View>
                  <View style={[styles.between]}>
                    <View style={{ marginLeft: 20, height: 140, justifyContent: 'space-between' }}>
                      <Text style={[styles.text14, { marginTop: 10 }]}>
                        <FormattedMessage id="txdtl_title_name_tctID" />:
                      </Text>
                      <Text onPress={this.checkBlockInfo} numberOfLines={1} style={styles.text14}>
                        # <Text style={{ color: Colors.textColor_89_185_226, textDecorationLine: 'underline' }}>
                          {transactionId && `${transactionId.slice(0, 7)}....${transactionId.slice(-7)}`}
                        </Text>
                      </Text>
                      <Text style={[styles.text14, { marginTop: 15 }]}>
                        <FormattedMessage id="txdtl_title_name_block" />:
                      </Text>
                      <Text onPress={this.checkBlockInfo} numberOfLines={1} style={[styles.text14, { marginBottom: 15 }]}>
                        # <Text style={{ color: Colors.textColor_89_185_226, textDecorationLine: 'underline' }}>
                          {blockHeight}
                        </Text>
                      </Text>
                      <Text style={styles.text14}><FormattedMessage id="txdtl_title_name_producer" />:</Text>
                      <Text numberOfLines={1} style={styles.text14}># EOS.IO </Text>
                    </View>
                    <View style={{ marginRight: 20, marginTop: 10, alignItems: 'center' }}>
                      <View style={{ padding: 3, backgroundColor: Colors.bgColor_FFFFFF }}>
                        <QRCode
                          value={transactionId}
                          size={80}
                          color="black"
                        />
                      </View>
                      <TouchableOpacity
                        disabled={isCopied}
                        onPress={this.clipboard}
                        style={[styles.btn, styles.center]}
                      >
                        <Text style={[styles.text14, { color: Colors.textColor_107_107_107 }]}>
                          {isCopied ? <FormattedMessage id="txdtl_title_button_copied" /> : <FormattedMessage id="txdtl_title_button_copy" />}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
