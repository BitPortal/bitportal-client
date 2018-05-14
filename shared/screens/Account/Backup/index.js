/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import InputItem from 'components/InputItem'
import { BlurView } from 'react-native-blur'
import { SCREEN_WIDTH } from 'utils/dimens'
import { 
  Text, 
  View, 
  Clipboard,
  TextInput,
  ScrollView,
  findNodeHandle,
  TouchableOpacity, 
  TouchableHighlight
} from 'react-native'

export default class Backup extends BaseScreen {

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
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          title="Backup"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>

              <Text style={[styles.text14, { marginLeft: -1 }]}> 
                Please store the private key safely. Make sure no one or other device is monitring your screen 
              </Text>

              <Text style={[styles.text14, { color: Colors.textColor_89_185_226, marginLeft: -1, marginTop: 25, marginBottom: 15 }]}> 
                Private Key 
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
                  {isCopied ? 'Copied' : 'Copy'}
                </Text>
              </TouchableHighlight>

            </View>
          </ScrollView>
        </View>
        
      </View>
    )
  }

}
