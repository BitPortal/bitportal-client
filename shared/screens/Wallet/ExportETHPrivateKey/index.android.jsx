import React, { Component } from 'react'
import { ScrollView, View, TextInput, Text, Clipboard, TouchableNativeFeedback } from 'react-native'
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

export default class ExportETHPrivateKey extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('pk_export_eth')
        },
        backButton: {
          title: gt('button_back')
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
            <Text style={{ color: '#673AB7', fontWeight: 'bold', marginBottom: 4 }}>{t(this,'save_offline')}</Text>
            <Text style={{ color: 'rgba(0,0,0,0.54)', marginBottom: 10, lineHeight: 18 }}>{t(this,'save_hint')}</Text>
          </View>
          <View>
            <Text style={{ color: '#673AB7', fontWeight: 'bold', marginBottom: 4 }}>{t(this,'save_hint2')}</Text>
            <Text style={{ color: 'rgba(0,0,0,0.54)', marginBottom: 10, lineHeight: 18 }}>{t(this,'save_hint3')}</Text>
          </View>
          <View>
            <Text style={{ color: '#673AB7', fontWeight: 'bold', marginBottom: 4 }}>{t(this,'save_pwdtool')}</Text>
            <Text style={{ color: 'rgba(0,0,0,0.54)', marginBottom: 10, lineHeight: 18 }}>{t(this,'save_pwdtool_recommend')}</Text>
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
                {t(this,'pk_copy_eth')}
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
              <Text style={{ fontSize: 14, color: 'white' }}>{t(this,'copied')}</Text>
            </View>
          </View>}
        </Modal>
      </ScrollView>
    )
  }
}
