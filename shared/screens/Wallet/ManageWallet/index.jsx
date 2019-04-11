import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ActionSheetIOS, AlertIOS, Alert, Text, ActivityIndicator } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import * as walletActions from 'actions/wallet'
import * as producerActions from 'actions/producer'
import { accountByIdSelector, managingAccountVotedProducersSelector } from 'selectors/account'
import { managingWalletSelector } from 'selectors/wallet'
import Modal from 'react-native-modal'
import styles from './styles'

const { Section, Item } = TableView

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return '密码错误'
    default:
      return '操作失败'
  }
}

@connect(
  state => ({
    deleteWallet: state.deleteWallet,
    exportMnemonics: state.exportMnemonics,
    exportBTCPrivateKey: state.exportBTCPrivateKey,
    exportETHKeystore: state.exportETHKeystore,
    exportETHPrivateKey: state.exportETHPrivateKey,
    exportEOSPrivateKey: state.exportEOSPrivateKey,
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
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  componentDidAppear() {
    if (this.props.fromCard) {
      this.props.actions.setActiveWallet(this.props.wallet.id)
    }
  }

  deleteWallet = (walletId, chain, address) => {
    AlertIOS.prompt(
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
          onPress: password => this.props.actions.deleteWallet.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, fromCard: this.props.fromCard, chain, address })
        }
      ],
      'secure-text'
    )
  }

  exportMnemonics = (walletId) => {
    AlertIOS.prompt(
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
          onPress: password => this.props.actions.exportMnemonics.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source: this.props.source })
        }
      ],
      'secure-text'
    )
  }

  exportETHKeystore = (walletId) => {
    AlertIOS.prompt(
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
          onPress: password => this.props.actions.exportETHKeystore.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source: this.props.source })
        }
      ],
      'secure-text'
    )
  }

  exportPrivateKey = (walletId, symbol) => {
    const { chain, address } = this.props.wallet
    const account = this.props.account[`${chain}/${address}`]
    const permissions = account && account.permissions

    AlertIOS.prompt(
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

  vote = () => {
    this.props.actions.setSelected(this.props.votedProducers)

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Voting'
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
    const { chain, id } = this.props.wallet

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ManageEOSResource',
        passProps: { chain, walletId: id },
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
  }

  onModalHide = () => {
    const deleteWalletError = this.props.deleteWallet.error
    const exportMnemonicsError = this.props.exportMnemonics.error
    const exportBTCPrivateKeyError = this.props.exportBTCPrivateKey.error
    const exportETHKeystoreError = this.props.exportETHKeystore.error
    const exportETHPrivateKeyError = this.props.exportETHPrivateKey.error
    const exportEOSPrivateKeyError = this.props.exportEOSPrivateKey.error
    const error = deleteWalletError || exportMnemonicsError || exportBTCPrivateKeyError || exportETHKeystoreError || exportETHPrivateKeyError || exportEOSPrivateKeyError

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

  render() {
    const { type, segWit, deleteWallet, exportMnemonics, exportBTCPrivateKey, exportETHKeystore, exportETHPrivateKey, exportEOSPrivateKey, wallet } = this.props
    const name = (wallet && wallet.name) || this.props.name
    const address = (wallet && wallet.address) || this.props.address
    const chain = (wallet && wallet.chain) || this.props.chain
    const source = (wallet && wallet.source) || this.props.source
    const id = (wallet && wallet.id) || this.props.id
    const symbol = (wallet && wallet.symbol) || this.props.symbol

    const deleteWalletLoading = deleteWallet.loading
    const exportMnemonicsLoading = exportMnemonics.loading
    const exportBTCPrivateKeyLoading = exportBTCPrivateKey.loading
    const exportETHKeystoreLoading = exportETHKeystore.loading
    const exportETHPrivateKeyLoading = exportETHPrivateKey.loading
    const exportEOSPrivateKeyLoading = exportEOSPrivateKey.loading
    const loading = deleteWalletLoading || exportMnemonicsLoading || exportBTCPrivateKeyLoading || exportETHKeystoreLoading || exportETHPrivateKeyLoading || exportEOSPrivateKeyLoading

    const editActions = []
    const accountActions = []
    const exportActions = []

    if (chain === 'EOS') {
      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="vote"
          actionType="vote"
          text="节点投票"
          onPress={this.vote}
          arrow
        />
      )

      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="resources"
          actionType="resources"
          text="资源管理"
          onPress={this.manageResource}
          arrow
        />
      )


      if (source === 'RECOVERED_IDENTITY' || source === 'NEW_IDENTITY') {
        accountActions.push(
          <Item
            reactModuleForCell="WalletManagementTableViewCell"
            key="switchAccount"
            actionType="switchAccount"
            text="切换账号"
            onPress={this.switchEOSAccount}
            arrow
          />
        )

        accountActions.push(
          <Item
            reactModuleForCell="WalletManagementTableViewCell"
            key="createAccount"
            actionType="createAccount"
            onPress={this.createNewAccount}
            text="创建新账号"
            arrow
          />
        )
      }
    }

    if (chain === 'BITCOIN') {
      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="address"
          actionType="address"
          text="钱包地址"
          arrow
        />
      )

      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="addressType"
          actionType="addressType"
          text="切换地址类型"
          detail={segWit === 'P2WPKH' ? '隔离见证' : '普通'}
          arrow
        />
      )
    }

    if (type === 'identity' || source === 'MNEMONIC') {
      exportActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="mnemonic"
          actionType="mnemonic"
          text="备份助记词"
          onPress={this.exportMnemonics.bind(this, id)}
          arrow
        />
      )
    }

    if (source === 'PRIVATE' || source === 'WIF' || source === 'KEYSTORE' || chain === 'ETHEREUM' || chain === 'EOS') {
      exportActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="privateKey"
          actionType="privateKey"
          text="导出私钥"
          onPress={this.exportPrivateKey.bind(this, id, symbol)}
          arrow
        />
      )
    }

    if (chain === 'ETHEREUM') {
      exportActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="keystore"
          actionType="keystore"
          text="导出Keystore"
          onPress={this.exportETHKeystore.bind(this, id)}
          arrow
        />
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
          tableViewCellStyle={TableView.Consts.CellStyle.Value1}
          detailTextColor="#666666"
          showsVerticalScrollIndicator={false}
          moveWithinSectionOnly
          cellSeparatorInset={{ left: 61 }}
        >
          <Section />
          <Section>
            <Item
              height={78}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              name={name}
              address={address}
              chain={chain}
              reactModuleForCell="WalletManagementTableViewCell"
              componentId={this.props.componentId}
            />
          </Section>
          {editActions.length > 0 && <Section>
            {editActions}
          </Section>}
          {accountActions.length > 0 && <Section>
            {accountActions}
          </Section>}
          {exportActions.length > 0 && <Section>
            {exportActions}
          </Section>}
          {type === 'imported' && <Section>
            <Item
              reactModuleForCell="WalletManagementTableViewCell"
              key="delete"
              actionType="delete"
              text="删除钱包"
              onPress={this.deleteWallet.bind(this, id, chain, address)}
              arrow
            />
          </Section>}
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
              {deleteWalletLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>验证密码...</Text>}
              {!deleteWalletLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>导出中...</Text>}
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
