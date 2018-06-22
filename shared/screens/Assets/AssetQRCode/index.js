
import React, { Component } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import QRCode from 'react-native-qrcode-svg'
import { SCREEN_WIDTH, isIphoneX } from 'utils/dimens'
import {
  Text,
  View,
  Image,
  Share,
  TextInput,
  Clipboard,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import Images from 'resources/images'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { eosQrString } from 'utils'
import { normalizeUnitByCurrency } from 'utils/normalize'
import messages from './messages'
import styles from './styles'

const screen_width = isIphoneX ? SCREEN_WIDTH - 40 : SCREEN_WIDTH
const qrCodeSize = screen_width / 2

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class AssetQRCode extends Component {
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
    Clipboard.setString(eosQrString(this.props.accountName, this.state.value))
    this.setState({ isCopied: true })
    this.startTimer()
  }

  // 定时刷新复制按钮
  startTimer = () => {
    this.timer = setTimeout(() => {
      this.setState({ isCopied: false })
    }, 2000)
  }

  shareQrcodeContent = () => {
    Share.share({
      message: eosQrString(this.props.accountName, this.state.value),
      title: 'EOS Pay'
    })
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  render() {
    const { dismissModal, accountName, locale } = this.props
    const { isCopied } = this.state

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <TouchableOpacity style={[styles.close, styles.center]} onPress={() => dismissModal()}>
            <Ionicons name="ios-close-outline" size={50} color={Colors.bgColor_FFFFFF} />
          </TouchableOpacity>
          <View style={styles.qrCodeContainer}>
            <View style={[styles.head, styles.center]}>
              <Text style={styles.text24}>{accountName}</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                autoCorrect={false}
                underlineColorAndroid="transparent"
                style={styles.input}
                selectionColor={Colors.textColor_89_185_226}
                keyboardAppearance={Colors.keyboardTheme}
                placeholder="0"
                onChangeText={e => this.onChangeText(e)}
                value={this.state.value}
              />
            </View>
            <View style={[styles.separator, styles.between]}>
              <View style={[styles.semicircle, { marginLeft: -5 }]} />
              <Image source={Images.seperator} style={styles.seperator2} resizeMode="stretch" />
              <View style={[styles.semicircle, { marginRight: -5 }]} />
            </View>
            <View style={[styles.qrCode, styles.center]}>
              <View style={{ padding: 2, borderRadius: 2, maxWidth: qrCodeSize + 4, backgroundColor: Colors.bgColor_FFFFFF }}>
                <QRCode
                  value={eosQrString(this.props.accountName, this.state.value)}
                  size={qrCodeSize}
                  color="black"
                />
              </View>
            </View>
          </View>
          <View style={[styles.btnContainer, styles.between]}>
            <TouchableHighlight
              underlayColor={Colors.textColor_89_185_226}
              onPress={() => this.copyQrcodeValue()}
              disabled={isCopied}
              style={[styles.btn, styles.center, {
                backgroundColor: isCopied ? Colors.textColor_216_216_216 : Colors.textColor_89_185_226
              }]}
            >
              <Text style={[styles.text14, {
                color: isCopied ? Colors.textColor_181_181_181 : Colors.textColor_255_255_238
              }]}
              >
                {isCopied ? <FormattedMessage id="qrcode_button_name_copied" /> : <FormattedMessage id="qrcode_button_name_copy" />}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={Colors.textColor_89_185_226}
              onPress={() => this.shareQrcodeContent()}
style={[styles.btn, styles.center]}
            >
              <Text style={styles.text14}>
                <FormattedMessage id="qrcode_button_name_share" />
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
