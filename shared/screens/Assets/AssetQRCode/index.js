
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import QRCode from 'react-native-qrcode'
import { SCREEN_WIDTH, isIphoneX } from 'utils/dimens'
import { 
  Text, 
  View, 
  Image,
  Share,
  TextInput,
  Clipboard,
  ScrollView, 
  TouchableOpacity, 
  TouchableHighlight,
  ActivityIndicator
} from 'react-native'
import Images from 'resources/images'

const screen_width = isIphoneX ? SCREEN_WIDTH - 40 : SCREEN_WIDTH
const qrCodeSize = screen_width/2

export default class AssetQRCode extends Component {

  state = {
    value: '',
    isCopied: false,
    enableQRCode: false,
    qrCodeValue: 'rfaklfa'
  }

  // 输入框输入中
  onChangeText = (value) => {
    this.setState({ value })
  }

  // 复制二维码对应值
  copyQrcodeValue = () => {
    Clipboard.setString(this.state.qrCodeValue)
    this.setState({ isCopied: true })
    this.startTimer()
  }

  // 定时刷新复制按钮
  startTimer = () => {
    this.timer = setTimeout(() => {
      this.setState({ isCopied: false })
    }, 3000)
  }

  shareQrcodeContent = () => {
    Share.share({ 
      message: this.state.qrCodeValue,
      title: this.state.value
    })
  }

  componentDidMount() {
    // 优化Android modal体验
    this.timer = setTimeout(() => {
      this.setState({ enableQRCode: true })
      clearTimeout(this.timer)
    }, 1000) 
  }

  componentWillUnmount() {
    // 清除定时器
    this.timer && clearTimeout(this.timer)
  }

  render() {
    const { dismissModal, assetName } = this.props
    const { isCopied, enableQRCode } = this.state
    return (
      <View style={styles.container}>

        <TouchableOpacity style={[styles.close, styles.center]} onPress={() => dismissModal()}>
          <Ionicons name="ios-close-outline" size={50} color={Colors.bgColor_FFFFFF} />
        </TouchableOpacity>

        <View style={styles.qrCodeContainer}>
          <View style={[styles.head, styles.center]}>
            <Text style={styles.text24}> { assetName }  </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCorrect={false}
              underlineColorAndroid="transparent"
              style={styles.input}
              selectionColor={Colors.minorThemeColor}
              keyboardAppearance={Colors.keyboardTheme}
              placeholder={'0'}
              onChangeText={(e) => this.onChangeText(e)}
              value={this.state.value}
            />
          </View>

          <View style={[styles.separator, styles.between]}>
            <View style={[styles.semicircle, { marginLeft: -5 }]} />
            <Image source={Images.seperator} style={styles.seperator2} resizeMode="stretch" />
            <View style={[styles.semicircle, { marginRight: -5 }]} />
          </View>

          <View style={[styles.qrCode, styles.center]}>
            {
              enableQRCode ?
              <QRCode
                value={this.state.qrCodeValue}
                size={qrCodeSize}
                bgColor='black'
                fgColor='white'
              />
              :
              <ActivityIndicator />
            }
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
            }]}>
              {isCopied ? 'Copied' : 'Copy'}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight 
            underlayColor={Colors.textColor_89_185_226} 
            onPress={() => this.shareQrcodeContent()} style={[styles.btn, styles.center]}
          >
            <Text style={styles.text14}>
              Share
            </Text>
          </TouchableHighlight>
        </View>

      </View>
    )
  }
}

