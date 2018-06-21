/* @jsx */

import React from 'react'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import InputItem from 'components/InputItem'
import { BlurView } from 'react-native-blur'
import { SCREEN_WIDTH } from 'utils/dimens'
import {
  Text,
  View,
  TextInput,
  ScrollView,
  findNodeHandle,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import styles from './styles'

export default class PrivateKeyCreation extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    isAccountVaild: true,
    viewRef: null,
    showPrivateKey: false,
    privateKey: '(function(i,s,o,g,r,a,m){i[`GoogleAnalyticsObject`]=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,`script`,`//www.google-analytics.com/analytics.js`,`ga`);'
  }

  changeAccountName = (accountName) => {
    if (accountName === 'meon') this.setState({ isAccountVaild: false })
    else this.setState({ isAccountVaild: true })
  }

  changePrivateKey = () => {

  }

  goToBackup = () => {
    if (!this.state.showPrivateKey) {
      this.setState({ showPrivateKey: !this.state.showPrivateKey })
    } else {
      this.props.navigator.push({ screen: 'BitPortal.BackupTips' })
    }
  }

  importPrivateKey = () => {
    this.props.navigator.push({
      screen: 'BitPortal.AccountImport'
    })
  }

  componentDidMount() {
    this.setState({ viewRef: findNodeHandle(this.viewRef) }) // eslint-disable-line react/no-did-mount-set-state
  }

  render() {
    const { isAccountVaild, showPrivateKey } = this.state

    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          title="Create New Account"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <InputItem
                title="Name Your BitPortal"
                placeholder="Up to 12 characters"
                isContentVaild={isAccountVaild}
                textFilter={text => (text.substring(0, 12))}
                onChangeText={e => this.changeAccountName(e)}
                TipsComponent={() => (
                  !isAccountVaild &&
                  <Text style={[styles.text14, { color: Colors.textColor_255_98_92 }]}>
                    Occupied Name
                  </Text>
                )}
              />
              <Text style={[styles.text14, { color: Colors.textColor_89_185_226, marginLeft: -1, marginTop: 25, marginBottom: 15 }]}>
                Private Key
              </Text>
              <View ref={(e) => { this.viewRef = e; return e }} style={[styles.inputContainer]}>
                <TextInput
                  editable={false}
                  multiline={true}
                  autoCorrect={false}
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  selectionColor={Colors.textColor_181_181_181}
                  keyboardAppearance={Colors.keyboardTheme}
                  placeholder="private key"
                  placeholderTextColor={Colors.textColor_181_181_181}
                  onChangeText={e => this.changePrivateKey(e)}
                  value={this.state.privateKey}
                />
              </View>
              {
                !showPrivateKey &&
                <BlurView
                  style={[styles.inputContainer, { borderWidth: 0, height: (SCREEN_WIDTH / 4) - 14, marginTop: -(SCREEN_WIDTH - 64) / 4 }]}
                  viewRef={this.state.viewRef}
                  blurType="dark"
                  overlayColor="rgba(0, 0, 0, 0.95)"
                  blurAmount={10}
                />
              }
              <TouchableHighlight
                onPress={() => this.goToBackup()}
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, {
                  marginTop: 25,
                  backgroundColor: !showPrivateKey ? Colors.textColor_181_181_181 : Colors.textColor_89_185_226
                }]}
              >
                <Text style={styles.text14}>
                  {!showPrivateKey ? 'Show Private Key' : 'Next'}
                </Text>
              </TouchableHighlight>
              <TouchableOpacity
                onPress={() => this.importPrivateKey()}
                style={[styles.btn, styles.center, { marginTop: 25 }]}
              >
                <Text style={[styles.text14, { color: Colors.textColor_89_185_226 }]}>
                  Import
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}
