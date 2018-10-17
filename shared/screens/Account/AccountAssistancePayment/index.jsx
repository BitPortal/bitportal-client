import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { IntlProvider } from 'react-intl'
import Loading from 'components/Loading'
import messages from 'resources/messages'
import { bindActionCreators } from 'redux'
import * as eosAccountActions from 'actions/eosAccount'
import { BPGradientButton } from 'components/BPNativeComponents'
import InputItem from './InputItem'
import styles from './styles'

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

export default class AccountAssistancePayment extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  payOrder = () => {

  }

  render() {
    const { locale, eosAccount } = this.props
    const loading = eosAccount.get('loading')
    const eosTempAccountInfo = eosAccount.get('eosTempAccountInfo')
    const eosAccountName = eosTempAccountInfo.get && eosTempAccountInfo.get('eosAccountName')
    const publicKey = eosTempAccountInfo.get && eosTempAccountInfo.get('publicKey')
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
                <InputItem label="账户名称" value={eosAccountName} />
                <InputItem label="Owner Key" value={publicKey} />
                <InputItem label="Active Key" value={publicKey} />
                <View style={styles.btnContainer}>
                  <BPGradientButton onPress={this.payOrder}>
                    <Text style={styles.text14}>
                      注册EOS账户
                    </Text>
                  </BPGradientButton>
                </View>
              </View>
            </ScrollView>
          </View>
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
