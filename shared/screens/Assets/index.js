
import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TotalAssets from './TotalAssets'
import Header from './Header'
import EnableAssets from './EnableAssets'
import AssetsList from './AssetsList'
import styles from './styles'
import Colors from 'resources/colors'
import Modal from 'react-native-modal'
import AssetQRCode from './AssetQRCode'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as assetsActions from 'actions/assets'
import storage from 'utils/storage'
import _ from 'lodash'
import AccountList from './AccountList'
import Eos from 'react-native-eosjs'
import keygen from 'eos/keygen'
import Keystore from 'eos/keystore'
import secureStorage from 'utils/secureStorage'
import * as walletActions from 'actions/wallet'

@connect(
  (state) => ({
    locale: state.intl.get('locale'),
    assetsInfo: state.assets.get('data'),
    wallet: state.wallet
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...assetsActions,
      ...walletActions
    }, dispatch)
  })
)

export default class Assets extends BaseScreen {
  constructor(props, context) {
    super(props, context)

    this.state = {
      isVisible: false,
      isVisible2: false
    }

    this.switchEOSAccount = this.switchEOSAccount.bind(this)
  }

  // 展示账户列表
  displayAccountList = () => {
    this.setState({ isVisible2: true })
  }

  // 前往扫描
  scanQR = () => {
    this.props.navigator.push({
      screen: 'BitPortal.QRCodeScanner'
   })
  }

  // 激活钱包
  enableAssets = () => {
    this.props.navigator.push({
      screen: "BitPortal.AvailableAssets"
    })
  }

  // 查看资产情况
  checkAsset = (assetInfo) => {
    this.props.navigator.push({
      screen: 'BitPortal.AssetChart',
      passProps: { assetInfo }
    })
  }

  // 钱包二维码
  operateAssetQRCode = (isVisible) => {
    this.setState({ isVisible })
  }

  // 从本地获取全部资产信息
  getAssetsInfo = async () => {
    try {
      const assetsInfo = await storage.getItem('bitportal_assets_info')
      if (assetsInfo) {
        this.props.actions.getAssetsInfo(JSON.parse(assetsInfo).data)
      }
    } catch (error) {
      console.error(`AsyncStorage getItem Error: ${error.message}`)
    }
  }

  // 创建新账户
  createNewAccount = () => {
    this.props.navigator.push({
      screen: "BitPortal.AccountCreation"
    })
  }

  switchEOSAccount = (name) => {
    this.props.actions.switchEOSAccount({ name })
  }

  componentDidMount() {
    this.props.actions.createEOSAccountRequested({
      creator: 'eosio',
      name: 'hellotg',
      recovery: 'eosio',
      keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
    })
  }

  render() {
    const { assetsInfo, wallet } = this.props
    const accountName = wallet.get('account').get('account_name')
    const accountList = wallet.get('accounts')

    let enabledAssetInfo = assetsInfo.find((item) => item.get('enable') === true )
    return (
      <View style={styles.container}>
        <Header Title="Account" displayAccount={() => this.displayAccountList()} scanQR={() => this.scanQR()} />
        {
          !enabledAssetInfo &&
          <TouchableOpacity onPress={() => this.createNewAccount()} style={[styles.createAccountContainer, styles.center]}>
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="ios-add-outline" size={40} color={Colors.bgColor_FFFFFF} />
              <Text style={[styles.text14, { color: Colors.textColor_255_255_238, marginTop: 20 }]}>
                Create New Account
              </Text>
            </View>
          </TouchableOpacity>
        }
        {
          enabledAssetInfo &&
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TotalAssets totalAssets={425321132.21} accountName={accountName} onPress={() => this.operateAssetQRCode(true)} />
              <EnableAssets Title="Asset" enableAssets={() => this.enableAssets()} />
              <AssetsList data={enabledAssetInfo.get('assetsList')} onPress={(e) => this.checkAsset(e)} />
            </ScrollView>
          </View>
        }
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={this.state.isVisible}
          backdropOpacity={0.9}
        >
          <AssetQRCode
            assetName={'Meon'}
            dismissModal={() => this.operateAssetQRCode(false)}
          />
        </Modal>
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          style = {{  margin: 0 }}
          isVisible={this.state.isVisible2}
          backdropOpacity={0}
        >
          <AccountList
            data={accountList}
            activeAccount={accountName}
            onPress={this.switchEOSAccount}
            createNewAccount={() => this.createNewAccount()}
            dismissModal={() => this.setState({ isVisible2: false })}
          />
        </Modal>
      </View>
    )
  }
}
