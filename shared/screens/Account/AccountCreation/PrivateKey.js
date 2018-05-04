/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, TextInput, StyleSheet, Switch, LayoutAnimation } from 'react-native'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'

const styles = StyleSheet.create({
  inputItem: {
    width: SCREEN_WIDTH-64,
    minHeight: 44,
    marginTop: 30
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  inputContainer: {
    width: SCREEN_WIDTH-64,
    height: SCREEN_WIDTH/2-32,
    flexDirection: 'row',
    marginTop: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.textColor_181_181_181
  },
  input: {
    width: SCREEN_WIDTH-64,
    height: SCREEN_WIDTH/2-32,
    padding: 10,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14)
  },
  switch: {
    width: 50,
    height: 30
  }
})

export default class PrivateKey extends Component {

  state = {
    value: '',
    hasPrivateKey: false
  }

  onChangeText = (text) => {
    this.setState({ value: text })
  }

  onValueChange = (value) => {
    this.setState({ hasPrivateKey: value })
    LayoutAnimation.spring()
  }

  render() {
    const { title, placeholder } = this.props
    const { value, hasPrivateKey } = this.state
    return (
      <View style={styles.inputItem}>
        <View style={[styles.between]}>
          <Text style={styles.text14}> {title} </Text>
          <Switch style={styles.switch} value={hasPrivateKey} onValueChange={(e) => this.onValueChange(e)} />
        </View>
        {
          hasPrivateKey &&
          <View style={[styles.inputContainer]}>
            <TextInput
              autoCorrect={false}
              multiline={true}
              underlineColorAndroid="transparent"
              style={styles.input}
              selectionColor={Colors.textColor_181_181_181}
              keyboardAppearance={Colors.keyboardTheme}
              placeholder={placeholder}
              placeholderTextColor={Colors.textColor_181_181_181}
              onChangeText={(e) => this.onChangeText(e)}
              value={value}
            />
          </View>
        }
      </View>
    )
  }

}
  