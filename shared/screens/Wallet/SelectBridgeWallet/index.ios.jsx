import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ActionSheetIOS, requireNativeComponent, Text } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import { identityWalletSelector, importedWalletSelector, hasIdentityEOSWalletSelector, bridgeWalletListSelector } from 'selectors/wallet'
// import FastImage from 'react-native-fast-image'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as keyAccountActions from 'actions/keyAccount'
import { DarkModeContext } from 'utils/darkMode'
import styles from './styles'
const { Section, Item } = TableView
const NavBar = requireNativeComponent('NavBar')

@injectIntl

@connect(
  state => ({
    identity: state.identity,
    syncingEOSAccount: state.getKeyAccount.loading,
    identityWallets: identityWalletSelector(state),
    importedWallets: importedWalletSelector(state),
    hasIdentityEOSWallet: hasIdentityEOSWalletSelector(state),
    bridgeWalletList: bridgeWalletListSelector(state),
    activeWalletId: state.wallet.bridgeWalletId
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
        visible: false,
        title: {
          text: gt('wallet_switch')
        },
        leftButtons: [
          {
            id: 'cancel',
            text: gt('button_cancel')
          }
        ],
        largeTitle: {
          visible: false
        }
      }
    }
  }
  static contextType = DarkModeContext
  subscription = Navigation.events().bindComponent(this)

  tableViewRef = React.createRef()

  state = {
    scrollToDismissEnabled: false
  }

  switchWallet = (walletId, chain) => {
    this.props.actions.setBridgeChain(chain)
    this.props.actions.setBridgeWallet(walletId)
    Navigation.dismissModal(this.props.componentId)
  }

  componentDidMount() {
    if (!this.props.hasIdentityEOSWallet) {
      const { identityWallets } = this.props
      const index = identityWallets.findIndex((wallet: any) => wallet.chain === 'EOS')
      const wallet = identityWallets[index]
      this.props.actions.getKeyAccount.requested(wallet)
    }
  }

  componentDidAppear() {
    this.setState({ scrollToDismissEnabled: true })
  }

  onLeftButtonClicked = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  render() {
    const { identityWallets, importedWallets, activeWalletId, intl, syncingEOSAccount, eosWallets, ethWallets, bridgeWalletList } = this.props
    const bridgeWalletListCount = bridgeWalletList.length
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    if (!bridgeWalletListCount) {
      return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#666666', fontSize: 17 }}>
                {t(this,'wallet_null')}
              </Text>
          </View>
          <NavBar title={t(this,'wallet_select')} leftButtonTitle={t(this,'button_cancel')} onLeftButtonClicked={this.onLeftButtonClicked} />
        </View>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <TableView
          style={{ flex: 1 }}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          reactModuleForCell="WalletTableViewCell"
          onItemNotification={this.onItemNotification}
          cellSeparatorInset={{ left: 16 }}
          scrollIndicatorInsets={{ top: 66 }}
          contentInset={{ top: 66 }}
          scrollToDismissEnabled={this.state.scrollToDismissEnabled}
        >
          {bridgeWalletList && <Section>{bridgeWalletList.map(wallet => (
            <Item
              height={60}
              key={wallet.id}
              uid={wallet.id}
              name={wallet.name}
              symbol={wallet.symbol}
              chain={wallet.chain}
              address={wallet.address}
              source={wallet.source}
              componentId={this.props.componentId}
              isDarkMode={isDarkMode}
              onPress={this.switchWallet.bind(this, wallet.id, wallet.chain)}
              accessoryType={wallet.id === activeWalletId ? TableView.Consts.AccessoryType.Checkmark : TableView.Consts.AccessoryType.None}
            />
          )
          )}
          </Section>}
        </TableView>
        <NavBar title={t(this,'wallet_select')} leftButtonTitle={t(this,'button_cancel')} onLeftButtonClicked={this.onLeftButtonClicked} />
      </View>
    )
  }
}
