import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, ActionSheetIOS, Alert, Text, ActivityIndicator, Animated, Clipboard, TouchableOpacity } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import * as identityActions from 'actions/identity'
import Modal from 'react-native-modal'
import Sound from 'react-native-sound'
import FastImage from 'react-native-fast-image'
import { activeContactSelector } from 'selectors/contact'
import { identityWalletSelector, importedWalletSelector } from 'selectors/wallet'
import { balanceByIdSelector } from 'selectors/balance'
import * as contactActions from 'actions/contact'
import * as walletActions from 'actions/wallet'
import { DarkModeContext } from 'utils/darkMode'
import styles from './styles'

Sound.setCategory('Playback')
const copySound = new Sound('copy.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error)
    return
  }

  console.log(`duration in seconds: ${copySound.getDuration()}number of channels: ${copySound.getNumberOfChannels()}`)
})

export default class AboutUs extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  static contextType = DarkModeContext
  subscription = Navigation.events().bindComponent(this)

  state = {
    showModal: false,
    showModalContent: false
  }

  toWebsite = (url) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WebView',
        passProps: {
          url,
          id: 99999
        }
      }
    })
  }

  render() {
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <ScrollView style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : 'white' }}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingTop: 0, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
          <View style={{ height: 61 }}>
            <FastImage
              source={require('resources/images/Icon-60.png')}
              style={{ width: 60, height: 60, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
            />
          </View>
          <View style={{ height: 61, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, color: isDarkMode ? 'white' : '#000' }} numberOfLines={1}>BitPortal</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#666' }} numberOfLines={1}>v0.10.1</Text>
          </View>
          <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: '#C8C7CC' }} />
        </View>
        <View style={{ flex: 1, width: '100%' }}>
          <TouchableOpacity style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row' }} onPress={this.toWebsite.bind(this, 'https://www.bitportal.io')}>
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row', padding: 16 }}>
              <Text style={{ color: isDarkMode ? 'white' : 'black' }}>Website</Text>
              <Text style={{ color: '#007AFF' }}>https://www.bitportal.io</Text>
            </View>
          </TouchableOpacity>
          <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: '#C8C7CC' }} />
          <TouchableOpacity style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row' }} onPress={this.toWebsite.bind(this, 'https://twitter.com/BitPortal_IO')}>
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row', padding: 16 }}>
              <Text style={{ color: isDarkMode ? 'white' : 'black' }}>Twitter</Text>
              <Text style={{ color: '#007AFF' }}>https://twitter.com/BitPortal_IO</Text>
            </View>
          </TouchableOpacity>
          <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: '#C8C7CC' }} />
          <TouchableOpacity style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row' }} onPress={this.toWebsite.bind(this, 'https://t.me/BitPortal_official_EN')}>
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row', padding: 16 }}>
              <Text style={{ color: isDarkMode ? 'white' : 'black' }}>Telegram</Text>
              <Text style={{ color: '#007AFF' }}>https://t.me/BitPortal_official_EN</Text>
            </View>
          </TouchableOpacity>
          <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: '#C8C7CC' }} />
          <TouchableOpacity style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row' }} onPress={this.toWebsite.bind(this, 'https://discordapp.com/invite/ZRUvfxV')}>
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row', padding: 16 }}>
              <Text style={{ color: isDarkMode ? 'white' : 'black' }}>Discord</Text>
              <Text style={{ color: '#007AFF' }}>https://discordapp.com/invite/ZRUvfxV</Text>
            </View>
          </TouchableOpacity>
          <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: '#C8C7CC' }} />
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
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>已复制</Text>
            </View>
          </View>}
        </Modal>
      </ScrollView>
    )
  }
}
