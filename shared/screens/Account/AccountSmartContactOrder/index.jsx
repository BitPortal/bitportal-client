import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation'
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
import InputItem from './InputItem'
import styles from './styles'

export const errorMessages = (error/* , messages*/) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    // case 'EOS System Error':
    // return 'EOS System Error'
    default:
      return '尚未激活!'
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

  deleteOrder = () => {
    const componentId = this.props.componentId
    this.props.actions.cancelEOSAccountAssistanceRequestd({ componentId })
  }

  checkContact = () => {
    const uri = 'https://github.com/dappub/signupeoseos'
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.BPWebView',
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
                <InputItem label={messages[locale].add_eos_create_smart_contract_label_contract_account_name} value="signupeoseos" />
                <InputItem label={messages[locale].add_eos_create_smart_contract_label_contract_memo} value={`${eosAccountName}_${ownerPublicKey}`} />
                <LinearGradientContainer type="left" colors={Colors.gradientCardColors3} style={styles.gradient}>
                  <Text style={[styles.text14, { lineHeight: 20 }]}>
                    注明：{'\n'}
                    该创建方式是使用DAppub团队部署的智能合约进行创建，在创建过程中不涉及人工操作。
                    如由于用户操作不当导致资产损失，TP无法帮助用户找回。
                  </Text>
                  <Text style={[styles.text14, { alignSelf: 'flex-start', marginTop: 10, lineHeight: 20 }]}>
                    合约开源地址：{'\n'}
                  </Text>
                  <Text onPress={this.checkContact} style={[styles.text14, { alignSelf: 'flex-start', marginTop: -20, lineHeight: 20, textDecorationLine: 'underline', color: Colors.textColor_255_255_238 }]}>
                    https://github.com/dappub/signupeoseos
                  </Text>
                </LinearGradientContainer>
                <View style={styles.btnContainer}>
                  <TouchableOpacity onPress={this.deleteOrder} style={styles.btn}>
                    <Text style={styles.text14}>
                      取消创建
                    </Text>
                  </TouchableOpacity>
                  <BPGradientButton onPress={this.refreshOrderInfo} extraStyle={{ marginLeft: 10 }}>
                    <Text style={styles.text14}>
                      查询状态
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
