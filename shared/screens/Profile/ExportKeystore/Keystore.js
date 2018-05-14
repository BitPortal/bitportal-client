/* @tsx */
import React, { Component } from 'react'
import styles from './styles'
import Colors from 'resources/colors'
import { Text, View, ScrollView, TextInput, TouchableOpacity, TouchableHighlight, Clipboard } from 'react-native'

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
    return (
      <View style={styles.scrollContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} 
        >
        <View style={styles.content}>

          <Text style={[styles.text16, { marginLeft: -1 }]}> 
            Do not share with others
          </Text>
          <Text style={[styles.text14, { marginTop: 15 }]} multiline={true}> 
            The Keystore is the access to your account, please don't share it with others, or you could lose all your assets          
          </Text>

          <Text style={[styles.text16, { marginTop: 15, marginLeft: -1 }]}> 
            Do not transfer online
          </Text>
          <Text style={[styles.text14, { marginTop: 15 }]} multiline={true}> 
            Don't transfer the unencrypted Keystore online, it easily gets hacked and result in asset loss.
          </Text>

          <Text style={[styles.text16, { marginTop: 15, marginLeft: -1 }]}> 
            Store it offline
          </Text>
          <Text style={[styles.text14, { marginTop: 15, marginBottom: 15 }]} multiline={true}> 
            Please store the Keystore in a safe hardware, and keep it offline when unused
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
              {isCopied ? 'Copied' : 'Copy Keystore'}
            </Text>
          </TouchableHighlight>

        </View>
      </ScrollView>
    </View>
    )
  }

}
