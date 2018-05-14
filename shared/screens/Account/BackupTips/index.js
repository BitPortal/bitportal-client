/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TouchableOpacity, TextInput, TouchableHighlight } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class BackupTips extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  goToBackup = () => {
    this.props.navigator.push({
      screen: 'BitPortal.Backup'
    })
  } 

  goToTutorials = () => {

  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.goBack()} />}
          title="Backup"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.content, { alignItems: 'center' }]}>

              <View style={{ marginVertical: 20 }}>
                <Ionicons name="ios-checkmark-circle" size={100} color={Colors.textColor_89_185_226} />
              </View>

              <Text style={styles.text14}>The final step: </Text>
              <Text style={styles.text14}>Back up your account now!</Text>
      
              <View style={{ marginTop: 20 }}>
               <Text style={[styles.text14, { color: Colors.textColor_181_181_181 }]}>
                 Backup account: Export "mnemonics" and copy it to a safe place, never save it on the web. Then try to transfer and transfer the small assets to start using.
               </Text>
              </View>

              <TouchableHighlight 
                onPress={() =>  this.goToBackup()} 
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, { marginTop: 25, backgroundColor: Colors.textColor_89_185_226 }]}
              >
                <Text style={styles.text14}> 
                  Backup
                </Text>
              </TouchableHighlight>

              <TouchableOpacity 
                onPress={() => this.goToTutorials()} 
                style={[styles.btn, styles.center, { marginTop: 15}]}
              >
                <Text style={[styles.text14, { color: Colors.textColor_89_185_226 }]}> 
                  View Backup Detailed Tutorials
                </Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </View>

      </View>
    )
  }

}
