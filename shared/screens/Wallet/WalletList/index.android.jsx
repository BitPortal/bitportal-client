import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, Text, ActionSheetIOS, Dimensions, TouchableHighlight, FlatList } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { identityWalletSelector, importedWalletSelector, hasIdentityEOSWalletSelector } from 'selectors/wallet'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as keyAccountActions from 'actions/keyAccount'
import styles from './styles'

@injectIntl

@connect(
  state => ({
    identity: state.identity,
    syncingEOSAccount: state.getKeyAccount.loading,
    identityWallets: identityWalletSelector(state),
    importedWallets: importedWalletSelector(state),
    hasIdentityEOSWallet: hasIdentityEOSWalletSelector(state),
    activeWalletId: state.wallet.activeWalletId
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
      ...keyAccountActions
    }, dispatch)
  })
)

export default class WalletList extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '管理钱包列表'
        },
        /* rightButtons: [
         *   {
         *     id: 'edit',
         *     text: '编辑'
         *   }
         * ],*/
        largeTitle: {
          visible: false
        }
      }
    }
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  state = {
  }

  navigationButtonPressed({ buttonId }) {

  }

  searchBarUpdated({ text }) {

  }

  toAddIdentity = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.AddIdentity'
          }
        }]
      }
    })
  }

  toSelectChainType = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.SelectChainType'
      }
    })
  }

  toManageWallet = (walletInfo) => {
    this.props.actions.setManagingWallet(walletInfo.id)

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ManageWallet',
        passProps: { ...walletInfo },
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

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'toManageWallet') {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.ManageWallet',
          options: {
            topBar: {
              backButton: {
                title: '返回'
              }
            }
          }
        }
      })
    } else if (action === 'switchWallet') {

    }
  }

  switchWallet = (walletId) => {
    this.props.actions.setActiveWallet(walletId)
    Navigation.dismissAllModals()
  }

  createEOSAccount = (walletId) => {
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

  componentDidMount() {
    if (!this.props.hasIdentityEOSWallet) {
      const { identityWallets } = this.props
      const index = identityWallets.findIndex((wallet: any) => wallet.chain === 'EOS')
      const wallet = identityWallets[index]
      this.props.actions.getKeyAccount.requested(wallet)
    }
  }

  renderItem = ({ item }) => {
    return (
      <TouchableHighlight underlayColor="rgba(0,0,0,0)" activeOpacity={1} style={{ width: '100%', height: 60, paddingLeft: 16, paddingRight: 16 }} onPress={this.onPress}>
        <Text style={{ fontSize: 15 }}>{item.text}</Text>
      </TouchableHighlight>
    )
  }

  renderHeader = () => {
    return (
      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 16, color: 'black', }}>身份钱包</Text>
      </View>
    )
  }

  render() {
    const { identityWallets, importedWallets, activeWalletId, intl, syncingEOSAccount } = this.props
    const identityWalletsCount = identityWallets.length
    const importedWalletsCount = importedWallets.length

    return (
      <View style={styles.container}>
        <FlatList
          data={[{ key: 'home', text: '主页', type: 'home' }, { key: 'contact', text: '联系人', type: 'contact' }, { key: 'settings', text: '设置', type: 'settings' }, { key: 'help', text: '帮助中心', type: 'help' }, { key: 'aboutUs', text: '关于我们', type: 'aboutUs' }]}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    )
  }
}
