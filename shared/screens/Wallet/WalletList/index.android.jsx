import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, Text, ActionSheetIOS, Dimensions, TouchableHighlight, FlatList, SectionList, TouchableNativeFeedback, ScrollView, Image } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { identityWalletSelector, importedWalletSelector, hasIdentityEOSWalletSelector } from 'selectors/wallet'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as keyAccountActions from 'actions/keyAccount'
import FastImage from 'react-native-fast-image'
import { walletIcons } from 'resources/images'
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
    Navigation.pop(this.props.componentId)
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

  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  renderItem = ({ item, index }) => {
    if (item.chain === 'EOS' && !item.address) {
      return (
        <View style={{ width: '100%', paddingHorizontal: 8, marginBottom: item.isLast ? 88 : 0 }}>
          <TouchableNativeFeedback onPress={this.props.syncingEOSAccount ? () => {} : this.createEOSAccount} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', false)} useForeground={true}>
            <View style={{ width: '100%', paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'white', borderRadius: 4, elevation: 2 }}>
              <View style={{ width: 50, height: 50, marginRight: 16 }}>
                <Image
                  source={walletIcons[item.chain.toLowerCase()]}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View>
                <Text style={{ fontSize: 15, color: 'black' }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {!this.props.syncingEOSAccount && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>创建EOS帐户</Text>}
                  {!!this.props.syncingEOSAccount && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>检测EOS帐户中...</Text>}
                </View>
              </View>
              {!this.props.syncingEOSAccount &&
               <View style={{ position: 'absolute', right: 4, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                 <FastImage
                   source={require('resources/images/arrow_right_android.png')}
                   style={{ width: 24, height: 24, borderRadius: 12 }}
                 />
               </View>}
            </View>
          </TouchableNativeFeedback>
        </View>
      )
    }

    return (
      <View style={{ width: '100%', paddingHorizontal: 8, marginBottom: item.isLast ? 88 : 0 }}>
        <TouchableNativeFeedback onPress={this.switchWallet.bind(this, item.id)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', false)} useForeground={true}>
        <View style={{ width: '100%', paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'white', borderRadius: 4, elevation: 2 }}>
            <View
              style={{
                width: 50,
                height: 50,
                marginRight: 16
              }}
            >
              <Image
                source={walletIcons[item.chain.toLowerCase()]}
                style={{
                  width: 50,
                  height: 50
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 15, color: 'black' }}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 4, borderRadius: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.54)', marginRight: 4, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: 'rgba(0,0,0,0.54)' }}>{item.symbol}</Text>
                  {(item.symbol === 'BTC' && item.segWit === 'P2WPKH') && <Text style={{ fontSize: 10, color: 'rgba(0,0,0,0.54)' }}>-SEGWIT</Text>}
                </View>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>{this.formatAddress(item.address)}</Text>
              </View>
            </View>
            <View style={{ position: 'absolute', right: 4, height: 36, width: 36, borderRadius: 18, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableNativeFeedback onPress={() => {}} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
                <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                  <FastImage
                    source={require('resources/images/more_android.png')}
                    style={{ width: 24, height: 24, borderRadius: 12 }}
                  />
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
      </TouchableNativeFeedback>
        </View>
    )
  }

  renderHeader = ({ section: { title, separator } }) => {
    return (
      <View style={{ width: '100%', padding: 16, borderColor: 'rgba(0,0,0,0.12)' }}>
        <Text style={{ fontSize: 14, color: '#202124' }}>{title}</Text>
      </View>
    )
  }

  renderSepatator = () => {
    return (
      <View style={{ width: '100%', height: 8 }} />
    )

    return (
      <View style={{ width: '100%', height: 1 }}>
        <View style={{ position: 'absolute', height: 1, backgroundColor: 'rgba(0,0,0,0.12)', top: 0, left: 72, right: 0 }} />
      </View>
    )
  }

  render() {
    const { identityWallets, importedWallets, activeWalletId, intl, syncingEOSAccount } = this.props
    const identityWalletsCount = identityWallets.length
    const importedWalletsCount = importedWallets.length

    return (
      <View style={{ flex: 1 }}>
        <SectionList
          renderSectionHeader={this.renderHeader}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSepatator}
          showsVerticalScrollIndicator={false}
          sections={[
            { title: intl.formatMessage({ id: 'general_title_identity_wallet' }), data: identityWallets },
            { title: intl.formatMessage({ id: 'general_title_import_wallet' }) , data: importedWallets },
          ]}
          keyExtractor={(item, index) => item.id}
        />
        <TouchableNativeFeedback onPress={this.toSelectChainType} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
          <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 16, right: 16, backgroundColor: '#FF5722', elevation: 10 }}>
            <FastImage
              source={require('resources/images/add_white_android.png')}
              style={{ width: 24, height: 24 }}
            />
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}
