import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { injectIntl } from 'react-intl'
import { Navigation } from 'react-native-navigation'
import { activeWalletSelector, identityBTCWalletSelector, importedBTCWalletSelector } from 'selectors/wallet'
import FastImage from 'react-native-fast-image'
import * as walletActions from 'actions/wallet'
import * as assetActions from 'actions/asset'
import EStyleSheet from 'react-native-extended-stylesheet'
import { getDepositOpReturn, getAddressByAccount, getTrusteeSessionInfo } from 'core/chain/chainx'
import Dialog from 'components/Dialog'

const styles = EStyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 138'
  },
  textAreaFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 52'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17
  }
})

@injectIntl

@connect(
  state => ({
    activeWallet: activeWalletSelector(state),
    identityBTCWallet: identityBTCWalletSelector(state),
    importedBTCWallet: importedBTCWalletSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...assetActions
    }, dispatch)
  })
)


export default class ChainXDeposit extends Component {
  static get options() {
    return {
      topBar: {
        leftButtons: [
          {
            id: 'cancel',
            text: '取消'
          }
        ],
        rightButtons: [
          {
            id: 'chainxDepositHistory',
            text: '充值记录'
          }
        ],
        largeTitle: {
          visible: false
        },
        background: {
          color: 'rgba(0,0,0,0)',
          translucent: true
        },
        noBorder: true
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    bindedBTCAddress: [],
    depositBTCAddress: [],
    loaded: false
  }

  componentDidAppear() {
  }

  componentDidDisappear() {
  }


  navigationButtonPressed({buttonId}) {
    if (buttonId === 'chainxDepositHistory') {
      Dialog.alert('提示', '功能正在开发中...')
    } else if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    }
  }

  async componentDidMount() {
    const { activeWallet } = this.props
    const bindedBTCAddress = await getAddressByAccount(activeWallet.address)
    const trustee = await getTrusteeSessionInfo()
    const depositBTCAddress = trustee.hotEntity.addr
    this.setState({ bindedBTCAddress })
    this.setState({ depositBTCAddress })
    this.setState({ loaded: true })
  }

  onRefresh = () => {
  }

  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  toDepositBTC = () => {
    const { identityBTCWallet, importedBTCWallet } = this.props
    if (!this.state.loaded || !this.state.depositBTCAddress) {
      Dialog.alert('提示', '正在加载充值数据，请稍后')
      return false
    }
    if (!this.props.activeWallet.address) {
      Dialog.alert('提示', '当前并非ChainX地址，请切换到ChainX钱包！')
      return false
    }
    const opReturn = getDepositOpReturn(this.props.activeWallet.address)

    const presetWallet = identityBTCWallet || importedBTCWallet

    if (!(presetWallet && presetWallet.id)) {
      Dialog.alert('提示', '没有发现已经创建或导入的Bitcoin钱包')
      return false
    }
    this.props.actions.setTransferWallet(presetWallet.id)
    this.props.actions.setActiveAsset('BITCOIN/BTC')
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.TransferAsset',
            passProps: {
              presetWalletId: presetWallet.id,
              presetAddress: this.state.depositBTCAddress,
              presetOpReturn: opReturn,
            },
            options: {
              topBar: {
                title: {
                  text: 'ChainX 跨链资产充值'
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    text: '取消'
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  toMappingSDOT = () => {
    Dialog.alert('提示', '正在开发中')
    return false

    const presetWallet = identityETHWallet || importedETHWallet

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.TransferAsset',
            passProps: {
              presetWalletId: this.props.identityETHWallet.id,
              presetAddress: '3FK7PJiukCS57aPhMdtc6soqKTrQogX2Zz',
              presetOpReturn: '35533632687a345a73636863526e58536e4b5859507a6268316161594e774e736563574338657176366b5072674a315340426974506f7274616c',
            },
            options: {
              topBar: {
                title: {
                  text: '映射 SDOT 到ChainX'
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    text: '取消'
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  toDepositRule = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WebView',
        passProps: {
          url: 'http://s.bitportal.io/7yk58',
          id: 0
        },
        largeTitle: {
          visible: false
        },
        options: {
          topBar: {
            title: {
              text: 'ChainX充值规则'
            }
          }
        }
      }
    })
  }

  toClaimDeposit = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.ChainXDepositClaim',
            passProps: {

            },
            options: {
              topBar: {
                title: {
                  text: '充值提息'
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    text: '取消'
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  render() {
    const { intl, activeWallet } = this.props

    const isIdentityWallet = true
    const currentChainXAddress = activeWallet.chain === 'CHAINX' && activeWallet.address
    const bindedBTCAddress = this.state.bindedBTCAddress

    // if (!currentChainXAddress) {
    //   return (
    //     <View styles={styles.container, {alignItems: 'center'}}>
    //       <Text>当前地址并非ChainX地址，请先切换到ChainX钱包。</Text>
    //     </View>
    //   )
    // }

    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
        >
          <FastImage
            source={require('resources/images/AddIdentityBackground.png')}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
          />
        </View>
        <ScrollView
          style={{ height: '100%' }}
          showsHorizontalScrollIndicator={false}
          ref={(ref) => { this.scrollView = ref; return null }}
        >
        <View style={{width: '100%', height: 420, paddingHorizontal: 16, paddingVertical: 20 }}>
          <Text style={{fontSize: 30, marginBottom: 10}}>参与</Text>
          <Text style={{fontSize: 30, marginBottom: 20}}>
            ChainX <Text style={{color: '#007AFF'}}>充值挖矿</Text>
          </Text>
          <Text style={{fontSize: 17, marginBottom: 20}}>
            BitPortal将会自动帮您生成绑定的信息，您只需输入充值的BTC金额或映射的SDOT，便可以一键充值BTC到ChainX，参与ChainX充值挖矿。
          </Text>
          <Text style={{fontSize: 17, marginBottom: 5}}>
            当前ChainX地址：
          </Text>
          <Text style={{fontSize: 17, paddingLeft: 20, marginBottom: 5}}>
            {this.props.activeWallet.address}
          </Text>

            <Text style={{fontSize: 17, marginBottom: 3}}>
              当前已绑定BTC地址：
            </Text>
          <View>
          <ScrollView
            style={{ height: 100 }}
            showsHorizontalScrollIndicator={false}
            ref={(ref) => { this.scrollView = ref; return null }}
          >
            <Text style={{fontSize: 17, paddingLeft: 20, marginBottom: 40}}>
              {this.state.loaded ? this.state.bindedBTCAddress: '正在加载'}
            </Text>
          </ScrollView>
          </View>

          <Text style={{fontSize: 17, marginBottom: 30, color: '#007AFF'}} onPress={this.toDepositRule}>阅读奖励规则...</Text>
          <TouchableOpacity style={styles.button} onPress={this.toDepositBTC}>
            <Text style={styles.buttonText}>绑定并充值BTC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {backgroundColor: '#EFEFF4'}]} onPress={this.toClaimDeposit.bind(this)}>
            <Text style={[styles.buttonText, {color: '#007AFF'}]}>充值提息</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </SafeAreaView>
      //
      // <View style={styles.container}>
      //   <View styles={styles.container, { margin: '20%' }}>
      //     <Text>本操作会将对应的Bitcoin（BTC）地址绑定到ChainX的跨链地址</Text>
      //     <Text>完成绑定后，只需向ChainX的跨链充值地址转入bitcoin，即可完成跨链充值</Text>
      //     <Text>请注意：跨链绑定只对发出交易的Bitcoin单地址有效，如果更换地址，则需要重新绑定</Text>
      //   </View>
      //
      //   <View>
      //     <Text>当前ChainX地址：</Text>
      //     <Text>{ currentChainXAddress }</Text>
      //   </View>
      //
      //   <View>
      //     <Text>当前已绑定地址：</Text>
      //     { bindedBTCAddress.map(address => (<Text>绑定地址：{address}</Text>))}
      //   </View>
      //
      //   { isIdentityWallet && (<Text> 当前处于身份钱包下，可以一键绑定</Text>) }
      //
      //   <Button
      //     title="绑定并充值BTC"
      //     style={styles.button}
      //     onPress={this.toDepositBTC.bind(this)}
      //   />
      //   <Button
      //     title="映射SDOT"
      //     style={styles.button}
      //     onPress={this.toMappingSDOT.bind(this)}
      //     disabled
      //   />
      // </View>
    )
  }
}
