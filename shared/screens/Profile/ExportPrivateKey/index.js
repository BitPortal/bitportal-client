/* @tsx */
import React, { Component } from 'react'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import Images from 'resources/images'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import TotalAssetsCard from 'components/TotalAssetsCard'
import { Text, View, ScrollView, TextInput, TouchableOpacity, TouchableHighlight, Clipboard } from 'react-native'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'

@connect(
  (state) => ({
    locale: state.intl.get('locale')
  })
)

export default class ExportPrivateKey extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

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
        <View style={styles.container}>
          <NavigationBar 
            title={messages[locale]['expvk_title_name_expvk']}
            leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()} /> }
          />
            <View style={styles.scrollContainer}>
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
              >
              <View style={styles.content}>

                <Text style={[styles.text16, { marginLeft: -1 }]}> 
                  <FormattedMessage id="expvk_hint_title_point1" />
                </Text>
                <Text style={[styles.text14, { marginTop: 15 }]} multiline={true}> 
                  <FormattedMessage id="expvk_hint_txt_point1" />
                </Text>

                <Text style={[styles.text16, { marginLeft: -1, marginTop: 30, marginBottom: 10 }]}> 
                  <FormattedMessage id="expvk_txtbox_title_pvk" />
                </Text>
                <View style={[styles.inputContainer]}>
                  <TextInput
                    editable={false}
                    multiline={true}
                    autoCorrect={false}
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    selectionColor={Colors.textColor_181_181_181}
                    placeholder={'private key'}
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
                    {isCopied ? <FormattedMessage id="expvk_button_name_copied" /> : <FormattedMessage id="expvk_button_name_copy" />}
                  </Text>
                </TouchableHighlight>

              </View>
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }

}
