/* @tsx */
import React, { Component } from 'react'
import Colors from 'resources/colors'
import { Text, View, ScrollView, TextInput, TouchableHighlight, Clipboard } from 'react-native'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class Keystore extends Component {
  state = {
    isCopied: false,
    privateKey: '(function(i,s,o,g,r,a,m){i[`GoogleAnalyticsObject`]=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,`script`,`//www.google-analytics.com/analytics.js`,`ga`);'
  }

  copyPrivateKey = () => {
    Clipboard.setString(this.state.privateKey)
    this.setState({ isCopied: true })
  }

  render() {
    const { isCopied } = this.state
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.scrollContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
          >
            <View style={styles.content}>

              <Text style={[styles.text16, { marginLeft: -1 }]}>
                <FormattedMessage id="expks_hint_title_point1" />
              </Text>
              <Text style={[styles.text14, { marginTop: 15 }]} multiline={true}>
                <FormattedMessage id="expks_hint_txt_point1" />
              </Text>

              <Text style={[styles.text16, { marginTop: 15, marginLeft: -1 }]}>
                <FormattedMessage id="expks_hint_title_point2" />
              </Text>
              <Text style={[styles.text14, { marginTop: 15 }]} multiline={true}>
                <FormattedMessage id="expks_hint_txt_point2" />
              </Text>

              <Text style={[styles.text16, { marginTop: 15, marginLeft: -1 }]}>
                <FormattedMessage id="expks_hint_title_point3" />
              </Text>
              <Text style={[styles.text14, { marginTop: 15, marginBottom: 15 }]} multiline={true}>
                <FormattedMessage id="expks_hint_txt_point3" />
              </Text>

              <View style={[styles.inputContainer]}>
                <TextInput
                  editable={false}
                  multiline={true}
                  autoCorrect={false}
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  selectionColor={Colors.textColor_181_181_181}
                  placeholder="private key"
                  placeholderTextColor={Colors.textColor_181_181_181}
                  value={this.state.privateKey}
                />
              </View>

              <TouchableHighlight
                onPress={() => this.copyPrivateKey()}
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, {
                  marginTop: 25,
                  backgroundColor: isCopied ? Colors.textColor_181_181_181 : Colors.textColor_89_185_226 }]
                }
              >
                <Text style={styles.text14}>
                  { isCopied ? <FormattedMessage id="expks_button_name_copied" /> : <FormattedMessage id="expks_button_name_copy" />}
                </Text>
              </TouchableHighlight>

            </View>
          </ScrollView>
        </View>
      </IntlProvider>
    )
  }
}
