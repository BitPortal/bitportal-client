import React, { Component } from 'react'
import { ScrollView, View, TextInput, Text, TouchableOpacity, Clipboard } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import Sound from 'react-native-sound'
import Modal from 'react-native-modal'
import TableView from 'components/TableView'
import { DarkModeContext } from 'utils/darkMode'
const { Section, Item } = TableView

Sound.setCategory('Playback')
const copySound = new Sound('copy.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error)
    return
  }

  console.log(`duration in seconds: ${copySound.getDuration()}number of channels: ${copySound.getNumberOfChannels()}`)
})

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
          text: t(this,'pk_export_eth')
        },
        backButton: {
          title: t(this,'button_back')
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
  static contextType = DarkModeContext
  state = { showModal: false, showModalContent: false }

  copy = (text) => {
    this.setState({ showModal: true, showModalContent: true }, () => {
      Clipboard.setString(text)
      copySound.play((success) => {
        if (success) {
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
          copySound.reset()
        }
      })

      setTimeout(() => {
        this.setState({ showModal: false }, () => {
          this.setState({ showModalContent: false })
        })
      }, 1000)
    })
  }

  render() {
    const { privateKey } = this.props
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <ScrollView style={{ flex: 1, paddingLeft: 16, paddingRight: 16, paddingTop: 16, backgroundColor: isDarkMode ? 'black' : 'white' }}>
        <View style={{ width: '100%' }}>
          <View>
    <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 4, color: isDarkMode ? 'white' : 'black' }}>{t(this,'save_offline')}</Text>
    <Text style={{ color: '#8E8E93', marginBottom: 10, lineHeight: 18, color: isDarkMode ? 'white' : 'black' }}>{t(this,'save_hint')}</Text>
          </View>
          <View>
    <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 4, color: isDarkMode ? 'white' : 'black' }}>{t(this,'save_hint2')}</Text>
            <Text style={{ color: '#8E8E93', marginBottom: 10, lineHeight: 18, color: isDarkMode ? 'white' : 'black' }}>{t(this,'save_hint3')}</Text>
          </View>
          <View>
            <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 4, color: isDarkMode ? 'white' : 'black' }}>{t(this,'save_pwdtool')}</Text>
            <Text style={{ color: '#8E8E93', marginBottom: 10, lineHeight: 18, color: isDarkMode ? 'white' : 'black' }}>{t(this,'save_pwdtool_recommend')}</Text>
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 16 }}>
          <View style={{ width: '100%', borderColor: '#F3F3F3', borderWidth: 1, borderRadius: 17, padding: 15, backgroundColor: isDarkMode ? 'black' : '#FAFAFA' }}>
            <Text style={{ color: isDarkMode ? 'white' : 'black'}}>
              {privateKey}
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
            onPress={this.copy.bind(this, privateKey)}
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
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{t(this,'copied')}</Text>
            </View>
          </View>}
        </Modal>
      </ScrollView>
    )
  }
}
