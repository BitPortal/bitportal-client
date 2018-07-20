
import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'

const styles = StyleSheet.create({
  inputItem: {
    width: SCREEN_WIDTH - 64,
    minHeight: 44
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_89_185_226
  },
  inputContainer: {
    width: SCREEN_WIDTH - 64,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  input: {
    flex: 1,
    marginRight: 10,
    height: 40,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14)
  }
})

class InputItem extends Component {
  static defaultProps = {
    title: '',
    placeholder: '',
    isContentVaild: true,
    secureTextEntry: false
  }

  state = {
    value: ''
  }

  onChangeText = (text) => {
    const { textFilter } = this.props
    const newText = textFilter ? textFilter(text) : text
    // onChangeText && onChangeText(newText)
    this.setState({ value: newText })
  }

  render() {
    const { title, placeholder, isContentVaild, TipsComponent, secureTextEntry, extraStyle, ...extraProps } = this.props
    const { value } = this.state
    return (
      <View style={[styles.inputItem, { ...extraStyle }]}>
        <Text style={[styles.text14, { marginLeft: -4 }]}> {title} </Text>
        <View style={[styles.inputContainer, { borderBottomColor: !isContentVaild ? Colors.textColor_255_98_92 : Colors.textColor_181_181_181 }]}>
          <TextInput
            {...extraProps}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            style={styles.input}
            selectionColor={Colors.textColor_181_181_181}
            keyboardAppearance={Colors.keyboardTheme}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={Colors.textColor_181_181_181}
            onChangeText={e => this.onChangeText(e)}
            value={value}
          />
          { TipsComponent && <TipsComponent /> }
        </View>
      </View>
    )
  }
}

export default InputItem
