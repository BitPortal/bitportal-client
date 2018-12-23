import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import Colors from 'resources/colors'
import { eosPriceSelector } from 'selectors/ticker'
import * as eosAccountActions from 'actions/eosAccount'
import LinearGradientContainer from 'components/LinearGradientContainer'
import Alert from 'components/Alert'
import Loading from 'components/Loading'
import messages from 'resources/messages'
import Images from 'resources/images'
import Dialog from 'components/Dialog'
import WalletCard from 'components/WalletCard'
import { hasEOSAccountImported } from 'utils/index'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Unauthorized private key!':
      return messages.ast_imp_hint_unauowner
    default:
      return messages.add_eos_import_error_popup_text_private_key_import_failed
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: state.eosAccount,
    walletList: state.wallet.get('classicWalletList'),
    eosPrice: eosPriceSelector(state),
    keyPermissions: state.eosAccount.get('keyPermissions').toJS()
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAccountActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class AccountSelection extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  selectAccount = (keyPermission) => {
    const size = this.countForSelected()
    if (size < 5) {
      this.props.actions.selectAccount(keyPermission)
    }
  }

  importAccount = () => {
    const { keyPermissions, publicKey, privateKey, password, hint } = this.props
    
    const componentId = this.props.componentId
    for (let index = 0; index < keyPermissions.length; index++) {
      const keyPermission = keyPermissions[index];
      if (keyPermission.selected) {
        const accountInfo = keyPermission.accountInfo
        const eosAccountName = keyPermission.accountName
        const permission = keyPermission.permission
        this.props.actions.importEOSAccountRequested({ eosAccountName, permission, accountInfo, publicKey, privateKey, password, hint, componentId })
      }
    }
  }

  showHint = () => {
    const { locale } = this.props
    Dialog.alert(
      messages[locale].general_popup_label_tips,
      messages[locale].add_eos_hint_popup_text_private_key,
      { positiveText: messages[locale].general_popup_button_close }
    )
  }

  countForSelected = () => {
    const { keyPermissions } = this.props
    let amount = 0
    for (let index = 0; index < keyPermissions.length; index++) {
      const element = keyPermissions[index]
      if (element.selected) {
        amount ++
      }
    }
    return amount
  }

  render() {
    const { locale, keyPermissions, eosPrice, eosAccount, walletList } = this.props
    const size = this.countForSelected()
    const loading = eosAccount.get('loading')
    const error = eosAccount.get('importError')
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          title={messages[locale].add_import_success_title_select_account}
          rightButton={<CommonRightButton imageSource={Images.help_center} onPress={this.showHint} />}
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              keyPermissions.map(keyPermission => (
                <WalletCard
                  key={`${keyPermission.permission}_${keyPermission.accountName}`}
                  accountType={keyPermission.permission}
                  accountName={keyPermission.accountName}
                  eosValue={+eosPrice * +keyPermission.balance}
                  eosAmount={keyPermission.balance}
                  balanceTitle="Balance"
                  selected={keyPermission.selected}
                  locale={locale}
                  imported={hasEOSAccountImported(
                    { 
                      eosAccountName: keyPermission.accountName, 
                      publicKey: this.props.publicKey,
                      permission: keyPermission.permission
                    },
                    walletList
                  )}
                  onPress={this.selectAccount.bind(this, keyPermission)}
                  colors={keyPermission.permission !== 'owner' && Colors.ramColor}
                />
              ))
            }
          </ScrollView>
        </View>
        <View style={[styles.btnContainer, styles.between]}>
          <Text style={styles.text14}>{messages[locale].voting_label_selected}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.text14, { marginRight: 15 }]}>{size}/5</Text>
            <LinearGradientContainer type="right" colors={!size ? Colors.disabled : Colors.voteColor} style={styles.voteBtn}>
              <TouchableWithoutFeedback onPress={this.importAccount} style={styles.center} disabled={!size}>
                <View>
                  <Text style={[styles.text14, { marginHorizontal: 10, marginVertical: 2 }]}>
                    {messages[locale].add_eos_import_button_import}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </LinearGradientContainer>
          </View>
        </View>
        <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearEOSAccountError} />
        <Loading isVisible={loading} text={messages[locale].export_private_key_text_exporting} />
      </View>
    )
  }
}
