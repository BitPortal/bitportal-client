import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { View, ActionSheetIOS, Alert, Text, ActivityIndicator, SafeAreaView, SectionList, TouchableNativeFeedback, TextInput, Image, Dimensions } from 'react-native'
import { Navigation } from 'components/Navigation'
import * as walletActions from 'actions/wallet'
import * as producerActions from 'actions/producer'
import { accountByIdSelector, managingAccountVotedProducersSelector } from 'selectors/account'
import { managingWalletSelector } from 'selectors/wallet'
import Modal from 'react-native-modal'
import Dialog from 'components/Dialog'
import { walletIcons } from 'resources/images'
import IndicatorModal from 'components/Modal/IndicatorModal'
import styles from './styles'

const images = {
  vote: require('resources/images/vote_android.png'),
  mnemonic: require('resources/images/backup_android.png'),
  switchAccount: require('resources/images/switch_android.png'),
  address: require('resources/images/wallet_address_android.png'),
  addressType: require('resources/images/switch_android.png'),
  keystore: require('resources/images/export_keystore_android.png'),
  resources: require('resources/images/resource_android.png'),
  createAccount: require('resources/images/add_grey_android.png'),
  privateKey: require('resources/images/private_key_android.png'),
  chainxDeposit: require('resources/images/switch_android.png'),
  chainxVoting: require('resources/images/vote_android.png'),
  chainxWithdrawal: require('resources/images/backup_android.png'),
  chainxScan: require('resources/images/resource_android.png'),
  chainxTool: require('resources/images/chainx_icon.png'),
  chainxStats: require('resources/images/chart_android.png'),
  delete: require('resources/images/delete_orange_android.png')
}

export const errorMessages = (error) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'SegWit requires compressed private key':
      return '隔离见证需要压缩的公钥格式'
    case 'Invalid password':
      return '密码错误'
    default:
      return '操作失败'
  }
}

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    getProducer: state.getProducer,
    deleteWallet: state.deleteWallet,
    exportMnemonics: state.exportMnemonics,
    exportBTCPrivateKey: state.exportBTCPrivateKey,
    exportETHKeystore: state.exportETHKeystore,
    exportETHPrivateKey: state.exportETHPrivateKey,
    exportEOSPrivateKey: state.exportEOSPrivateKey,
    switchBTCAddressType: state.switchBTCAddressType,
    account: accountByIdSelector(state),
    wallet: managingWalletSelector(state),
    votedProducers: managingAccountVotedProducersSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...producerActions
    }, dispatch)
  })
)

