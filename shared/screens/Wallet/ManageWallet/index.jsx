import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ActionSheetIOS, AlertIOS, Alert, Text, ActivityIndicator } from 'react-native'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import * as walletActions from 'actions/wallet'
import { accountByIdSelector } from 'selectors/account'
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
    account: accountByIdSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions
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
      this.props.actions.setActiveWallet(this.props.id)
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
    const { chain, address } = this.props
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
    const { name, address, chain, source, type, segWit, id, symbol, deleteWallet, exportMnemonics, exportBTCPrivateKey, exportETHKeystore, exportETHPrivateKey, exportEOSPrivateKey } = this.props

    const deleteWalletLoading = deleteWallet.loading
    const exportMnemonicsLoading = exportMnemonics.loading
    const exportBTCPrivateKeyLoading = exportBTCPrivateKey.loading
    const exportETHKeystoreLoading = exportETHKeystore.loading
    const exportETHPrivateKeyLoading = exportETHPrivateKey.loading
    const exportEOSPrivateKeyLoading = exportEOSPrivateKey.loading
    const loading = deleteWalletLoading || exportMnemonicsLoading || exportBTCPrivateKeyLoading || exportETHKeystoreLoading || exportETHPrivateKeyLoading || exportEOSPrivateKeyLoading

    const editActions = []
    const exportActions = []

    if (chain === 'EOS') {
      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="vote"
          actionType="vote"
          text="节点投票"
          arrow
        />
      )

      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="resources"
          actionType="resources"
          text="资源管理"
          arrow
        />
      )
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

    if (source === 'PRIVATE' || source === 'WIF' || source === 'KEYSTORE' || chain === 'ETHEREUM') {
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
              reactModuleForCell="WalletManagementTableViewCell"
              componentId={this.props.componentId}
            />
          </Section>
          {editActions.length > 0 && <Section>
            {editActions}
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
