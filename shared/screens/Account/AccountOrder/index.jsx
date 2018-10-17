import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation'
import QRCode from 'react-native-qrcode-svg'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { IntlProvider } from 'react-intl'
import Loading from 'components/Loading'
import messages from 'resources/messages'
import Colors from 'resources/colors'
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

export default class AccountOrder extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  refreshOrderInfo = () => {

  }

  deleteOrder = () => {
    const componentId = this.props.componentId
    this.props.actions.cancelEOSAccountAssistanceRequestd({ componentId })
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
                <Text style={styles.text14}>
                  创建账户需要消耗 EOS，请您找拥有 EOS 余额的可信账户扫描下方二维码帮您支付本次创建的费用。
                </Text>
                <LinearGradientContainer type="left" colors={Colors.gradientCardColors3} style={styles.gradient}>
                  <Text style={styles.text14}>
                    在注册完成后请仔细核对及时备份您的私钥，以避免被盗风险。
                  </Text>
                </LinearGradientContainer>
                <View style={styles.qrCodeContainer}>
                  <QRCode
                    value={'{ type: assistanceCreation }'}
                    size={100}
                    color="black"
                  />
                </View>
                <InputItem label="账户名称" value={eosAccountName} />
                <InputItem label="Owner Key" value={publicKey} />
                <InputItem label="Active Key" value={publicKey} />
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
          <Loading isVisible={loading} />
        </View>
      </IntlProvider>
    )
  }
}
