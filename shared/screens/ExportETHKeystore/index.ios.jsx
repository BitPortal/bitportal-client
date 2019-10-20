import React, { Component } from 'react'
import { ScrollView, View, TextInput, Text, TouchableOpacity, Clipboard } from 'react-native'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import Modal from 'react-native-modal'
import TableView from 'components/TableView'
const { Section, Item } = TableView

@injectIntl

@connect(
  state => ({
    wallet: state.wallet
  })
)

export default class ExportETHKeystore extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '导出 Keystore'
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

  state = { showModal: false, showModalContent: false }

  copy = (text) => {
    this.setState({ showModal: true, showModalContent: true }, () => {
      Clipboard.setString(text)

      setTimeout(() => {
        this.setState({ showModal: false }, () => {
          this.setState({ showModalContent: false })
        })
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
            <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 4 }}>离线保存</Text>
            <Text style={{ color: '#8E8E93', marginBottom: 10, lineHeight: 18 }}>切勿保存到邮箱，记事本，网盘，聊天工具等，非常危险</Text>
          </View>
          <View>
            <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 4 }}>切勿使用网络传输</Text>
            <Text style={{ color: '#8E8E93', marginBottom: 10, lineHeight: 18 }}>切勿通过网络工具传输，一旦被黑客获取将造成不可挽回的资产损失。建议离线设备通过扫二维码方式传输。</Text>
          </View>
          <View>
            <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 4 }}>密码管理工具保存</Text>
            <Text style={{ color: '#8E8E93', marginBottom: 10, lineHeight: 18 }}>建议使用密码管理工具管理。</Text>
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 16 }}>
          <View style={{ width: '100%', borderColor: '#F3F3F3', borderWidth: 1, borderRadius: 17, padding: 15, backgroundColor: '#FAFAFA' }}>
            <Text>
              {keystoreText}
            </Text>
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 26 }}>
          <TouchableOpacity
            style={{
              width: '100%',
              height: 50,
              backgroundColor: '#007AFF',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              borderRadius: 10
            }}
            underlayColor="#007AFF"
            activeOpacity={0.8}
            onPress={this.copy.bind(this, keystoreText)}
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
          </TouchableOpacity>
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
        >
          {this.state.showModalContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{intl.formatMessage({ id: 'general_toast_text_copied' })}</Text>
            </View>
          </View>}
        </Modal>
      </ScrollView>
    )
  }
}
