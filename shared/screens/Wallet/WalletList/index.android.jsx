import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, Text, ActionSheetIOS, Dimensions, TouchableHighlight, FlatList, SectionList, TouchableNativeFeedback, ScrollView, Image } from 'react-native'
import { Navigation } from 'components/Navigation'
import { identityWalletSelector, importedWalletSelector, hasIdentityEOSWalletSelector } from 'selectors/wallet'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as keyAccountActions from 'actions/keyAccount'
import FastImage from 'react-native-fast-image'
import { walletIcons } from 'resources/images'
import Modal from 'react-native-modal'
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
          text: gt('wallet_management_list')
        },
        largeTitle: {
          visible: false
        },
        leftButtons: [
          {
            id: 'cancel',
            icon: require('resources/images/cancel_android.png'),
            color: 'white'
          }
        ]
      },
      sideMenu: {
        left: {
          enabled: false
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { showSimpleModal: false }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    }
  }

  searchBarUpdated({ text }) {

  }

  toAddIdentity = () => {
    this.setState({ showSimpleModal: false }, () => {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.AddIdentity'
            }
          }]
        }
      })
    })
  }

  toSelectChainType = () => {
    this.setState({ showSimpleModal: false }, () => {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.SelectChainType'
        }
      })
    })
  }

  toManageWallet = (walletId) => {
    this.props.actions.setManagingWallet(walletId)

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ManageWallet'
      }
    })
  }

  switchWallet = (walletId) => {
    this.props.actions.setActiveWallet(walletId)
    Navigation.dismissModal(this.props.componentId)
  }

  createEOSAccount = (walletId) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CreateEOSAccount',
        options: {
          topBar: {
            backButton: {
              title: gt('button_back')
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

  addWalletOrIdentity = (type) => {
    if (type === 'addIdentity') {
      this.toAddIdentity()
    } else if (type === 'importWallet') {
      this.toSelectChainType()
    }
  }

  renderItem = ({ item, index }) => {
    if (item.key === 'separator') {
      return <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0)' }} />
    }

    if (item.chain === 'EOS' && !item.address) {
      return (
        <View style={{ width: '100%', paddingHorizontal: 8, marginBottom: item.isLast ? 88 : 0 }}>
          <TouchableNativeFeedback onPress={this.props.syncingEOSAccount ? () => {} : this.createEOSAccount} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)} useForeground={true}>
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
                  {!this.props.syncingEOSAccount && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>{'创建EOS帐户'}</Text>}
                  {!!this.props.syncingEOSAccount && <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>{'检测EOS帐户中...'}</Text>}
                </View>
              </View>
              {!this.props.syncingEOSAccount &&
               <View style={{ position: 'absolute', right: 4, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                 <Image
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
        <TouchableNativeFeedback onPress={this.switchWallet.bind(this, item.id)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)} useForeground={true}>
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
              <TouchableNativeFeedback onPress={this.toManageWallet.bind(this, item.id)} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
                <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                  <Image
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

  onAddPress = () => {
    const { identityWallets, importedWallets } = this.props
    const identityWalletsCount = identityWallets.length
    const importedWalletsCount = importedWallets.length

    if (identityWalletsCount) {
      this.toSelectChainType()
    } else {
      this.setState({ showSimpleModal: true })
    }
  }

  onBackdropPress = () => {
    this.setState({ showSimpleModal: false })
  }

  render() {
    const { identityWallets, importedWallets, activeWalletId, intl, syncingEOSAccount } = this.props
    const identityWalletsCount = identityWallets.length
    const importedWalletsCount = importedWallets.length

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SectionList
          renderSectionHeader={this.renderHeader}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSepatator}
          showsVerticalScrollIndicator={false}
          sections={[
            { title: identityWalletsCount ? intl.formatMessage({ id: 'general_title_identity_wallet' }) : t(this,'wallet_id_null'), data: identityWallets },
            { title: importedWalletsCount ? intl.formatMessage({ id: 'general_title_import_wallet' }) : t(this,'wallet_ordinary_null'), data: [...importedWallets, { key: 'separator' }] },
          ]}
          keyExtractor={(item, index) => item.id}
        />
        <TouchableNativeFeedback onPress={this.onAddPress} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
          <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 16, right: 16, backgroundColor: '#FF5722', elevation: 10 }}>
            <Image
              source={require('resources/images/add_white_android.png')}
              style={{ width: 24, height: 24 }}
            />
          </View>
        </TouchableNativeFeedback>
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
                <Text style={{ fontSize: 20, color: 'rgba(0,0,0,0.87)', fontWeight: '500' }}>{t(this,'operation_select')}</Text>
              </View>
              <View style={{ paddingBottom: 12, paddingTop: 6, paddingHorizontal: 16 }}>
                <TouchableNativeFeedback onPress={this.toAddIdentity} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,'add_id')}</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.toSelectChainType} background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,'import_wallet_new')}</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
