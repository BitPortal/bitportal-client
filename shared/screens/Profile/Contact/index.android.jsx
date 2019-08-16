import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, ActionSheetIOS, Alert, Text, ActivityIndicator, Animated, Clipboard, TouchableNativeFeedback, SectionList, Image } from 'react-native'
import { Navigation } from 'react-native-navigation'
import * as identityActions from 'actions/identity'
import Modal from 'react-native-modal'
import { activeContactSelector } from 'selectors/contact'
import { identityWalletSelector, importedWalletSelector } from 'selectors/wallet'
import { balanceByIdSelector } from 'selectors/balance'
import * as contactActions from 'actions/contact'
import * as walletActions from 'actions/wallet'

@connect(
  state => ({
    contact: activeContactSelector(state),
    identityWallet: identityWalletSelector(state),
    importedWallet: importedWalletSelector(state),
    balanceById: balanceByIdSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...contactActions,
      ...walletActions
    }, dispatch)
  })
)

export default class Contact extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '联系人详情'
        },
        rightButtons: [
          {
            id: 'delete',
            icon: require('resources/images/delete_white_android.png'),
            color: 'white'
          }
        ]
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    showModal: false
  }

  deleteContact = () => {
    Alert.alert(
      '确认删除',
      null,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: '确认',
          onPress: () => {
            this.props.actions.deleteContact(this.props.contact.id)
            Navigation.pop(this.props.componentId)
          }
        }
      ],
      { cancelable: false }
    )
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'edit') {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.EditContact',
              passProps: { editMode: true, contact: this.props.contact }
            }
          }]
        }
      })
    } else if (buttonId === 'delete') {
      this.deleteContact(this.props.contact.id)
    }
  }

  edit = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.EditContact',
        passProps: { editMode: true, contact: this.props.contact },
        options: {
          topBar: {
            title: {
              text: '编辑联系人'
            }
          }
        }
      }
    })
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'copy') {
      this.setState({ showModal: true }, () => {
        Clipboard.setString(data.text)
        setTimeout(() => {
          this.setState({ showModal: false })
        }, 1000)
      })
    } else if (action === 'transfer') {
      const { symbol, chain, name, address, note } = data
      const wallet = this.selectWallet(chain)

      if (!wallet) {
        Alert.alert(
          `未检测到${symbol}钱包`,
          null,
          [
            {
              text: '确认',
              onPress: () => {}
            }
          ]
        )
      } else {
        this.props.actions.setTransferWallet(wallet.id)
        this.props.actions.setSelectedContact({ id: this.props.contact.id, address, name, chain })

        Navigation.showModal({
          stack: {
            children: [{
              component: {
                name: 'BitPortal.TransferAsset',
                options: {
                  topBar: {
                    title: {
                      text: `发送${symbol}到`
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
    }
  }

  selectWallet = (chain, minimalBalance = 0) => {
    const selectedIdentityWallet = this.props.identityWallet.filter(wallet => wallet.address && wallet.chain === chain)
    const selectedImportedWallet = this.props.importedWallet.filter(wallet => wallet.address && wallet.chain === chain)

    if (selectedIdentityWallet.length) {
      const index = selectedIdentityWallet.findIndex(wallet => this.props.balanceById[`${wallet.chain}/${wallet.address}`] && +this.props.balanceById[`${wallet.chain}/${wallet.address}`].balance >= minimalBalance)
      if (index !== -1) {
        return selectedIdentityWallet[index]
      } else {
        return selectedIdentityWallet[0]
      }
    } else if (selectedImportedWallet.length) {
      const index = selectedImportedWallet.findIndex(wallet => this.props.balanceById[`${wallet.chain}/${wallet.address}`] && +this.props.balanceById[`${wallet.chain}/${wallet.address}`].balance >= minimalBalance)
      if (index !== -1) {
        return selectedImportedWallet[index]
      } else {
        return selectedImportedWallet[0]
      }
    }

    return null
  }

  renderHeader = ({ section: { isFirst } }) => {
    return !isFirst ? <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.12)' }} /> : null
  }

  formatAddress = (address) => {
    if (address && address.length > 20) {
      return `${address.slice(0, 10)}....${address.slice(-10)}`
    } else {
      return address
    }
  }

  copy = (text) => {
    this.setState({ showModal: true }, () => {
      Clipboard.setString(text)

      setTimeout(() => {
        this.setState({ showModal: false })
      }, 1000)
    })
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableNativeFeedback onPress={this.copy.bind(this, item.address)} background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16, height: 60 }}>
          <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.87)' }}>{item.label}</Text>
          <Text style={{ fontSize: 14, color: '#673AB7' }}>{this.formatAddress(item.address)}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const { contact } = this.props

    let sections = []

    if (contact && contact.btc && contact.btc.length) {
      const btcAddresses = contact.btc.map((item, index) => ({
        key: index,
        address: item.address,
        label: 'BTC 地址',
        chain: 'BITCOIN',
        symbol: 'BTC',
        name: contact.name
      }))

      sections.push({ data: btcAddresses })
    }

    if (contact && contact.eth && contact.eth.length) {
      const ethAddresses = contact.eth.map((item, index) => ({
        key: index,
        address: item.address,
        label: 'ETH 地址',
        chain: 'ETHEREUM',
        symbol: 'ETH',
        name: contact.name
      }))

      sections.push({ data: ethAddresses })
    }

    if (contact && contact.eos && contact.eos.length) {
      const eosAddresses = contact.eos.map((item, index) => ({
        key: index,
        address: item.accountName,
        note: item.memo,
        label: 'EOS 账户名',
        chain: 'EOS',
        symbol: 'EOS',
        name: contact.name
      }))

      sections.push({ data: eosAddresses })
    }

    if (sections[0]) sections[0].isFirst = true

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#EEEEEE', width: '100%', height: 160, paddingTop: 24, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
          <View style={{ height: 61 }}>
            <Image
              source={require('resources/images/profile_placeholder_android.png')}
              style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
            />
          </View>
          <View style={{ height: 61, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, color: 'rgba(0,0,0,0.87)' }} numberOfLines={1}>{contact && contact.name}</Text>
            {contact && contact.description && <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.54)', paddingTop: 3 }} numberOfLines={1}>{contact && contact.description}</Text>}
          </View>
        </View>
        <SectionList
          renderSectionHeader={this.renderHeader}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
          sections={sections}
          keyExtractor={(item, index) => item.key}
        />
        <TouchableNativeFeedback onPress={this.edit} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
          <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 16, right: 16, backgroundColor: '#FF5722', elevation: 10, zIndex: 2 }}>
            <Image
              source={require('resources/images/edit_android.png')}
              style={{ width: 24, height: 24 }}
            />
          </View>
        </TouchableNativeFeedback>
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
          onModalHide={this.onModalHide}
        >
          {this.state.showModal && <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.87)', padding: 16, borderRadius: 4, height: 48, elevation: 1, justifyContent: 'center', width: '100%', marginBottom: 72 }}>
              <Text style={{ fontSize: 14, color: 'white' }}>已复制</Text>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
