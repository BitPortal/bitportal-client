
import React, { Component } from 'react'
import Colors from 'resources/colors'
import QRCode from 'react-native-qrcode-svg'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { Text, View, Share, TextInput, Clipboard, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { normalizeUnitByCurrency } from 'utils/normalize'
import { eosAccountSelector } from 'selectors/eosAccount'
import { eosQrString } from 'utils'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state)
  }),
  null,
  null,
  { withRef: true }
)

export default class ReceiveQRCode extends Component {
  state = {
    value: '',
    isCopied: false
  }

  // 输入框输入中
  onChangeText = (value) => {
    const previousValue = this.state.value
    const nextValue = normalizeUnitByCurrency('EOS')(value, previousValue)
    this.setState({ value: nextValue })
  }

  // 复制二维码对应值
  copyQrcodeValue = () => {
    if (!this.state.isCopied) {
      Clipboard.setString(eosQrString(this.props.eosAccount.get('data').get('account_name'), this.state.value, 'EOS'))
      this.setState({ isCopied: true })
      this.startTimer()
    }
  }

  // 定时刷新复制按钮
  startTimer = () => {
    this.timer = setTimeout(() => {
      this.setState({ isCopied: false })
    }, 2000)
  }

  shareQrcodeContent = () => {
    Share.share({
      message: eosQrString(this.props.eosAccount.get('data').get('account_name'), this.state.value),
      title: 'EOS Pay'
    })
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  render() {
    const { locale, eosAccount } = this.props
    const { isCopied } = this.state
    const activeEOSAccount = eosAccount.get('data')
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].rcv_nav_title_name}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            rightButton={<CommonRightButton iconName="md-share" onPress={() => this.shareQrcodeContent()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>

              <View style={[styles.content, styles.center]}>
                <View style={styles.qrContainer}>
                  <QRCode
                    value={eosQrString(activeEOSAccount.get('account_name'), this.state.value)}
                    size={140}
                    color="black"
                  />
                </View>
                <Text style={[styles.text14, { marginVertical: 10 }]}>
                  {activeEOSAccount.get('account_name')}
                </Text>
                <Text onPress={this.copyQrcodeValue} style={[styles.text14, { color: isCopied ? Colors.textColor_181_181_181 : Colors.textColor_89_185_226 }]}>
                  {
                    isCopied
                      ? <FormattedMessage id="rcv_qrcode_bottom_copied" />
                      : <FormattedMessage id="rcv_qrcode_bottom_copy" />
                  }

                </Text>
              </View>

              <View style={[styles.inputContainer, styles.between]}>
                <Text style={styles.text14}>
                  <FormattedMessage id="rcv_input_left_tips" />
                </Text>
                <TextInput
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  style={styles.input}
                  keyboardType="numeric"
                  selectionColor={Colors.textColor_89_185_226}
                  keyboardAppearance={Colors.keyboardTheme}
                  placeholder={messages[locale].rcv_input_content_tips}
                  placeholderTextColor={Colors.textColor_149_149_149}
                  onChangeText={e => this.onChangeText(e)}
                  value={this.state.value}
                />
                <Text style={styles.text14}>
                  EOS
                </Text>
              </View>

              <View style={styles.keyboard} />
            </ScrollView>
          </View>

        </View>
      </IntlProvider>
    )
  }
}