export default class ManageWallet extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '管理钱包'
        },
        largeTitle: {
          visible: false
        },
        elevation: 0
      },
      bottomTabs: {
        visible: false
      },
      sideMenu: {
        left: {
          enabled: false
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    showSimpleModal: false,
    showPrompt: false,
    password: '',
    requestPasswordAction: null,
    showWalletNamePrompt: false,
    walletName: ''
  }

  componentDidAppear() {
    if (this.props.fromCard) {
      this.props.actions.setActiveWallet(this.props.wallet.id)
    }
  }

  deleteWallet = () => {
    const { wallet } = this.props
    const password = this.state.password
    const walletId = (wallet && wallet.id) || this.props.id
    const address = (wallet && wallet.address) || this.props.address
    const chain = (wallet && wallet.chain) || this.props.chain

    this.props.actions.deleteWallet.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, fromCard: this.props.fromCard, chain, address })
  }

  exportMnemonics = () => {
    const { wallet } = this.props
    const password = this.state.password
    const walletId = (wallet && wallet.id) || this.props.id
    const source = (wallet && wallet.source) || this.props.source

    this.props.actions.exportMnemonics.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source })
  }

  exportETHKeystore = () => {
    const { wallet } = this.props
    const password = this.state.password
    const walletId = (wallet && wallet.id) || this.props.id
    const source = (wallet && wallet.source) || this.props.source

    this.props.actions.exportETHKeystore.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source })
  }

  exportPrivateKey = () => {
    const { wallet, intl } = this.props
    const password = this.state.password
    const walletId = (wallet && wallet.id) || this.props.id
    const source = (wallet && wallet.source) || this.props.source
    const chain = (wallet && wallet.chain) || this.props.chain
    const address = (wallet && wallet.address) || this.props.address
    const symbol = (wallet && wallet.symbol) || this.props.symbol
    const account = this.props.account[`${chain}/${address}`]
    const permissions = account && account.permissions

    this.props.actions[`export${symbol}PrivateKey`].requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source, address, permissions })
  }

  switchEOSAccount = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.SwitchEOSAccount'
      }
    })
  }

  switchBTCAddress = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.SwitchBTCAddress'
      }
    })
  }

  createNewAccount = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CreateEOSAccount'
      }
    })
  }

  vote = () => {
    if (this.props.getProducer.loaded) this.props.actions.setSelected(this.props.votedProducers)
    this.props.actions.handleProducerSearchTextChange('')

    /* Navigation.push(this.props.componentId, {
     *   component: {
     *     name: 'BitPortal.Voting'
     *   }
     * })*/
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Voting'
          }
        }]
      }
    })
  }

  manageResource = () => {
    const { chain, id, address } = this.props.wallet

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ManageEOSResource',
        passProps: { chain: chain || this.props.chain, walletId: id || this.props.id, address: address || this.props.address },
        options: {
          topBar: {
            backButton: {
              title: '返回'
            }
          }
        }
      }
    })
  }

  clearError = () => {
    this.props.actions.deleteWallet.clearError()
    this.props.actions.exportMnemonics.clearError()
    this.props.actions.exportBTCPrivateKey.clearError()
    this.props.actions.exportETHKeystore.clearError()
    this.props.actions.exportETHPrivateKey.clearError()
    this.props.actions.exportEOSPrivateKey.clearError()
    this.props.actions.switchBTCAddressType.clearError()
    this.setState({ requestPasswordAction: null })
  }

  onModalHide = () => {
    const deleteWalletError = this.props.deleteWallet.error
    const exportMnemonicsError = this.props.exportMnemonics.error
    const exportBTCPrivateKeyError = this.props.exportBTCPrivateKey.error
    const exportETHKeystoreError = this.props.exportETHKeystore.error
    const exportETHPrivateKeyError = this.props.exportETHPrivateKey.error
    const exportEOSPrivateKeyError = this.props.exportEOSPrivateKey.error
    const switchBTCAddressTypeError = this.props.switchBTCAddressType.error
    const error = deleteWalletError || exportMnemonicsError || exportBTCPrivateKeyError || exportETHKeystoreError || exportETHPrivateKeyError || exportEOSPrivateKeyError || switchBTCAddressTypeError

    if (error) {
      Alert.alert(
        errorMessages(error),
        '',
        [
          { text: '确定', onPress: () => this.clearError() }
        ],
        { cancelable: false }
      )
    }
  }

  switchBTCAddressType = () => {
    const { wallet, intl } = this.props
    const password = this.state.password
    const walletId = (wallet && wallet.id) || this.props.id
    const source = (wallet && wallet.source) || this.props.source
    const segWit = (wallet && wallet.segWit) || this.props.segWit

    this.props.actions.switchBTCAddressType.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, segWit, source })
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'toEditWallet') {
      const { name } = data
      const oldName = name

      Alert.prompt(
        '设置钱包名称',
        null,
        [
          {
            text: this.props.intl.formatMessage({ id: 'alert_button_cancel' }),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: this.props.intl.formatMessage({ id: 'alert_button_confirm' }),
            onPress: name => {
              if (name) {
                if (name.length > 30) {
                  Alert.alert(
                    '钱包名称不能超过30个字符',
                    '',
                    [
                      { text: '确定', onPress: () => console.log('ok') }
                    ]
                  )
                } else {
                  this.props.actions.setWalletName.requested({ oldName, name, id: this.props.wallet.id })
                }
              }
            }
          }
        ],
        'plain-text',
        name
      )
    }
  }

  setWalletName = () => {
    const { wallet } = this.props
    const oldName = (wallet && wallet.name) || this.props.name
    const name = this.state.walletName
    this.props.actions.setWalletName.requested({ oldName, name, id: wallet.id })
  }

  chainxDeposit = async (walletId) => {
    const constants = await Navigation.constants()

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.ChainXDeposit',
            passProps: {
              statusBarHeight: constants.statusBarHeight
            }
          }
        }]
      }
    })
  }

  chainxVoting = (walletId) => {
    Navigation.push(this.props.componentId, {
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
  }

  chainxWithdrawal = () => {
    Dialog.alert('Tips', 'Coming Soon')
    return

    Navigation.push({
      component: {
        name: 'BitPortal.ChainxWithdrawal'
      },
      options: {
        topBar: {
          searchBar: true,
          searchBarHiddenWhenScrolling: false,
          searchBarPlaceholder: 'Search'
        }
      }
    })
  }

  chainxToStats = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WebView',
            passProps: {
              url: 'https://stats.chainx.org/#/ChainX?utm=bitportal'
            },
            options: {
              topBar: {
                title: {
                  text: 'ChainX 节点状态'
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    icon: require('resources/images/cancel_android.png')
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  chainxToScan = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WebView',
            passProps: {
              url: 'https://scan.chainx.org?utm=bitportal'
            },
            options: {
              topBar: {
                title: {
                  text: 'ChainX 区块链浏览器'
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    icon: require('resources/images/cancel_android.png')
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  chainxToChainXTool = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WebView',
            passProps: {
              url: 'https://chainxtools.com?utm=bitportal'
            },
            options: {
              topBar: {
                title: {
                  text: 'ChainXTool'
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    icon: require('resources/images/cancel_android.png')
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  onPress = (type) => {
    switch (type) {
      case 'address':
        this.switchBTCAddress()
        return
      case 'addressType':
        this.setState({ showSimpleModal: true })
        return
      case 'mnemonic':
        this.requestPassword('mnemonic')
        return
      case 'privateKey':
        this.requestPassword('privateKey')
        return
      case 'keystore':
        this.requestPassword('keystore')
        return
      case 'delete':
        this.requestPassword('delete')
        return
      case 'resources':
        this.manageResource()
        return
      case 'createAccount':
        this.createNewAccount()
        return
      case 'switchAccount':
        this.switchEOSAccount()
        return
      case 'vote':
        this.vote()
        return
      case 'chainxScan':
        this.chainxToScan()
        return
      case 'chainxStats':
        this.chainxToStats()
        return
      case 'chainxTool':
        this.chainxToChainXTool()
        return
      case 'chainxWithdrawal':
      case 'chainxDeposit':
      case 'chainxVoting':
    }
  }

  selectAddressType = (selectedSegWit) => {
    const { wallet } = this.props
    const segWit = (wallet && wallet.segWit) || this.props.segWit

    this.setState({ showSimpleModal: false })

    if (selectedSegWit !== segWit) {
      setTimeout(() => {
        this.requestPassword('addressType')
      })
    }
  }

  requestPassword = (requestPasswordAction) => {
    this.setState({ showPrompt: true, showSimpleModal: false, password: '', requestPasswordAction })
  }

  changePassword = (text) => {
    this.setState({ password: text })
  }

  clearPassword = () => {
    this.setState({ password: '', showPrompt: false })
  }

  submitPassword = () => {
    this.setState({ showPrompt: false })
    const type = this.state.requestPasswordAction

    switch (type) {
      case 'addressType':
        this.switchBTCAddressType()
        return
      case 'mnemonic':
        this.exportMnemonics()
        return
      case 'privateKey':
        this.exportPrivateKey()
        return
      case 'keystore':
        this.exportETHKeystore()
        return
      case 'delete':
        this.deleteWallet()
        return
      case 'chainxDeposit':
      case 'chainxVoting':
      case 'chainxWithdrawal':
      case 'chainxScan':
      case 'chainxTool':
    }
  }

  hidePrompt = () => {
    this.setState({ showPrompt: false })
  }

  requestChangeWalletName = () => {
    const { wallet } = this.props
    const name = (wallet && wallet.name) || this.props.name
    this.setState({ showWalletNamePrompt: true, walletName: name })
  }

  changeWalletName = (text) => {
    this.setState({ walletName: text })
  }

  cancelChangeWalletName = () => {
    this.setState({ showWalletNamePrompt: false })
  }

  submitWalletName = () => {
    this.setWalletName()
    this.setState({ showWalletNamePrompt: false })
  }

  renderItem = ({ item, index }) => {
    const { intl, wallet } = this.props
    const segWit = (wallet && wallet.segWit) || this.props.segWit

    return (
      <TouchableNativeFeedback onPress={this.onPress.bind(this, item.actionType)} background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 2, height: 48 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image
              source={images[item.actionType]}
              style={{ width: 24, height: 24, marginRight: 30 }}
            />
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: '100%' }}>
              <Text style={{ fontSize: 14, color: item.actionType === 'delete' ? '#FF5722' : 'rgba(0,0,0,0.87)', fontWeight: '500' }}>{item.text}</Text>
            </View>
            {item.actionType === 'addressType' && <View style={{ position: 'absolute', right: 16 }}>
              {segWit === 'P2WPKH' && <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>隔离见证</Text>}
              {segWit !== 'P2WPKH' && <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>普通</Text>}
            </View>}
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderHeader = ({ section: { isFirst } }) => {
    return !isFirst ? <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.12)' }} /> : null
  }

  onBackdropPress = () => {
    this.setState({ showSimpleModal: false })
  }

  onSimpleModalHide = () => {
    // this.setState({ showPrompt: true })
  }

  render() {
    const { deleteWallet, exportMnemonics, exportBTCPrivateKey, exportETHKeystore, exportETHPrivateKey, exportEOSPrivateKey, switchBTCAddressType, wallet } = this.props
    const name = (wallet && wallet.name) || this.props.name
    const address = (wallet && wallet.address) || this.props.address
    const chain = (wallet && wallet.chain) || this.props.chain
    const source = (wallet && wallet.source) || this.props.source
    const id = (wallet && wallet.id) || this.props.id
    const symbol = (wallet && wallet.symbol) || this.props.symbol
    const segWit = (wallet && wallet.segWit) || this.props.segWit

    const deleteWalletLoading = deleteWallet.loading
    const exportMnemonicsLoading = exportMnemonics.loading
    const exportBTCPrivateKeyLoading = exportBTCPrivateKey.loading
    const exportETHKeystoreLoading = exportETHKeystore.loading
    const exportETHPrivateKeyLoading = exportETHPrivateKey.loading
    const exportEOSPrivateKeyLoading = exportEOSPrivateKey.loading
    const switchBTCAddressTypeLoading = switchBTCAddressType.loading
    const loading = deleteWalletLoading || exportMnemonicsLoading || exportBTCPrivateKeyLoading || exportETHKeystoreLoading || exportETHPrivateKeyLoading || exportEOSPrivateKeyLoading || switchBTCAddressTypeLoading

    const editActions = []
    const accountActions = []
    const exportActions = []

    if (chain === 'EOS') {
      editActions.push({
        key: 'vote',
        actionType: 'vote',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_eos_voting' })
      })

      editActions.push({
        key: 'resources',
        actionType: 'resources',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_eos_resource' })
      })

      if (source === 'RECOVERED_IDENTITY' || source === 'NEW_IDENTITY') {
        accountActions.push({
          key: 'switchAccount',
          actionType: 'switchAccount',
          text: this.props.intl.formatMessage({ id: 'manage_wallet_title_eos_switch_account' })
        })

        accountActions.push({
          key: 'createAccount',
          actionType: 'createAccount',
          text: this.props.intl.formatMessage({ id: 'manage_wallet_title_eos_create_account' })
        })
      }
    }

    if (chain === 'BITCOIN') {
      if (source !== 'WIF') {
        editActions.push({
          key: 'address',
          actionType: 'address',
          text: this.props.intl.formatMessage({ id: 'manage_wallet_title_wallet_address' })
        })
      }

      editActions.push({
        key: 'addressType',
        actionType: 'addressType',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_switch_address_type' }),
        detail: segWit === 'P2WPKH' ? this.props.intl.formatMessage({ id: 'manage_wallet_type_btc_address_segwit' }) : this.props.intl.formatMessage({ id: 'manage_wallet_type_btc_address_common' })
      })
    }

    if (source === 'NEW_IDENTITY' || source === 'RECOVERED_IDENTITY' || source === 'MNEMONIC') {
      exportActions.push({
        key: 'mnemonic',
        actionType: 'mnemonic',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_backup_mnemonics' })
      })
    }

    if (source === 'PRIVATE' || source === 'WIF' || source === 'KEYSTORE' || chain === 'ETHEREUM' || chain === 'EOS') {
      exportActions.push({
        key: 'privateKey',
        actionType: 'privateKey',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_export_private_key' })
      })
    }

    if (chain === 'ETHEREUM') {
      exportActions.push({
        key: 'keystore',
        actionType: 'keystore',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_export_keysotre' })
      })
    }

    if (chain === 'CHAINX') {
      editActions.push({
        key: 'chainxDeposit',
        actionType: 'chainxDeposit',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_chainx_deposit_mine' })
      })

      editActions.push({
        key: 'chainxVoting',
        actionType: 'chainxVoting',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_chainx_voting' })
      })

      /* editActions.push({
       *   key: 'chainxWithdrawal',
       *   actionType: 'chainxWithdrawal',
       *   text: this.props.intl.formatMessage({ id: 'manage_wallet_title_chainx_withdraw' })
       * })*/

      accountActions.push({
        key: 'chainxScan',
        actionType: 'chainxScan',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_chainx_explorer' })
      })

      accountActions.push({
        key: 'chainxStats',
        actionType: 'chainxStats',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_chainx_stats' })
      })

      accountActions.push({
        key: 'chainxTool',
        actionType: 'chainxTool',
        text: 'ChainXTool'
      })
    }

    const sections = []
    if (editActions.length) sections.push({ data: editActions })
    if (accountActions.length) sections.push({ data: accountActions })
    if (exportActions.length) sections.push({ data: exportActions })

    if (source !== 'RECOVERED_IDENTITY' && source !== 'NEW_IDENTITY') {
      sections.push({ data: [{
        key: 'delete',
        actionType: 'delete',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_text_delete_wallet' })
      }] })
    }

    sections[0].isFirst = true

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#673AB7', paddingBottom: 16, elevation: 4, marginBottom: 12 }}>
          <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', paddingRight: 16, paddingLeft: 16 }}>
            {!!chain && <View style={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: 20 }}><Image source={walletIcons[chain.toLowerCase()]} style={{ width: 40, height: 40, borderRadius: 4, backgroundColor: 'white' }} /></View>}
            <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginRight: 2 }}>{name}</Text>
                <TouchableNativeFeedback onPress={this.requestChangeWalletName} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
                  <View style={{ height: 24, width: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('resources/images/edit_android.png')} style={{ height: 16, width: 16 }} />
                  </View>
                </TouchableNativeFeedback>
              </View>
              <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>{this.formatAddress(address)}</Text>
            </View>
          </View>
        </View>
        <SectionList
          renderSectionHeader={this.renderHeader}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
          sections={sections}
          keyExtractor={(item, index) => item.key}
        />
        <IndicatorModal onModalHide={this.onModalHide} isVisible={loading} message="验证密码..." />
        <Modal
          isVisible={this.state.showSimpleModal}
          backdropOpacity={0.6}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={500}
          backdropTransitionInTiming={500}
          animationOut="fadeOut"
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
          onBackdropPress={this.onBackdropPress}
          onModalHide={this.onSimpleModalHide}
        >
          {(this.state.showSimpleModal) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 4, alignItem: 'center', elevation: 14, minWidth: 240 }}>
              <View style={{ paddingHorizontal: 24, paddingBottom: 9, paddingTop: 20 }}>
                <Text style={{ fontSize: 20, color: 'rgba(0,0,0,0.87)', fontWeight: '500' }}>切换地址类型</Text>
              </View>
              <View style={{ paddingBottom: 12, paddingTop: 6, paddingHorizontal: 16 }}>
                <TouchableNativeFeedback onPress={this.selectAddressType.bind(this, 'P2WPKH')} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48 }}>
                    {segWit === 'P2WPKH' ? <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, margin: 8 }} /> : <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, margin: 8 }} />}
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>隔离见证</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.selectAddressType.bind(this, 'NONE')} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48 }}>
                    {segWit === 'P2WPKH' ? <Image source={require('resources/images/radio_unfilled_android.png')} style={{ width: 24, height: 24, margin: 8 }} /> : <Image source={require('resources/images/radio_filled_android.png')} style={{ width: 24, height: 24, margin: 8 }} />}
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>普通</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>}
        </Modal>
        <Modal
          isVisible={this.state.showPrompt}
          backdropOpacity={0.6}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={500}
          backdropTransitionInTiming={500}
          animationOut="fadeOut"
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
        >
          {(this.state.showPrompt) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
            <View style={{ backgroundColor: 'white', paddingTop: 14, paddingBottom: 11, paddingHorizontal: 24, borderRadius: 2, alignItem: 'center', justifyContent: 'space-between', elevation: 14, width: '100%' }}>
              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20, color: 'black', marginBottom: 12 }}>请输入密码</Text>
                {/* <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.54)', marginBottom: 12 }}>This is a prompt</Text> */}
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 0,
                    width: '100%',
                    borderBottomWidth: 2,
                    borderColor: '#169689'
                  }}
                  autoFocus={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholder="Password"
                  keyboardType="default"
                  secureTextEntry={true}
                  onChangeText={this.changePassword}
                  onSubmitEditing={this.submitPassword}
                />
              </View>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TouchableNativeFeedback onPress={this.clearPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2, marginRight: 8 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>取消</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.submitPassword} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>确定</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>}
        </Modal>
        <Modal
          isVisible={this.state.showWalletNamePrompt}
          backdropOpacity={0.6}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={500}
          backdropTransitionInTiming={500}
          animationOut="fadeOut"
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
        >
          {(this.state.showWalletNamePrompt) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 6 }}>
            <View style={{ backgroundColor: 'white', paddingTop: 14, paddingBottom: 11, paddingHorizontal: 24, borderRadius: 2, alignItem: 'center', justifyContent: 'space-between', elevation: 14, width: '100%' }}>
              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20, color: 'black', marginBottom: 12 }}>设置钱包名称</Text>
                {/* <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.54)', marginBottom: 12 }}>This is a prompt</Text> */}
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 0,
                    width: '100%',
                    borderBottomWidth: 2,
                    borderColor: '#169689'
                  }}
                  autoFocus={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  value={this.state.walletName}
                  onChangeText={this.changeWalletName}
                  onSubmitEditing={this.submitWalletName}
                />
              </View>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TouchableNativeFeedback onPress={this.cancelChangeWalletName} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2, marginRight: 8 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>取消</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.submitWalletName} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ padding: 10, borderRadius: 2 }}>
                    <Text style={{ color: '#169689', fontSize: 14 }}>确定</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>}
        </Modal>
      </SafeAreaView>
    )
  }
}
