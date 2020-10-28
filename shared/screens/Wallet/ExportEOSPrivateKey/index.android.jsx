import React, { Component, Fragment } from 'react'
import { ScrollView, View, TextInput, Text, TouchableNativeFeedback, Clipboard } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import Modal from 'react-native-modal'
import { injectIntl } from "react-intl";

@injectIntl
@connect(
  state => ({
    wallet: state.wallet
  })
)

export default class ExportEOSPrivateKey extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('导出EOS私钥')
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
    const { permissionKeyPairs } = this.props

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
            <Text style={{ color: 'rgba(0,0,0,0.54)', marginBottom: 16, lineHeight: 18 }}>{t(this,'建议使用密码管理工具管理。')}</Text>
          </View>
        </View>
        {permissionKeyPairs.map(permissionKeyPair =>
          <Fragment key={permissionKeyPair.name}>
            <View style={{ width: '100%', paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.12)' }}>
              <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.87)' }}>{permissionKeyPair.name} {t(this,'权限私钥：')}</Text>
            </View>
            {permissionKeyPair.keys.map(key =>
               <Fragment key={key.publicKey}>
                 <View style={{ width: '100%', marginTop: 16 }}>
                   <View style={{ width: '100%', borderColor: 'rgba(0,0,0,0.12)', borderWidth: 1, borderRadius: 4, padding: 15, backgroundColor: '#FAFAFA' }}>
                     <Text style={{ color: 'rgba(0,0,0,0.87)' }}>{key.privateKey}</Text>
                   </View>
                 </View>
                 <View style={{ width: '100%', marginTop: 16 }}>
                   <TouchableNativeFeedback onPress={this.copy.bind(this, key.privateKey)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)}>
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
                         {t(this,'复制私钥')}
                       </Text>
                     </View>
                   </TouchableNativeFeedback>
                 </View>
               </Fragment>
             )}
          </Fragment>
         )}
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
              <Text style={{ fontSize: 14, color: 'white' }}>{t(this,'已复制')}</Text>
            </View>
          </View>}
        </Modal>
      </ScrollView>
    )
  }
}
