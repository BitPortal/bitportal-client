import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ScrollView, InteractionManager } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { IntlProvider } from 'react-intl'
import Loading from 'components/Loading'
import Prompt from 'components/Prompt'
import Alert from 'components/Alert'
import messages from 'resources/messages'
import { bindActionCreators } from 'redux'
import * as eosAccountActions from 'actions/eosAccount'
import { BPGradientButton } from 'components/BPNativeComponents'
import InputItem from './InputItem'
import styles from './styles'

export const errorMessages = (error/* , messages*/) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'EOS System Error':
      return 'EOS System Error'
    default:
      return '创建失败!'
  }
}

export const errorMessageDetail = (error) => {
  if (!error || typeof error !== 'object') { return null }

  return error.detail
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    loading: state.eosAccount.get('loading'),
    showSuccess: state.eosAccount.get('showSuccess'),
    error: state.eosAccount.get('error')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAccountActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class AccountAssistancePayment extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = { isVisible: false }

  handleConfirm = (password) => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        const { account, owner, active } = this.props
        this.props.actions.createEOSAccountForOthersRequested({
          password,
          eosAccountName: account,
          ownerPublicKey: owner,
          activePublicKey: active
        })
      })
    })
  }

  handleSuccess = () => {
    this.props.actions.clearEOSAccountError()
    Navigation.pop(this.props.componentId)
  }

  showPrompt = () => {
    this.setState({ isVisible: true })
  }

  closePrompt = () => {
    this.setState({ isVisible: false })
  }

  render() {
    const { locale, account, owner, active, loading, error, showSuccess } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            title={messages[locale].add_eos_create_title_create_assistance}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.contentContainer}>
                <InputItem label="账户名称" value={account} />
                <InputItem label="Owner Key" value={owner} />
                <InputItem label="Active Key" value={active} />
                <View style={styles.btnContainer}>
                  <BPGradientButton onPress={this.showPrompt}>
                    <Text style={styles.text14}>
                      注册EOS账户
                    </Text>
                  </BPGradientButton>
                </View>
              </View>
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
          <Alert message={errorMessages(error, messages[locale])} subMessage={errorMessageDetail(error)} dismiss={this.props.actions.clearEOSAccountError} />
          <Alert message={!!showSuccess && '创建成功!'} dismiss={this.handleSucess} />
          <Prompt
            isVisible={this.state.isVisible}
            title={messages[locale].general_popup_label_password}
            negativeText={messages[locale].general_popup_button_cancel}
            positiveText={messages[locale].general_popup_button_confirm}
            type="secure-text"
            callback={this.handleConfirm}
            dismiss={this.closePrompt}
          />
        </View>
      </IntlProvider>
    )
  }
}
