import React, { Component } from 'react'
import { ScrollView, View, TextInput, Text, Clipboard, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import Modal from 'react-native-modal'

@connect(
  state => ({
    wallet: state.wallet
  })
)

export default class ExportChainXPrivateKey extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '导出ChainX私钥'
        },
        backButton: {
          title: '返回'
        },
        largeTitle: {
          visible: false
        },
        drawBehind: false
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  state = { showModal: false }

  copy = (text) => {
    this.setState({ showModal: true, showModalContent: true }, () => {
      setTimeout(() => {
        this.setState({ showModal: false })
      }, 1000)
    })
  }

  render() {
    const { privateKey } = this.props

    return (
      <ScrollView style={{ flex: 1, paddingLeft: 16, paddingRight: 16, paddingTop: 16, backgroundColor: 'white' }}>
        <View style={{ width: '100%' }}>
          <View>
            <Text style={{ color: '#673AB7', fontWeight: 'bold', marginBottom: 4 }}>离线保存</Text>
            <Text style={{ color: 'rgba(0,0,0,0.54)', marginBottom: 10, lineHeight: 18 }}>切勿保存到邮箱，记事本，网盘，聊天工具等，非常危险</Text>
          </View>
          <View>
            <Text style={{ color: '#673AB7', fontWeight: 'bold', marginBottom: 4 }}>切勿使用网络传输</Text>
            <Text style={{ color: 'rgba(0,0,0,0.54)', marginBottom: 10, lineHeight: 18 }}>切勿通过网络工具传输，一旦被黑客获取将造成不可挽回的资产损失。建议离线设备通过扫二维码方式传输。</Text>
          </View>
          <View>
            <Text style={{ color: '#673AB7', fontWeight: 'bold', marginBottom: 4 }}>密码管理工具保存</Text>
            <Text style={{ color: 'rgba(0,0,0,0.54)', marginBottom: 10, lineHeight: 18 }}>建议使用密码管理工具管理。</Text>
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 16 }}>
          <View style={{ width: '100%', borderColor: 'rgba(0,0,0,0.12)', borderWidth: 1, borderRadius: 4, padding: 15, backgroundColor: '#FAFAFA' }}>
            <Text style={{ color: 'rgba(0,0,0,0.87)' }}>{privateKey}</Text>
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 26 }}>
          <TouchableNativeFeedback onPress={this.copy.bind(this, privateKey)} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)}>
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
                复制ChainX私钥
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
              <Text style={{ fontSize: 14, color: 'white' }}>已复制</Text>
            </View>
          </View>}
        </Modal>
      </ScrollView>
    )
  }
}
