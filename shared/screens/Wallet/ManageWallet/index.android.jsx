import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { View, ActionSheetIOS, Alert, Text, ActivityIndicator, SafeAreaView, SectionList, TouchableNativeFeedback } from 'react-native'
import { Navigation } from 'react-native-navigation'
import * as walletActions from 'actions/wallet'
import * as producerActions from 'actions/producer'
import { accountByIdSelector, managingAccountVotedProducersSelector } from 'selectors/account'
import { managingWalletSelector } from 'selectors/wallet'
import Modal from 'react-native-modal'
import Dialog from 'components/Dialog'
import { walletIcons } from 'resources/images'
import FastImage from 'react-native-fast-image'
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
  delete: require('resources/images/delete_android.png')
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
      }
    }
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this)
  }

  componentDidAppear() {
    if (this.props.fromCard) {
      this.props.actions.setActiveWallet(this.props.wallet.id)
    }
  }

  deleteWallet = (walletId, chain, address) => {
    const { intl } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
          onPress: password => this.props.actions.deleteWallet.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, fromCard: this.props.fromCard, chain, address })
        }
      ],
      'secure-text'
    )
  }

  exportMnemonics = (walletId) => {
    const { intl } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
          onPress: password => this.props.actions.exportMnemonics.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source: this.props.source })
        }
      ],
      'secure-text'
    )
  }

  exportETHKeystore = (walletId) => {
    const { intl } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
          onPress: password => this.props.actions.exportETHKeystore.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source: this.props.source })
        }
      ],
      'secure-text'
    )
  }

  exportPrivateKey = (walletId, symbol) => {
    const { chain, address } = this.props.wallet
    const { intl } = this.props
    const account = this.props.account[`${chain}/${address}`]
    const permissions = account && account.permissions

    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: this.props.intl.formatMessage({ id: 'alert_button_cancel' }),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: this.props.intl.formatMessage({ id: 'alert_button_confirm' }),
          onPress: password => this.props.actions[`export${symbol}PrivateKey`].requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source: this.props.source, address: this.props.address, permissions })
        }
      ],
      'secure-text'
    )
  }

  switchEOSAccount = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.SwitchEOSAccount',
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

  switchBTCAddress = async () => {
    const constants = await Navigation.constants()

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.SwitchBTCAddress',
        passProps: {
          statusBarHeight: constants.statusBarHeight
        },
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

  createNewAccount = () => {
    /* Navigation.showModal({
     *   stack: {
     *     children: [{
     *       component: {
     *         name: 'BitPortal.CreateEOSAccount'
     *       },
     *       options: {
     *         topBar: {
     *           backButton: {
     *             title: '返回'
     *           }
     *         }
     *       }
     *     }]
     *   }
     * })*/
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CreateEOSAccount',
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

  vote = async () => {
    if (this.props.getProducer.loaded) this.props.actions.setSelected(this.props.votedProducers)
    this.props.actions.handleProducerSearchTextChange('')
    const constants = await Navigation.constants()

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Voting',
            passProps: { statusBarHeight: constants.statusBarHeight }
          },
          options: {
            topBar: {
              searchBar: true,
              searchBarHiddenWhenScrolling: false,
              searchBarPlaceholder: 'Search'
            }
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
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          '',
          [
            { text: '确定', onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  switchBTCAddressType = (walletId) => {
    const { intl, wallet } = this.props
    const segWit = (wallet && wallet.segWit) || this.props.segWit
    const source = (wallet && wallet.source) || this.props.source

    ActionSheetIOS.showActionSheetWithOptions({
      title: '切换地址类型',
      options: ['取消', `隔离见证`, `普通`],
      cancelButtonIndex: 0,
    }, (buttonIndex) => {
      if (buttonIndex === 1) {
        if (segWit !== 'P2WPKH') {
          Alert.prompt(
            intl.formatMessage({ id: 'alert_input_wallet_password'}),
            null,
            [
              {
                text: this.props.intl.formatMessage({ id: 'alert_button_cancel' }),
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: this.props.intl.formatMessage({ id: 'alert_button_confirm' }),
                onPress: password => this.props.actions.switchBTCAddressType.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, segWit, source })
              }
            ],
            'secure-text'
          )
        }
      } else if (buttonIndex === 2) {
        if (segWit === 'P2WPKH') {
          Alert.prompt(
            intl.formatMessage({ id: 'alert_input_wallet_password' }),
            null,
            [
              {
                text: this.props.intl.formatMessage({ id: 'alert_button_cancel' }),
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: this.props.intl.formatMessage({ id: 'alert_button_confirm' }),
                onPress: password => this.props.actions.switchBTCAddressType.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, segWit, source })
              }
            ],
            'secure-text'
          )
        }
      }
    })
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

  chainxVoting = async (walletId) => {
    const constants = await Navigation.constants()

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

  chainxWithdrawal = async () => {
    Dialog.alert('Tips', 'Coming Soon')
    return
    const constants = await Navigation.constants()

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

  chainxToStats = async () => {
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

  chainxToScan = async () => {
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

  chainxToChainXTool = async () => {
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

  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableNativeFeedback onPress={this.props.onPress} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.4)', false)}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 2, height: 48 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <FastImage
              source={images[item.actionType]}
              style={{ width: 24, height: 24, marginRight: 30 }}
            />
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: '100%' }}>
              <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)', fontWeight: 'bold' }}>{item.text}</Text>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderHeader = ({ section: { isFirst } }) => {
    return !isFirst ? <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.12)' }} /> : null
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

      editActions.push({
        key: 'chainxWithdrawal',
        actionType: 'chainxWithdrawal',
        text: this.props.intl.formatMessage({ id: 'manage_wallet_title_chainx_withdraw' })
      })

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
            {!!chain && <View style={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: 20 }}>
              <FastImage source={walletIcons[chain.toLowerCase()]} style={{ width: 40, height: 40, borderRadius: 4, backgroundColor: 'white' }} />
             </View>
            }
        <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>{name}</Text>
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
              {deleteWalletLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>验证密码...</Text>}
              {switchBTCAddressTypeLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>切换中...</Text>}
              {(!deleteWalletLoading && !switchBTCAddressTypeLoading) && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>导出中...</Text>}
            </View>
          </View>}
        </Modal>
      </SafeAreaView>
    )
  }
}
