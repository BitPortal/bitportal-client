/* @jsx */
import React, { Component } from 'react'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import { Text, View, TouchableHighlight } from 'react-native'
import Colors from 'resources/colors'
import InputItem from 'components/InputItem'

export default class CreateContact extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    isAccountVaild: true
  }

  changeNickName = () => {

  }

  saveContact = () => {

  }

  render() {
    const { isAccountVaild } = this.state
    return (
      <View style={styles.container}>
        <NavigationBar
          title="New Contact"
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
        />
        <View style={styles.scrollContainer}>
          <View style={styles.content}>

            <InputItem 
              title="Nick Name" 
              placeholder="" 
              onChangeText={(e) => this.changeNickName(e)} 
            />

            <InputItem 
              title="" 
              placeholder="Up to 12 characters" 
              isContentVaild={isAccountVaild}
              textFilter={(text) => (text.substring(0, 12))}
              onChangeText={(e) => this.changeNickName(e)} 
              TipsComponent={() => (
                !isAccountVaild &&
                <Text style={[styles.text14, { color: Colors.textColor_255_98_92 }]}> 
                  Occupied Name 
                </Text>
              )}
            />

            <TouchableHighlight 
              onPress={() =>  this.saveContact()} 
              underlayColor={Colors.textColor_89_185_226}
              style={[styles.btn, styles.center, {
                marginTop: 100,
                backgroundColor: Colors.textColor_89_185_226
              }]}
            >
              <Text style={styles.text14}> 
                Save
              </Text>
            </TouchableHighlight>


          </View>
        </View>
      </View>
    )
  }
}
