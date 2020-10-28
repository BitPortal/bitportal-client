import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import Modal from 'react-native-modal'
import { identityEOSWalletSelector, managingWalletSelector } from 'selectors/wallet'
import { managingWalletKeyAccountSelector } from 'selectors/keyAccount'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as keyAccountActions from 'actions/keyAccount'

const { Section, Item } = TableView

@connect(
  state => ({
    wallet: managingWalletSelector(state),
    keyAccounts: managingWalletKeyAccountSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
      ...keyAccountActions
    }, dispatch)
  })
)

export default class SwitchEOSAccount extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('切换EOS帐户')
        },
        backButton: {
          title: gt('返回')
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

  selectEOSAccount = (accountName) => {
    const { wallet } = this.props
    const address = wallet && wallet.address
    const id = wallet && wallet.id

    if (accountName !== address && id) {
      this.props.actions.setEOSWalletAddress.requested({ address: accountName, id, oldAddress: address })
    }
  }

  componentDidMount() {
    this.props.actions.getKeyAccount.requested(this.props.wallet)
  }

  render() {
    const { wallet, keyAccounts } = this.props
    const address = wallet && wallet.address

    return (
      <View style={{ flex: 1 }}>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
        >
          <Section />
          {keyAccounts && <Section>
            {keyAccounts.map(account =>
              <Item
                height={60}
                key={account.accountName}
                reactModuleForCell="SwitchEOSAccountTableViewCell"
                onPress={this.selectEOSAccount.bind(this, account.accountName)}
                selectionStyle={account.accountName === address ? TableView.Consts.CellSelectionStyle.None : TableView.Consts.CellSelectionStyle.Default}
                accessoryType={account.accountName === address ? TableView.Consts.AccessoryType.Checkmark : TableView.Consts.AccessoryType.None}
                accountName={account.accountName}
                permissions={account.permissions.join(' • ')}
              />
             )}
          </Section>}
        </TableView>
      </View>
    )
  }
}
