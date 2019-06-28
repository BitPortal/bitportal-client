import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17
  }
})

@connect(
  state => ({
  }),
  dispatch => ({
    actions: bindActionCreators({
    }, dispatch)
  })
)

export default class AddIdentity extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'skip',
            text: '跳过'
          }
        ],
        backButton: {
          visible: false
        },
        largeTitle: {
          visible: false
        },
        noBorder: true,
        background: {
          color: 'rgba(0,0,0,0)',
          translucent: true
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'skip') {
      Navigation.dismissModal(this.props.componentId)
    }
  }

  toCreateIdentity = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CreateIdentity'
      }
    })
  }

  toRecoverIdentity = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.RecoverIdentity'
      }
    })
  }

  componentDidAppear() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <FastImage
            source={require('resources/images/AddIdentityBackground.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
        <View style={{ width: '100%', height: 420, paddingHorizontal: 16, paddingVertical: 30 }}>
          <Text style={{ fontSize: 30, marginBottom: 10, marginTop: 40 }}>创建您的</Text>
          <Text style={{ fontSize: 30, marginBottom: 20 }}>
            币通 <Text style={{ color: '#007AFF' }}>数字身份</Text>
          </Text>
          <Text style={{ fontSize: 17, marginBottom: 80 }}>
            只需一个身份，管理多链钱包
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.toCreateIdentity}>
            <Text style={styles.buttonText}>创建身份</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#EFEFF4' }]} onPress={this.toRecoverIdentity}>
            <Text style={[styles.buttonText, { color: '#007AFF' }]}>恢复身份</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
