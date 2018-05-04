/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, TextInput, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'

const styles = StyleSheet.create({
  inputItem: {
    width: SCREEN_WIDTH-64,
    minHeight: 44
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_89_185_226
  },
  inputContainer: {
    width: SCREEN_WIDTH-64,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  input: {
    minWidth: (SCREEN_WIDTH-64)*2/3,
    height: 40,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14)
  }
})

export default class InputItem extends Component {

  state = {
    value: '',
    vaild: true
  }

  textFilter = (text) => {
    if (text === 'meon') {
      this.setState({ vaild: false })
      return 'meon'
    } else {
      this.setState({ vaild: true })
      if (text) return text.substring(0, 12)
      else return ''
    }
  }

  onChangeText = (text) => {
    this.setState({ value: this.textFilter(text) })
    this.props.changeAccountName(this.textFilter(text))
  }

  render() {
    const { title, placeholder } = this.props
    const { value, vaild } = this.state
    return (
      <View style={styles.inputItem}>
        <Text style={styles.text14}> {title} </Text>
        <View style={[styles.inputContainer, { 
            borderBottomColor: !vaild ? Colors.textColor_255_98_92 : Colors.textColor_181_181_181 
          }]
        }>
          <TextInput
            autoCorrect={false}
            underlineColorAndroid="transparent"
            style={styles.input}
            selectionColor={Colors.textColor_181_181_181}
            keyboardAppearance={Colors.keyboardTheme}
            placeholder={placeholder}
            placeholderTextColor={Colors.textColor_181_181_181}
            onChangeText={(e) => this.onChangeText(e)}
            value={value}
          />
          {!vaild && <Text style={[styles.text14, { color: Colors.textColor_255_98_92 }]}> Occupied name </Text>}
        </View>
      </View>
    )
  }

}
  