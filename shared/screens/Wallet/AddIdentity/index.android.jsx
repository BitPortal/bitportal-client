import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, Text, TouchableNativeFeedback, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#673AB7',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF5722',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 4,
    elevation: 3
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17
  }
})

@injectIntl

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
            text: '跳过',
            color: 'white'
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
          color: 'rgba(0,0,0,0)'
        },
        drawBehind: true,
        elevation: 0
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
    const { intl } = this.props

    return (
      <View style={styles.container}>
        <View
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', alignItems: 'center', justifyContent: 'center' }}
        >
          <Image
            source={require('resources/images/add_identity_background.png')}
            style={{ width: '70%', height: '100%' }}
            resizeMode="contain"
            resizeMethod="resize"
          />
        </View>
        <View style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '50%', paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 22, marginBottom: 10, color: 'white' }}>{intl.formatMessage({ id: 'identity_add_title_1' })}</Text>
          <Text style={{ fontSize: 22, marginBottom: 20, color: 'white' }}>
            {intl.formatMessage({ id: 'identity_add_title_2' })} <Text style={{ color: '#FF5722' }}>{intl.formatMessage({ id: 'identity_add_title_3' })}</Text>
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 30, color: 'rgba(255,255,255,0.87)' }}>
            {intl.formatMessage({ id: 'identity_add_slogon' })}
          </Text>
          <TouchableNativeFeedback onPress={this.toCreateIdentity} background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.3)', false)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{intl.formatMessage({ id: 'identity_add_title_button_create_identity' })}</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.toRecoverIdentity} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)}>
            <View style={[styles.button, { backgroundColor: 'white' }]}>
              <Text style={[styles.buttonText, { color: '#673AB7' }]}>{intl.formatMessage({ id: 'identity_add_title_button_recovery_identity' })}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    )
  }
}
