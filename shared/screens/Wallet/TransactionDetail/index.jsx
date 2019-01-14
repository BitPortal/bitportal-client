import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, ActionSheetIOS, AlertIOS, Alert, Text, ActivityIndicator, Animated, Image, TouchableHighlight, Clipboard, RefreshControl } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import * as identityActions from 'actions/identity'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import { injectIntl } from 'react-intl'
import { activeWalletSelector} from 'selectors/wallet'
import { activeWalletTransactionSelector } from 'selectors/transaction'
import Sound from 'react-native-sound'
import * as transactionActions from 'actions/transaction'
import styles from './styles'

const { Section, Item } = TableView

Sound.setCategory('Playback')
const copySound = new Sound('copy.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error)
    return
  }

  console.log(`duration in seconds: ${copySound.getDuration()}number of channels: ${copySound.getNumberOfChannels()}`)
})

@injectIntl

@connect(
  state => ({
    getTransaction: state.getTransaction,
    activeWallet: activeWalletSelector(state),
    transaction: activeWalletTransactionSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...transactionActions
    }, dispatch)
  })
)

export default class TransactionDetail extends Component {
  static get options() {
    return {
      topBar: {
        backButton: {
          title: '返回'
        },
        noBorder: true
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)
  state = { showModal: false, showModalContent: false, pending: false }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.transaction && nextProps.transaction.pending !== prevState.pending) {
      return {
        pending: nextProps.transaction.pending
      }
    } else {
      return null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.pending !== this.state.pending && !this.state.pending) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          title: {
            text: `${this.props.symbol} 转账成功`
          }
        }
      })
    }
  }

  copy = (text) => {
    this.setState({ showModal: true, showModalContent: true }, () => {
      Clipboard.setString(text)
      copySound.play((success) => {
        if (success) {
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
          copySound.reset()
        }
      })

      setTimeout(() => {
        this.setState({ showModal: false }, () => {
          this.setState({ showModalContent: false })
        })
      }, 1000)
    })
  }

  componentDidAppear() {
    // this.props.actions.getTransaction.requested({ ...this.props.activeWallet, transactionId: this.props.transaction.id })
  }

  render() {
    const { transaction, intl, chain, precision, symbol } = this.props

    if (transaction && chain === 'EOS') {
      return (
        <ScrollView
          style={{ flex: 1, backgroundColor: 'white' }}
          contentContainerStyle={{ backgroundColor: 'white' }}
        >
          <View style={{ flex: 1, backgroundColor: '#F7F7F7', padding: 16, paddingTop: 0 }}>
            {+transaction.change >= 0 && <Text style={{ fontSize: 28, fontWeight: '500' }}>+{intl.formatNumber(transaction.change, { minimumFractionDigits: precision, maximumFractionDigits: precision })}</Text>}
            {+transaction.change < 0 && <Text style={{ fontSize: 28, fontWeight: '500' }}>{intl.formatNumber(transaction.change, { minimumFractionDigits: precision, maximumFractionDigits: precision })}</Text>}
            <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.48)', marginTop: 6 }}>{intl.formatTime(+transaction.timestamp, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'white', borderTopWidth: 0.5, borderColor: 'rgba(0,0,0,0.18)' }}>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>收款帐号</Text>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, transaction.action_trace.act.data.to)}>
                  <View style={{ flexDirection: 'row', minHeight: 26, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.action_trace.act.data.to} </Text>
                    <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18, marginBottom: 2 }}
                    />
                  </View>
                </TouchableHighlight>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>付款帐号</Text>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, transaction.action_trace.act.data.from)}>
                  <View style={{ flexDirection: 'row', minHeight: 26, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.action_trace.act.data.from} </Text>
                    <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18, marginBottom: 2 }}
                    />
                  </View>
                </TouchableHighlight>
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 4 }}>备注</Text>
                {!!transaction.action_trace.act.data.memo && <Text style={{ fontSize: 15 }}>{transaction.action_trace.act.data.memo}</Text>}
                {!transaction.action_trace.act.data.memo && <Text style={{ fontSize: 15 }}>无</Text>}
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>区块高度</Text>
                <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.block_num}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>合约帐号</Text>
                <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.action_trace.act.account}</Text>
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 4 }}>交易号</Text>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, transaction.id)}>
                  <Text style={{ fontSize: 15 }}>
                    {`${transaction.id} `}
                     <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18 }}
                    />
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <Modal
            isVisible={this.state.showModal}
            backdropOpacity={0}
            useNativeDriver
            animationIn="fadeIn"
            animationInTiming={200}
            backdropTransitionInTiming={200}
            animationOut="fadeOut"
            animationOutTiming={200}
            backdropTransitionOutTiming={200}
          >
            {this.state.showModalContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>已复制</Text>
              </View>
            </View>}
          </Modal>
        </ScrollView>
      )
    } else if (transaction && chain === 'ETHEREUM') {
      return (
        <ScrollView
          style={{ flex: 1, backgroundColor: 'white' }}
          contentContainerStyle={{ backgroundColor: 'white' }}
        >
          <View style={{ flex: 1, backgroundColor: '#F7F7F7', padding: 16, paddingTop: 0 }}>
            {+transaction.change >= 0 && <Text style={{ fontSize: 28, fontWeight: '500' }}>+{intl.formatNumber(transaction.change, { minimumFractionDigits: precision, maximumFractionDigits: precision })}</Text>}
            {+transaction.change < 0 && <Text style={{ fontSize: 28, fontWeight: '500' }}>{intl.formatNumber(transaction.change, { minimumFractionDigits: precision, maximumFractionDigits: precision })}</Text>}
            <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.48)', marginTop: 6 }}>{intl.formatTime(+transaction.timestamp, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'white', borderTopWidth: 0.5, borderColor: 'rgba(0,0,0,0.18)' }}>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 4 }}>收款地址</Text>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, transaction.to)}>
                  <Text style={{ fontSize: 15 }}>
                    {`${transaction.to} `}
                    <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18 }}
                    />
                  </Text>
                </TouchableHighlight>
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 4 }}>付款地址</Text>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, transaction.from)}>
                  <Text style={{ fontSize: 15 }}>
                    {`${transaction.from} `}
                    <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18 }}
                    />
                  </Text>
                </TouchableHighlight>
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>Gas消耗</Text>
                <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.gasUsed}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>Gas价格</Text>
                {transaction.gasPrice !== '--' && <Text style={{ fontSize: 20, lineHeight: 26 }}>{intl.formatNumber(+transaction.gasPrice * Math.pow(10, -9), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gwei</Text>}
                {transaction.gasPrice === '--' && <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.gasPrice}</Text>}
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>确认数</Text>
                <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.confirmations}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>区块高度</Text>
                <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.blockNumber}</Text>
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 4 }}>交易号</Text>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, transaction.id)}>
                  <Text style={{ fontSize: 15 }}>
                    {`${transaction.id} `}
                    <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18 }}
                    />
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <Modal
            isVisible={this.state.showModal}
            backdropOpacity={0}
            useNativeDriver
            animationIn="fadeIn"
            animationInTiming={200}
            backdropTransitionInTiming={200}
            animationOut="fadeOut"
            animationOutTiming={200}
            backdropTransitionOutTiming={200}
          >
            {this.state.showModalContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>已复制</Text>
              </View>
            </View>}
          </Modal>
        </ScrollView>
      )
    } else if (transaction && chain === 'BITCOIN') {
      return (
        <ScrollView
          style={{ flex: 1, backgroundColor: 'white' }}
          contentContainerStyle={{ backgroundColor: 'white' }}
        >
          <View style={{ flex: 1, backgroundColor: '#F7F7F7', padding: 16, paddingTop: 0 }}>
            {+transaction.change >= 0 && <Text style={{ fontSize: 28, fontWeight: '500' }}>+{intl.formatNumber(transaction.change, { minimumFractionDigits: precision, maximumFractionDigits: precision })}</Text>}
            {+transaction.change < 0 && <Text style={{ fontSize: 28, fontWeight: '500' }}>{intl.formatNumber(transaction.change, { minimumFractionDigits: precision, maximumFractionDigits: precision })}</Text>}
            <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.48)', marginTop: 6 }}>{intl.formatTime(+transaction.timestamp, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'white', borderTopWidth: 0.5, borderColor: 'rgba(0,0,0,0.18)' }}>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 4 }}>收款地址</Text>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, transaction.vout[0].scriptPubKey && transaction.vout[0].scriptPubKey.addresses && transaction.vout[0].scriptPubKey.addresses[0])}>
                  <Text style={{ fontSize: 15 }}>
                    {`${transaction.vout[0].scriptPubKey && transaction.vout[0].scriptPubKey.addresses && transaction.vout[0].scriptPubKey.addresses[0]} `}
                    <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18 }}
                    />
                  </Text>
                </TouchableHighlight>
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 4 }}>付款地址</Text>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, transaction.vin[0].addr)}>
                  <Text style={{ fontSize: 15 }}>
                    {`${transaction.vin[0].addr} `}
                    <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18 }}
                    />
                  </Text>
                </TouchableHighlight>
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>确认数</Text>
                <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.confirmations}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>矿工费用</Text>
                <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.fees}</Text>
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View style={{ width: '50%' }}>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)' }}>区块高度</Text>
                <Text style={{ fontSize: 20, lineHeight: 26 }}>{transaction.blockheight}</Text>
              </View>
              <View style={{ position: 'absolute', height: 0.5, left: 16, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 60 }}>
              <View>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.48)', marginBottom: 4 }}>交易号</Text>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, transaction.id)}>
                  <Text style={{ fontSize: 15 }}>
                    {`${transaction.id} `}
                    <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18 }}
                    />
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <Modal
            isVisible={this.state.showModal}
            backdropOpacity={0}
            useNativeDriver
            animationIn="fadeIn"
            animationInTiming={200}
            backdropTransitionInTiming={200}
            animationOut="fadeOut"
            animationOutTiming={200}
            backdropTransitionOutTiming={200}
          >
            {this.state.showModalContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>已复制</Text>
              </View>
            </View>}
          </Modal>
        </ScrollView>
      )
    }

    return null
  }
}
