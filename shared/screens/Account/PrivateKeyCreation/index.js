/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import NavigationBar, { BackButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
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

export default class PrivateKeyCreation extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    isAccountVaild: true,
    viewRef: null,
    showPrivateKey: false,
    privateKey: 'gkdmaglkdskalgkdsl;akgdsamdflk9_**(SF&(*AY*(FSA(*&F(AS89f)))))'
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  changeAccountName = (accountName) => {
    if (accountName == 'meon') this.setState({ isAccountVaild: false })
    else this.setState({ isAccountVaild: true })
  }

  changePrivateKey = () => {

  }

  componentDidMount() {
    this.setState({ viewRef: findNodeHandle(this.viewRef) })
  }

  render() {
    const { isAccountVaild, showPrivateKey } = this.state
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

              <Text style={[styles.text14, { color: Colors.textColor_89_185_226, marginLeft: -1, marginTop: 25, marginBottom: 15 }]}> 
                Private Key 
              </Text>

              <View ref={e => this.viewRef = e} style={[styles.inputContainer]}>
                <TextInput
                  autoCorrect={false}
                  multiline={true}
                  underlineColorAndroid="transparent"
                  style={styles.input}
                  selectionColor={Colors.textColor_181_181_181}
                  keyboardAppearance={Colors.keyboardTheme}
                  placeholder={'gdasfdsafdsafdsafsdafsdfadf...'}
                  placeholderTextColor={Colors.textColor_181_181_181}
                  onChangeText={(e) => this.changePrivateKey(e)}
                  value={this.state.privateKey}
                />
              </View>

              {
                !showPrivateKey &&
                <BlurView
                  style={[styles.inputContainer, { borderWidth: 0, marginTop: -(SCREEN_WIDTH-64)/4 }]}
                  viewRef={this.state.viewRef}
                  blurType="dark"
                  blurAmount={10}
                />
              }

              <TouchableHighlight 
                onPress={() => { this.setState({ showPrivateKey: !this.state.showPrivateKey }) }} 
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
                onPress={() => {}} 
                style={[styles.btn, styles.center, { marginTop: 25}]}
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
