import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { DarkModeContext } from 'utils/darkMode'

const styles = EStyleSheet.create({
  container: {
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
            text: gt('跳过')
          }
        ],
        backButton: {
          visible: false
        },
        largeTitle: {
          visible: false
        },
        noBorder: true
      }
    }
  }
  static contextType = DarkModeContext
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
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <SafeAreaView style={[styles.container, { color: isDarkMode ? 'black' : 'white' }]}>
        <View
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          {!isDarkMode && <FastImage
                            source={require('resources/images/AddIdentityBackground.png')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
          />}
        </View>
        <View style={{ width: '100%', height: 420, paddingHorizontal: 16, paddingVertical: 30 }}>
          <Text style={{ fontSize: 30, marginBottom: 10, marginTop: 40, color: isDarkMode ? 'white' : 'black' }}>{intl.formatMessage({ id: 'identity_add_title_1' })}</Text>
          <Text style={{ fontSize: 30, marginBottom: 20, color: isDarkMode ? 'white' : 'black' }}>
            {intl.formatMessage({ id: 'identity_add_title_2' })} <Text style={{ color: '#007AFF' }}>{intl.formatMessage({ id: 'identity_add_title_3' })}</Text>
          </Text>
          <Text style={{ fontSize: 17, marginBottom: 80, color: isDarkMode ? 'white' : 'black' }}>
            {intl.formatMessage({ id: 'identity_add_slogon' })}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.toCreateIdentity}>
            <Text style={styles.buttonText}>{intl.formatMessage({ id: 'identity_add_title_button_create_identity' })}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#EFEFF4' }]} onPress={this.toRecoverIdentity}>
            <Text style={[styles.buttonText, { color: '#007AFF' }]}>{intl.formatMessage({ id: 'identity_add_title_button_recovery_identity' })}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}
