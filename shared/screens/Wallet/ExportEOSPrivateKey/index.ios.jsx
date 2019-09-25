import React, { Component, Fragment } from 'react'
import { ScrollView, View, TextInput, Text, TouchableOpacity, Clipboard } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import Sound from 'react-native-sound'
import Modal from 'react-native-modal'
import TableView from 'components/TableView'
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

export default class ExportETHKeystore extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '导出EOS私钥'
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
    const { permissionKeyPairs } = this.props

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
            <Text style={{ color: '#8E8E93', marginBottom: 16, lineHeight: 18 }}>建议使用密码管理工具管理。</Text>
          </View>
        </View>
        {permissionKeyPairs.map(permissionKeyPair =>
          <Fragment key={permissionKeyPair.name}>
            <View style={{ width: '100%', paddingTop: 10, borderTopWidth: 0.5, borderTopColor: '#C8C7CC' }}>
              <Text style={{ fontSize: 17 }}>{permissionKeyPair.name} 权限私钥：</Text>
            </View>
            {permissionKeyPair.keys.map(key =>
               <Fragment key={key.publicKey}>
                 <View style={{ width: '100%', marginTop: 16 }}>
                   <View style={{ width: '100%', borderColor: '#F3F3F3', borderWidth: 1, borderRadius: 17, padding: 15, backgroundColor: '#FAFAFA' }}>
                     <Text>
                       {key.privateKey}
                     </Text>
                   </View>
                 </View>
                 <View style={{ width: '100%', marginTop: 16 }}>
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
                     onPress={this.copy.bind(this, key.privateKey)}
                   >
                     <Text
                       style={{
                         textAlign: 'center',
                         color: 'white',
                         fontSize: 17
                       }}
                     >
                       复制私钥
                     </Text>
                   </TouchableOpacity>
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
