import React, { Component } from 'react'
import { ScrollView, View, TextInput, Text, TouchableNativeFeedback, Clipboard } from 'react-native'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import Modal from 'react-native-modal'

@injectIntl

@connect(
  state => ({
    wallet: state.wallet
  })
)

export default class ExportRioChainKeystore extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('导出 Keystore')
        },
        drawBehind: false
      }
    }
  }

  state = { showModal: false }

  copy = (text) => {
    this.setState({ showModal: true }, () => {
      Clipboard.setString(text)

      setTimeout(() => {
        this.setState({ showModal: false })
      }, 1000)
    })
  }

  render() {
    const { keystore, intl } = this.props
    const keystoreText = JSON.stringify(keystore)

    return (
      <ScrollView style={{ flex: 1, paddingLeft: 16, paddingRight: 16, paddingTop: 16, backgroundColor: 'white' }}>
        <View style={{ width: '100%' }}>
          <View>
            <Text style={{ color: '#673AB7', fontWeight: 'bold', marginBottom: 4 }}>{t(this,'离线保存')}</Text>
            <Text style={{ color: 'rgba(0,0,0,0.54)', marginBottom: 10, lineHeight: 18 }}>{t(this,'切勿保存到邮箱，记事本，网盘，聊天工具等，非常危险')}</Text>
          </View>
          <View>
            <Text style={{ color: '#673AB7', fontWeight: 'bold', marginBottom: 4 }}>{t(this,'切勿使用网络传输')}</Text>
            <Text style={{ color: 'rgba(0,0,0,0.54)', marginBottom: 10, lineHeight: 18 }}>{t(this,'切勿通过网络工具传输，一旦被黑客获取将造成不可挽回的资产损失。建议离线设备通过扫二维码方式传输')}</Text>
          </View>
          <View>
            <Text style={{ color: '#673AB7', fontWeight: 'bold', marginBottom: 4 }}>{t(this,'密码管理工具保存')}</Text>
            <Text style={{ color: 'rgba(0,0,0,0.54)', marginBottom: 10, lineHeight: 18 }}>{t(this,'建议使用密码管理工具管理。')}</Text>
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 16 }}>
          <View style={{ width: '100%', borderColor: 'rgba(0,0,0,0.12)', borderWidth: 1, borderRadius: 4, padding: 15, backgroundColor: '#FAFAFA' }}>
            <Text style={{ color: 'rgba(0,0,0,0.87)' }}>{keystoreText}</Text>
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 26 }}>
          <TouchableNativeFeedback onPress={this.copy.bind(this, keystoreText)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)}>
            <View
              style={{
                width: '100%',
                height: 50,
                backgroundColor: '#673AB7',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                borderRadius: 4,
                elevation: 2
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 17
                }}
              >
                {intl.formatMessage({ id: 'export_key_button_copy_keystore' })}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <Modal
          isVisible={this.state.showModal}
          backdropOpacity={0}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
          onModalHide={this.onModalHide}
        >
          {this.state.showModal && <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.87)', padding: 16, borderRadius: 4, height: 48, elevation: 1, justifyContent: 'center', width: '100%' }}>
              <Text style={{ fontSize: 14, color: 'white' }}>{intl.formatMessage({ id: 'general_toast_text_copied' })}</Text>
            </View>
          </View>}
        </Modal>
      </ScrollView>
    )
  }
}
