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
import InputItem from 'components/InputItem'
import PasswordStrength from 'components/PasswordStrength'

export default class AccountCreation extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    hasAccepted: false,
    canGoNext: false,
    password: '',
    isAccountVaild: true,
    isSamePassword: true
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  setPassword = () => {
    this.checkInputInfo()
    this.props.navigator.push({
      screen: 'BitPortal.PasswordSetting'
    })
  }

  // 输入账户名
  changeAccountName = (accountName) => {
    if (accountName == 'meon') this.setState({ isAccountVaild: false })
    else this.setState({ isAccountVaild: true })
    this.accountName = accountName
    this.checkInputInfo()
  }

  // 输入密码
  changePassword = (password) => {
    this.setState({ password })
    this.checkInputInfo()
  }

  // 确认密码
  changeConfirmPassword = (confirmPassword) => {
    this.confirmPassword = confirmPassword
    if (confirmPassword != this.state.password) 
      this.setState({ isSamePassword: false }, () => { this.checkInputInfo() })
    else 
      this.setState({ isSamePassword: true }, () => { this.checkInputInfo() })
  }

  // 同意协议
  acceptAgreement = () => {
    this.setState({ hasAccepted: !this.state.hasAccepted }, () => {
      this.checkInputInfo()
    })
  }

  // 检测信息是否填完
  checkInputInfo = () => {
    const { isAccountVaild, isSamePassword, isPasswordVaild, hasAccepted } = this.state
    if (isAccountVaild && hasAccepted && isSamePassword) {
      this.setState({ canGoNext: true })
    } else {
      this.setState({ canGoNext: false })
    }
  }

  render() {
    const { hasAccepted, canGoNext, isAccountVaild, isSamePassword, password } = this.state
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<BackButton iconName="md-arrow-back" onPress={() => this.goBack()} />}
          title="Create New Account"
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

              <InputItem 
                title="Set Password" 
                placeholder="Example: 'Tvdsa12321'" 
                extraStyle={{ marginTop: 25 }}
                secureTextEntry={true}
                onChangeText={(e) => this.changePassword(e)} 
                TipsComponent={() => ( <PasswordStrength password={password} /> )}
              />

              <InputItem 
                title="Confirm Password" 
                placeholder="Enter the same password" 
                isContentVaild={isSamePassword}
                extraStyle={{ marginTop: 25 }}
                secureTextEntry={true}
                onChangeText={(e) => this.changeConfirmPassword(e)} 
                TipsComponent={() => (
                  !isSamePassword &&
                  <Text style={[styles.text14, { color: Colors.textColor_255_98_92 }]}> 
                    Not Same Password
                  </Text>
                )}
              />

              <View style={[styles.between, { marginVertical: 20 }]}>
                <TouchableOpacity onPress={() => this.acceptAgreement()} style={{ marginTop: 2 }}>
                  <Ionicons 
                    name="ios-checkmark-circle-outline" 
                    size={18} 
                    color={ !hasAccepted ? Colors.textColor_181_181_181 : Colors.textColor_89_185_226 } 
                  />
                </TouchableOpacity>
                <Text numberOfLines={1} style={[styles.text14, { color: Colors.textColor_181_181_181, marginLeft: 5 }]}> 
                  Agree on {''}
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
                <Text style={styles.text14}> 
                  Next 
                </Text>
              </TouchableHighlight>

            </View>
          </ScrollView>
        </View>
        
      </View>
    )
  }

}
