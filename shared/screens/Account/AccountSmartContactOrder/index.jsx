import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ScrollView, TouchableOpacity, Clipboard } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { IntlProvider } from 'react-intl'
import Loading from 'components/Loading'
import Alert from 'components/Alert'
import Dialog from 'components/Dialog'
import messages from 'resources/messages'
import Colors from 'resources/colors'
import { bindActionCreators } from 'redux'
import * as eosAccountActions from 'actions/eosAccount'
import { BPGradientButton } from 'components/BPNativeComponents'
import Toast from 'components/Toast'
import InputItem from './InputItem'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    // case 'EOS System Error':
    // return 'EOS System Error'
    case 'Owner public key dose not match!':
      return messages.add_eos_create_error_account_created
    case 'Active public key dose not match!':
      return messages.add_eos_create_error_account_created
    default:
      return messages.add_eos_create_error_account_inactive
  }
}
/*
 * export const errorMessageDetail = (error) => {
 *   if (!error || typeof error !== 'object') { return null }
 *
 *   return error.detail
 * }*/

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: state.eosAccount
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAccountActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class AccountSmartContactOrder extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  refreshOrderInfo = () => {
    const componentId = this.props.componentId
    this.props.actions.checkEOSAccountCreationStatusRequested({ componentId })
  }

  deleteOrder = async () => {
    const { locale } = this.props
    const { action } = await Dialog.alert(
      messages[locale].assets_popup_label_delete_order,
      messages[locale].assets_popup_text_pending_create_order,
      {
        negativeText: messages[locale].assets_popup_text_delete_order_cnacel,
        positiveText: messages[locale].assets_popup_text_delete_order_confirm
      }
    )
    if (action === Dialog.actionPositive) {
      const componentId = this.props.componentId
      this.props.actions.cancelEOSAccountAssistanceRequestd({ componentId })
    } else {
      return null
    }
  }

  copyContactName = () => {
    Clipboard.setString('signupeoseos')
    Toast(messages[this.props.locale].copy_text_copy_success)
  }

  copyContactMemo = () => {
    const { eosAccount } = this.props
    const eosAccountName = eosAccount.getIn(['eosAccountCreationRequestInfo', 'eosAccountName'])
    const ownerPublicKey = eosAccount.getIn(['eosAccountCreationRequestInfo', 'ownerPublicKey'])
    Clipboard.setString(`${eosAccountName}-${ownerPublicKey}`)
    Toast(messages[this.props.locale].copy_text_copy_success)
  }

  checkContact = () => {
    const uri = 'https://github.com/dappub/signupeoseos'
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappWebView',
        passProps: {
          title: uri,
          needLinking: true,
          uri
        }
      }
    })
  }

  render() {
    const { locale, eosAccount } = this.props
    const loading = eosAccount.get('loading')
    const error = eosAccount.get('error')
    const eosAccountName = eosAccount.getIn(['eosAccountCreationRequestInfo', 'eosAccountName'])
    const ownerPublicKey = eosAccount.getIn(['eosAccountCreationRequestInfo', 'ownerPublicKey'])
    const contactMemo = `${eosAccountName}-${ownerPublicKey}`
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            title={messages[locale].add_eos_create_smart_contract_title_smart_contract}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.contentContainer}>
                <LinearGradientContainer type="left" colors={Colors.gradientCardColors3} style={styles.gradient}>
                  <Text style={[styles.text14, { lineHeight: 20 }]}>
                    {messages[locale].add_eos_create_smart_contract_text_tip1}
                  </Text>
                  <Text style={[styles.text14, { marginTop: 10, lineHeight: 20 }]}>
                    {messages[locale].add_eos_create_smart_contract_text_tip2}
                  </Text>
                </LinearGradientContainer>
                <InputItem
                  label={messages[locale].add_eos_create_smart_contract_label_contract_account_name}
                  value="signupeoseos"
                  copyLabel={messages[locale].copy_button_copy}
                  onPress={this.copyContactName}
                />
                <InputItem
                  label={messages[locale].add_eos_create_smart_contract_label_contract_memo}
                  value={contactMemo}
                  copyLabel={messages[locale].copy_button_copy}
                  onPress={this.copyContactMemo}
                />
                <LinearGradientContainer type="left" colors={Colors.gradientCardColors3} style={styles.gradient}>
                  <Text style={[styles.text14, { lineHeight: 20 }]}>
                    {messages[locale].add_eos_create_smart_contract_text_tip3}
                  </Text>
                  <Text onPress={this.checkContact} style={[styles.text14, { marginLeft: 5, alignSelf: 'flex-start', lineHeight: 20, textDecorationLine: 'underline', color: Colors.textColor_255_255_238 }]}>
                    https://github.com/dappub/signupeoseos
                  </Text>
                </LinearGradientContainer>
                <View style={styles.btnContainer}>
                  <TouchableOpacity onPress={this.deleteOrder} style={styles.btn}>
                    <Text style={styles.text14}>
                      {messages[locale].add_eos_create_smart_contract_button_cancel}
                    </Text>
                  </TouchableOpacity>
                  <BPGradientButton onPress={this.refreshOrderInfo} extraStyle={{ marginLeft: 10 }}>
                    <Text style={styles.text14}>
                      {messages[locale].add_eos_create_smart_contract_button_checkstatus}
                    </Text>
                  </BPGradientButton>
                </View>
              </View>
            </ScrollView>
          </View>
          <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearEOSAccountError} />
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
