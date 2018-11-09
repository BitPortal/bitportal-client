import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ScrollView, TouchableOpacity, Clipboard } from 'react-native'
import { Navigation } from 'react-native-navigation'
import QRCode from 'react-native-qrcode-svg'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { IntlProvider } from 'react-intl'
import Loading from 'components/Loading'
import Alert from 'components/Alert'
import messages from 'resources/messages'
import Colors from 'resources/colors'
import { bindActionCreators } from 'redux'
import * as eosAccountActions from 'actions/eosAccount'
import { BPGradientButton } from 'components/BPNativeComponents'
import Dialog from 'components/Dialog'
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

export default class AccountAssistanceOrder extends Component {
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
      messages[locale].assets_popup_content_delete_order,
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

  copyAccountName = () => {
    const { eosAccount } = this.props
    const eosAccountName = eosAccount.getIn(['eosAccountCreationRequestInfo', 'eosAccountName'])
    Clipboard.setString(eosAccountName)
    Toast(messages[this.props.locale].copy_text_copy_success)
  }

  copyPublicKey = () => {
    const { eosAccount } = this.props
    const ownerPublicKey = eosAccount.getIn(['eosAccountCreationRequestInfo', 'ownerPublicKey'])
    Clipboard.setString(ownerPublicKey)
    Toast(messages[this.props.locale].copy_text_copy_success)
  }

  render() {
    const { locale, eosAccount } = this.props
    const loading = eosAccount.get('loading')
    const error = eosAccount.get('error')
    const eosAccountName = eosAccount.getIn(['eosAccountCreationRequestInfo', 'eosAccountName'])
    const ownerPublicKey = eosAccount.getIn(['eosAccountCreationRequestInfo', 'ownerPublicKey'])
    const activePublicKey = eosAccount.getIn(['eosAccountCreationRequestInfo', 'activePublicKey'])
    const qrcode = JSON.stringify({ account: eosAccountName, owner: ownerPublicKey, active: activePublicKey })

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            title={messages[locale].add_eos_create_friend_assistance_title_friend_assistance}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.contentContainer}>
                <LinearGradientContainer type="left" colors={Colors.gradientCardColors3} style={styles.gradient}>
                  <Text style={[styles.text14, { lineHeight: 20 }]}>
                    {messages[locale].add_eos_create_friend_assistance_text_tip1}
                  </Text>
                  <Text style={[styles.text14, { marginTop: 10, lineHeight: 20 }]}>
                    {messages[locale].add_eos_create_friend_assistance_text_tip2}
                  </Text>
                </LinearGradientContainer>
                <View style={styles.qrCodeContainer}>
                  <QRCode
                    value={qrcode}
                    size={100}
                    color="black"
                  />
                </View>
                <InputItem
                  label={messages[locale].add_eos_create_friend_assistance_label_account}
                  value={eosAccountName}
                  copyLabel={messages[locale].copy_button_copy}
                  onPress={this.copyAccountName}
                />
                <InputItem
                  label={messages[locale].add_eos_create_friend_assistance_label_owner}
                  value={ownerPublicKey}
                  copyLabel={messages[locale].copy_button_copy}
                  onPress={this.copyPublicKey}
                />
                <InputItem
                  label={messages[locale].add_eos_create_friend_assistance_label_active}
                  value={activePublicKey}
                  copyLabel={messages[locale].copy_button_copy}
                  onPress={this.copyPublicKey}
                />
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
