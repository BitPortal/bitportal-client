import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity, TouchableHighlight, InteractionManager } from 'react-native'
import FastImage from 'react-native-fast-image'
import Colors from 'resources/colors'
import images from 'resources/images'
import Prompt from 'components/Prompt'
import Loading from 'components/Loading'
import Alert from 'components/Alert'
import LinearGradientContainer from 'components/LinearGradientContainer'
import * as keystoreActions from 'actions/keystore'
import messages from 'resources/messages'
import styles from './styles'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.general_error_popup_text_password_incorrect
    default:
      return messages.export_private_key_error_popup_text_failed
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    exporting: state.keystore.get('exporting'),
    error: state.keystore.get('error'),
    wallet: state.wallet
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...keystoreActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class Backup extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    isVisible: false
  }

  closePrompt = () => {
    this.setState({ isVisible: false })
  }

  handleConfirm = (password) => {
    this.setState({ isVisible: false }, () => {
      InteractionManager.runAfterInteractions(() => {
        this.props.actions.exportEOSKeyRequested({
          password,
          componentId: this.props.componentId,
          origin: this.props.wallet.getIn(['data', 'origin']),
          bpid: this.props.wallet.getIn(['data', 'bpid']),
          eosAccountName: this.props.wallet.getIn(['data', 'eosAccountName'])
        })
      })
    })
  }

  skip = () => {
    Navigation.popToRoot(this.props.componentId)
  }

  render() {
    const { locale, exporting, error } = this.props

    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={this.skip} />}
          title={messages[locale].add_create_success_title_backup}
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.content, { alignItems: 'center' }]}>
              <View style={{ marginVertical: 20 }}>
                <FastImage source={images.backup_group} style={styles.image} />
              </View>
              <Text style={styles.text14}>
                {messages[locale].add_create_success_label_backup_private_key}
              </Text>
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.text14, { color: Colors.textColor_181_181_181 }]}>
                  {messages[locale].add_create_success_text_backup_private_key}
                </Text>
              </View>
              <TouchableHighlight
                onPress={() => this.setState({ isVisible: true })}
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, { marginTop: 25, backgroundColor: Colors.textColor_89_185_226 }]}
              >
                <LinearGradientContainer type="right" style={[[styles.btn, styles.center]]}>
                  <Text style={styles.text14}>
                    {messages[locale].add_create_success_button_start_backup}
                  </Text>
                </LinearGradientContainer>
              </TouchableHighlight>
              <TouchableOpacity
                onPress={this.skip}
                style={[styles.btn, styles.center, { marginTop: 10 }]}
              >
                <Text style={[styles.text14, { color: Colors.textColor_89_185_226 }]}>
                  {messages[locale].add_create_success_button_skip_backup}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Loading isVisible={exporting} text={messages[locale].export_private_key_text_exporting} />
          <Alert message={errorMessages(error, messages[locale])} dismiss={this.props.actions.clearKeystoreError} delay={500} />
          <Prompt
            isVisible={this.state.isVisible}
            type="secure-text"
            callback={this.handleConfirm}
            dismiss={this.closePrompt}
          />
        </View>
      </View>
    )
  }
}
