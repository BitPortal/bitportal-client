/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity, TextInput, TouchableHighlight } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import InputItem from 'components/InputItem'

export default class AccountImport extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    isAccountVaild: true
  }

  changeAccountName = () => {

  }

  enterPrivateKey = (privateKey) => {
    
  }

  goToBackUp = () => {
    this.props.navigator.push({
      screen: 'BitPortal.BackupTips'
    })
  }

  render() {
    const { isAccountVaild } = this.state
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          title="Import"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>

              <InputItem 
                title="Name Your Bitportal" 
                placeholder="Up to 12 characters" 
                isContentVaild={isAccountVaild}
                textFilter={(text) => (text.substring(0, 12))}
                onChangeText={(e) => this.changeAccountName(e)} 
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

              <View style={[styles.inputContainer]}>
                <TextInput
                  autoCorrect={false}
                  multiline={true}
                  underlineColorAndroid="transparent"
                  style={styles.input}
                  selectionColor={Colors.textColor_181_181_181}
                  keyboardAppearance={Colors.keyboardTheme}
                  placeholder={'Please fill your private key...'}
                  placeholderTextColor={Colors.textColor_181_181_181}
                  onChangeText={(e) => this.enterPrivateKey(e)}
                  value={this.state.privateKey}
                />
              </View>

              <TouchableHighlight 
                onPress={() =>  this.goToBackUp()} 
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, {
                  marginTop: 25,
                  backgroundColor: Colors.textColor_89_185_226
                }]}
              >
                <Text style={styles.text14}> 
                  Done
                </Text>
              </TouchableHighlight>

            </View>
          </ScrollView>
        </View>

      </View>
    )
  }

}
