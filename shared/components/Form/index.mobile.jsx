/* @jsx */

import React from 'react'
import { View, Text, TextInput, TouchableHighlight } from 'react-native'
import Colors from 'resources/colors'
import styles from './styles'

export const FormContainer = ({ children }) => (
  <View style={styles.formContainer}>{children}</View>
)

export const FieldItem = ({ children }) => (
  <View style={styles.fieldItem}>{children}</View>
)

export const FieldInput = ({ children }) => (
  <View style={styles.fieldInput}>{children}</View>
)

export const FieldError = ({ children }) => (
  <Text style={styles.fieldError}>{children}</Text>
)

export const TextField = ({ input: { onChange, ...restInput }, meta: { touched, error }, label }) => (
  <FieldItem>
    <Text style={styles.text14}>{label}</Text>
    <FieldInput>
      <TextInput style={styles.input} onChangeText={onChange} {...restInput} />
    </FieldInput>
    <FieldError>{touched && error}</FieldError>
  </FieldItem>
)

export const PasswordField = ({ input: { onChange, ...restInput }, meta: { touched, error }, label }) => (
  <FieldItem>
    <Text style={styles.text14}>{label}</Text>
    <FieldInput>
      <TextInput style={styles.input} onChangeText={onChange} {...restInput} secureTextEntry={true} />
    </FieldInput>
    <FieldError>{touched && error}</FieldError>
  </FieldItem>
)

export const SubmitButton = ({ disabled, onPress, text }) => (
  <FieldItem>
    <TouchableHighlight
      onPress={onPress}
      disabled={disabled}
      underlayColor={Colors.textColor_89_185_226}
      style={[styles.submitButton, disabled ? styles.disabled : {}]}
    >
      <Text style={styles.submitButtonText}>{text}</Text>
    </TouchableHighlight>
  </FieldItem>
)
