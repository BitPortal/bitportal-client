import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import { bindActionCreators } from 'redux'
import * as eosAccountActions from 'actions/eosAccount'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TextInput, TouchableOpacity, Clipboard } from 'react-native'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from 'resources/messages'
import Toast from 'components/Toast'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.locale
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...eosAccountActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class ExportPrivateKey extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    isCopied: false
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
  }

  onPress = () => {
    if (this.props.entry === 'backup') {
      Navigation.popToRoot(this.props.componentId)
    } else {
      Navigation.pop(this.props.componentId)
    }
  }

  setTimer = () => {
    this.timer = setTimeout(() => {
      this.setState({ isCopied: false })
    }, 2000)
  }

  clipboard = () => {
    Clipboard.setString(this.props.wifs && this.props.wifs[0] && this.props.wifs[0].wif)
    this.setState({ isCopied: true }, () => {
      Toast(messages[this.props.locale].copy_text_copy_success)
      this.setTimer()
    })
  }

  render() {
    const { locale, wifs } = this.props
    const { isCopied } = this.state
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].export_button_private_key}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={this.onPress} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <View style={styles.content}>
                <Text style={[styles.text16, { marginLeft: -1 }]}>
                  <FormattedMessage id="export_private_key_label_note" />
                </Text>
                <Text style={[styles.text14, { marginTop: 15 }]} multiline={true}>
                  <FormattedMessage id="export_private_key_text_note" />
                </Text>
                <Text style={[styles.text16, { marginLeft: -1, marginTop: 30, marginBottom: 10 }]}>
                  <FormattedMessage id="export_private_key_label_owner_key" />
                </Text>
                <View style={[styles.inputContainer]}>
                  {
                    wifs.map(item => (
                      <TextInput
                        key={item.wif}
                        editable={false}
                        multiline={true}
                        autoCorrect={false}
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        selectionColor={Colors.textColor_181_181_181}
                        placeholder="Private key"
                        placeholderTextColor={Colors.textColor_181_181_181}
                        value={item.wif}
                      />
                    ))
                  }
                </View>
                <TouchableOpacity
                  disabled={isCopied}
                  onPress={this.clipboard}
                  style={[styles.btn, styles.center, { marginTop: 20, backgroundColor: isCopied ? Colors.textColor_181_181_181 : Colors.textColor_89_185_226 }]}
                >
                  <Text style={[styles.text14, { color: isCopied ? Colors.textColor_107_107_107 : Colors.textColor_255_255_238 }]}>
                    {isCopied ? <FormattedMessage id="copy_text_copy_success" /> : <FormattedMessage id="copy_button_copy" />}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
