import React, { Component } from 'react'
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { IntlProvider } from 'react-intl'
import Modal from 'react-native-modal'
import messages from 'resources/messages'
import * as walletActions from 'actions/wallet'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    walletList: state.wallet.get('classicWalletList'),
    activeWallet: state.wallet.get('data')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {...walletActions},
      dispatch
    )
  })
)

export default class AccountSwitchModal extends Component {

  switchAccount = (item) => {
    this.props.dismissModal()
    this.props.actions.switchWalletRequested(item)
  }

  render() {
    const {
      isVisible,
      dismissModal,
      locale,
      walletList,
      activeWallet,
      routeToNewAccount
    } = this.props
    return (
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0 }}
        isVisible={isVisible}
        backdropOpacity={0.9}
      >
        <IntlProvider messages={messages[locale]}>
          <View style={styles.mask}>
            <TouchableWithoutFeedback onPress={dismissModal}>
              <View style={styles.outside} />
            </TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.header}>
                <TouchableOpacity onPress={dismissModal} style={styles.close}>
                  <Ionicons name="ios-close" size={28} color={Colors.bgColor_FFFFFF} />
                </TouchableOpacity>
                <Text style={styles.title}>
                  {messages[locale].account_change_title_change}
                </Text>
                <TouchableOpacity onPress={routeToNewAccount} style={styles.close}>
                  <Text style={[styles.text14, { color: Colors.textColor_89_185_226 }]}>
                    {messages[locale].account_change_button_add_account}
                  </Text>
                </TouchableOpacity>
                
              </View>
              <ScrollView style={styles.body} contentContainerStyle={styles.contentContainerStyle}>
                {walletList.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => this.switchAccount(item)}>
                    <View style={styles.accountItemContainer}>
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={styles.textRadius}>
                            <Text style={[styles.text12, { color: Colors.textColor_89_185_226 }]}>
                              {item.get('permission').toLowerCase()}
                            </Text>
                          </View>
                          <Text style={[styles.text15, { marginLeft: 5 }]}>
                            {item.get('eosAccountName')} 
                          </Text>
                        </View>
                        <Text style={[styles.text12, { marginTop: 8 }]}>
                          {item.get('publicKey') && `${item.get('publicKey').slice(0, 7)}....${item.get('publicKey').slice(-7)}`}
                        </Text>
                      </View>
                      { 
                        item.get('eosAccountName') === activeWallet.get('eosAccountName') 
                        && item.get('permission').toLowerCase() === activeWallet.get('permission').toLowerCase()
                        && <Ionicons name="md-checkmark" size={20} color={Colors.textColor_89_185_226} />
                      }
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </IntlProvider>
      </Modal>
    )
  }
}
