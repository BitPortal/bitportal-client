import React, { Component } from 'react'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'
import { Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import messages from 'resources/messages'
import FastImage from 'react-native-fast-image'
import Images from 'resources/images'
import LinearGradientContainer from 'components/LinearGradientContainer'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  listContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    borderBottomColor: Colors.minorThemeColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.bgColor_30_31_37
  },
  bgContainer: {
    width: SCREEN_WIDTH,
    marginTop: NAV_BAR_HEIGHT - SCREEN_HEIGHT,
    paddingHorizontal: 15
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  contentContainer: {
    borderRadius: 5,
    width: '100%',
    minHeight: 200,
    padding: 20,
    backgroundColor: Colors.minorThemeColor
  },
  agreement: {
    borderRadius: 5,
    width: '100%',
    minHeight: 100,
    padding: 20,
    backgroundColor: Colors.bgColor_48_49_59
  },
  close: {
    paddingHorizontal: 15,
    marginRight: -15,
  },
  accept: {
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row',
  },
  sign: {
    paddingHorizontal: 15,
    marginLeft: -15,
  },
  image: {
    width: 16,
    height: 16
  },
  btn: {
    width: '100%',
    minHeight: 40,
    borderRadius: 3
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_white_4
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  }
})

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class UserAgreement extends Component {
  state = {
    signed: false
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.isVisible) {
      this.setState({ signed: false })
    }
  }

  signAgreement = () => {
    this.setState(prevState => ({ signed: !prevState.signed }))
  }

  render() {
    const { isVisible, dismissModal, acceptUserAgreement, locale } = this.props
    const { signed } = this.state
    if (!isVisible) return null
    return (
      <IntlProvider messages={messages[locale]}>
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          style={{ margin: 0 }}
          isVisible={isVisible}
          useNativeDriver
          hideModalContentWhileAnimating
          backdropOpacity={0.9}
        >
          <View style={styles.container}>
            <TouchableOpacity style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.1)' }]} onPress={dismissModal} />
            <View style={[styles.bgContainer, styles.center]}>
              <View style={styles.contentContainer}>

                <View style={[styles.between, { marginBottom: 20 }]}>
                  <Text> {''} </Text>
                  <Text style={styles.text18}> 服务与隐私条款 </Text>
                  <TouchableOpacity onPress={dismissModal} style={styles.close}>
                    <Ionicons name="ios-close" size={28} color={Colors.bgColor_FFFFFF} />
                  </TouchableOpacity>
                </View>

                <View style={styles.agreement}>
                  <Text style={[styles.text12, { lineHeight: 17 }]}>
                    尊敬的用户：{'\n'} {'  '}感谢您选择BitPortal服务。《BitPortal服务协议》（以下简称“本协议”）
                    由上海帕特里夏网络科技有限公司（以下简称“帕特里夏”或“我们”）和用户（以下简称“您”或“用户”）
                    签订，本协议在您与帕特里夏之间具有合同上的法律效力。{'\n'} {'  '}帕特里夏在此特别提醒您在使用BitPortal
                    （以下简称“BitPortal” 或“本软件”）之前，请认真阅读《BitPortal服务协议》及后文提到的相关
                    协议，尤其是本协议规定的“免责及责任限制”等条款将以加粗的形式体现，确保您充分理解本协议中各条
                    款，并自主考虑风险。
                  </Text>
                </View>

                <View style={styles.accept}>
                  <TouchableOpacity onPress={this.signAgreement} style={styles.sign}>
                    {
                      signed
                        ? <FastImage source={Images.sign_agreement} style={styles.image} />
                        : <FastImage source={Images.unsign_agreement} style={styles.image} />
                    }
                  </TouchableOpacity>
                  <Text style={[styles.text14, { marginLeft: -10 }]}>
                    我已仔细阅读并同意服务条款和隐私政策
                  </Text>
                </View>

                <LinearGradientContainer colors={!signed && Colors.disabled} type="right" style={styles.btn}>
                  <TouchableWithoutFeedback disabled={!signed} onPress={acceptUserAgreement}>
                    <View style={[styles.btn, styles.center]}>
                      <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
                        继续
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </LinearGradientContainer>

              </View>
            </View>
          </View>
        </Modal>
      </IntlProvider>
    )
  }
}
