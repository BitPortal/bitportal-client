import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, Image, TouchableHighlight, TouchableOpacity, Animated, Easing, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import { walletIcons } from 'resources/images'
import { transferWalletSelector } from 'selectors/wallet'
import { transferWalletsContactsSelector, selectedContactSelector } from 'selectors/contact'
import TableView from 'components/TableView'

const { Section, Item } = TableView

@connect(
  state => ({
    contacts: transferWalletsContactsSelector(state),
    selectedContact: selectedContactSelector(state),
    transferWallet: transferWalletSelector(state)
  })
)

export default class SelectContactList extends Component {
  state = {

  }

  selectContactAddress = () => {

  }

  render() {
    const { transferWallet, contacts, selectedContact } = this.props
    const chain = transferWallet.chain

    return (
        <View style={{ width: '100%', height: 64 * 5, borderWidth: 0.5, borderColor: '#C8C7CC', borderRadius: 12, overflow: 'hidden' }}>
          <View style={{ height: 64, width: '100%', backgroundColor: '#F7F7F7', borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomWidth: 0.5, borderColor: '#C8C7CC', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }}>
            <View style={{ height: '100%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
              <View style={{ height: '100%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 17 }}>{`选择联系人${chain === 'EOS' ? '账户名' : '地址'}`}</Text>
              </View>
            </View>
          </View>
          <View style={{ height: 64 * 4, width: '100%' }}>
            <TableView
              style={{ flex: 1, backgroundColor: 'white' }}
              tableViewCellStyle={TableView.Consts.CellStyle.Default}
              showsVerticalScrollIndicator={false}
              cellSeparatorInset={{ left: 16 }}
            >
              <Section>
                {contacts.map(contact => <Item
                                           key={contact.id}
                                           height={64}
                                           reactModuleForCell="SelectContactTableViewCell"
                                           name={contact.name}
                                           address={contact.address || contact.accountName}
                                           onPress={this.selectContactAddress.bind(this, chain, contact.id, contact.name, contact.address || contact.accountName)}
                                           accessoryType={(selectedContact && chain === selectedContact.chain && contact.name === selectedContact.name && (contact.address === selectedContact.address || contact.accountName === selectedContact.address)) ? TableView.Consts.AccessoryType.Checkmark : TableView.Consts.AccessoryType.None}
                                         />
                 )}
              </Section>
            </TableView>
          </View>
        </View>
    )
  }
}
