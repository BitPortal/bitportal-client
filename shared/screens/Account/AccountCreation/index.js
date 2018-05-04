/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { BackButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import Tips from './Tips'
import InputItem from './InputItem'
import PrivateKey from './PrivateKey'

export default class AccountCreation extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    hasAccepted: false,
    canGoNext: false,
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  setPassword = () => {
    this.props.navigator.push({
      screen: 'BitPortal.PasswordSetting'
    })
  }

  // 获取账户名
  changeAccountName = (accountName) => {
    this.accountName = accountName
    this.checkInputInfo()
  }

  // 获取私钥
  changePrivateKey = (privateKey) => {
    this.privateKey = privateKey
    this.checkInputInfo()
  }

  // 同意协议
  acceptAgreement = () => {
    this.setState({ hasAccepted: !this.state.hasAccepted }, () => {
      this.checkInputInfo()
    })
    
  }

  // 检测信息是否填完
  checkInputInfo = () => {
    if (this.accountName && this.state.hasAccepted) {
      this.setState({ canGoNext: true })
    } else {
      this.setState({ canGoNext: false })
    }
  }

  render() {
    const { hasAccepted, canGoNext } = this.state
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<BackButton iconName="md-arrow-back" onPress={() => this.goBack()} />}
          title="Create Account"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Tips />
            <View style={styles.content}>

              <InputItem 
                title="Account Name" 
                placeholder="Up to 12 characters" 
                changeAccountName={(e) => this.changeAccountName(e)} 
              />

              <PrivateKey  
                title="Already have a private key?"
                placeholder="Please fill your private key..."
                changePrivateKey={(e) => this.changePrivateKey(e)}
              />

              <View style={[styles.between, { marginVertical: 20 }]}>
                <TouchableOpacity onPress={() => this.acceptAgreement()} style={{ marginTop: 2 }}>
                  <Ionicons 
                    name="ios-checkmark-circle-outline" 
                    size={20} 
                    color={ !hasAccepted ? Colors.textColor_181_181_181 : Colors.textColor_89_185_226 } 
                  />
                </TouchableOpacity>
                <Text style={[styles.text14, { marginLeft: 5 }]}> 
                  Agree on  {' '}
                  <Text onPress={() => {alert('hey guy!')}} style={styles.decorator}> 
                    Terms of Service and Privacy policy 
                  </Text> 
                </Text>
              </View>

              <TouchableHighlight 
                onPress={() => this.setPassword()} 
                disabled={!canGoNext}
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, {
                  backgroundColor: canGoNext ? Colors.textColor_89_185_226 : Colors.textColor_181_181_181
                }]}
              >
                <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> 
                  Next 
                </Text>
              </TouchableHighlight>

              <TouchableOpacity 
                onPress={() => {}} 
                style={[styles.btn, styles.center, { marginTop: 10, backgroundColor: 'transparent' }]}
              >
                <Text style={[styles.text14, { color: Colors.textColor_89_185_226 }]}> 
                  import 
                </Text>
              </TouchableOpacity>

              <View style={styles.foot}/>

            </View>
          </ScrollView>
        </View>
        
      </View>
    )
  }

}
