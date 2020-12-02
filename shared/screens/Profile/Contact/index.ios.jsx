import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, ActionSheetIOS, Alert, Text, ActivityIndicator, Animated, Clipboard } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import * as identityActions from 'actions/identity'
import Modal from 'react-native-modal'
import Sound from 'react-native-sound'
import FastImage from 'react-native-fast-image'
import { activeContactSelector } from 'selectors/contact'
import { identityWalletSelector, importedWalletSelector } from 'selectors/wallet'
import { balanceByIdSelector } from 'selectors/balance'
import * as contactActions from 'actions/contact'
import * as walletActions from 'actions/wallet'
import { DarkModeContext } from 'utils/darkMode'
import styles from './styles'
import { injectIntl } from "react-intl";

Sound.setCategory('Playback')
const copySound = new Sound('copy.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error)
    return
  }

  console.log(`duration in seconds: ${copySound.getDuration()}number of channels: ${copySound.getNumberOfChannels()}`)
})

const { Section, Item } = TableView

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return gt('pwd_wrong')
    default:
      return gt('operation_failed')
  }
}
@injectIntl
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
        largeTitle: {
          visible: false
        },
        title: {
          text: ''
        },
        rightButtons: [
          {
            id: 'edit',
            text: gt('edit')
          }
        ],
        noBorder: true
      },
      bottomTabs: {
        visible: false
      }
    }
  }
  static contextType = DarkModeContext
  subscription = Navigation.events().bindComponent(this)

  state = {
    showModal: false,
    showModalContent: false
  }

  deleteContact = (id) => {
    Alert.alert(
      t(this,'confirm_delete'),
      null,
      [
        {
          text: t(this,'button_cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: t(this,'button_confirm'),
          onPress: () => {
            this.props.actions.deleteContact(this.props.contact.id)
            Navigation.pop(this.props.componentId)
          }
        }
      ]
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
    }
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'copy') {
      this.setState({ showModal: true, showModalContent: true }, () => {
        Clipboard.setString(data.text)
        copySound.play((success) => {
          if (success) {
            console.log('successfully finished playing')
          } else {
            console.log('playback failed due to audio decoding errors')
            copySound.reset()
          }
        })

        setTimeout(() => {
          this.setState({ showModal: false }, () => {
            this.setState({ showModalContent: false })
          })
        }, 1000)
      })
    } else if (action === 'transfer') {
      const { symbol, chain, name, address, note } = data
      const wallet = this.selectWallet(chain)

      if (!wallet) {
        Alert.alert(
          t(this,'undetect_wallet_symbol',{symbol}),
          null,
          [
            {
              text: t(this,'button_confirm'),
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
                      text: t(this,'send_token_symbol',{symbol})
                    },
                    leftButtons: [
                      {
                        id: 'cancel',
                        text: t(this,'cencel')
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

  render() {
    const { statusBarHeight, contact } = this.props
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <View style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : 'white' }}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', backgroundColor: isDarkMode ? 'black' : '#F7F7F7', width: '100%', height: 180 + +statusBarHeight, paddingTop: +statusBarHeight + 44, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
          <View style={{ height: 61 }}>
            <FastImage
              source={require('resources/images/Userpic2.png')}
              style={{ width: 60, height: 60, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
            />
          </View>
          <View style={{ height: 61, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, color: isDarkMode ? 'white' : '#000' }} numberOfLines={1}>{contact && contact.name}</Text>
            {contact && contact.description && <Text style={{ fontSize: 17, color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', paddingTop: 3 }} numberOfLines={1}>{contact && contact.description}</Text>}
          </View>
          <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: '#C8C7CC' }} />
        </View>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Default}
          separatorStyle={TableView.Consts.SeparatorStyle.None}
          onItemNotification={this.onItemNotification}
        >
          <Section />
          {contact && contact.btc && contact.btc.length && <Section>
            {contact.btc.map((item, index) =>
              <Item
                key={index}
                reactModuleForCell="AddressTableViewCell"
                address={item.address}
                label={t(this,'addr_symbol',{symbol: 'BTC'})}
                height={60}
                selectionStyle={TableView.Consts.CellSelectionStyle.None}
                showSeparator
                chain="BITCOIN"
                symbol="BTC"
                isDarkMode={isDarkMode}
                name={contact.name}
              />
            )}
          </Section>}
          {(contact && contact.btc && contact.btc.length) && (contact && contact.eth && contact.eth.length) && <Section>
            <Item
              reactModuleForCell="ContactHeaderTableViewCell"
              title=""
              height={20}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              showSeparator
            />
          </Section>}
          {contact && contact.eth && contact.eth.length && <Section>
            {contact.eth.map((item, index) =>
              <Item
                key={index}
                reactModuleForCell="AddressTableViewCell"
                address={item.address}
                label={t(this,'addr_symbol',{symbol: 'ETH'})}
                height={60}
                selectionStyle={TableView.Consts.CellSelectionStyle.None}
                showSeparator
                chain="ETHEREUM"
                symbol="ETH"
                isDarkMode={isDarkMode}
                name={contact.name}
              />
            )}
          </Section>}
          {contact && contact.rio && contact.rio.length && <Section>
            {contact.rio.map((item, index) =>
              <Item
                key={index}
                reactModuleForCell="AddressTableViewCell"
                address={item.address}
                label={t(this,'addr_symbol',{symbol: 'RFUEL'})}
                height={60}
                selectionStyle={TableView.Consts.CellSelectionStyle.None}
                showSeparator
                chain="POLKADOT"
                symbol="RFUEF"
                isDarkMode={isDarkMode}
                name={contact.name}
              />
            )}
          </Section>}
          {((contact && contact.btc && contact.btc.length) || (contact && contact.eth && contact.eth.length) || (contact && contact.rio && contact.rio.length)) && (contact && contact.eos && contact.eos.length) && <Section>
            <Item
              reactModuleForCell="ContactHeaderTableViewCell"
              title=""
              height={20}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              showSeparator
            />
          </Section>}
          {contact && contact.eos && contact.eos.length && <Section>
            {contact.eos.map((item, index) =>
              <Item
                key={index}
                reactModuleForCell="AddressTableViewCell"
                address={item.accountName}
                note={item.memo}
                label={'EOS 账户名'}
                height={60}
                chain="EOS"
                symbol="EOS"
                isDarkMode={isDarkMode}
                name={contact.name}
                selectionStyle={TableView.Consts.CellSelectionStyle.None}
                showSeparator
              />
            )}
          </Section>}
          <Section>
            <Item
              reactModuleForCell="ContactHeaderTableViewCell"
              title=""
              height={44}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              showSeparator
            />
          </Section>
          {contact && <Section>
            <Item
              reactModuleForCell="ContactDeleteTableViewCell"
              key="delete"
              actionType="delete"
              text={t(this,'contact_delete')}
              height={44}
              onPress={this.deleteContact.bind(this, contact.id)}
            />
          </Section>}
          <Section>
            <Item
              reactModuleForCell="ContactHeaderTableViewCell"
              title=""
              height={44}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              showSeparator
            />
          </Section>
        </TableView>
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
        >
          {this.state.showModalContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{t(this,'copied')}</Text>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
