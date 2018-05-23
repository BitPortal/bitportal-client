/* @jsx */

import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Colors from 'resources/colors'
import styles from './styles'

export const FormContainer = ({ children }) => (
  <View style={styles.formContainer}>{children}</View>
)

export const FieldItem = ({ children }) => (
  <View style={styles.fieldItem}>{children}</View>
)

export const FieldInput = ({ children, rightContent, leftContent }) => (
  <View style={styles.fieldInput}>
    {leftContent && <View>{leftContent}</View>}
    {children}
    {rightContent && <View>{rightContent}</View>}
  </View>
)

export const FieldError = ({ children }) => (
  <Text style={styles.fieldError}>{children}</Text>
)

export const TextField = ({ input: { onChange, ...restInput }, meta: { touched, error }, label }) => (
  <FieldItem>
    <Text style={styles.text14}>{label}</Text>
    <FieldInput>
      <TextInput
        style={styles.input}
        autoCorrect={false}
        underlineColorAndroid="transparent"
        selectionColor={Colors.textColor_181_181_181}
        keyboardAppearance={Colors.keyboardTheme}
        onChangeText={onChange}
        {...restInput}
      />
    </FieldInput>
    <FieldError>{touched && error}</FieldError>
  </FieldItem>
)

export const TextAreaField = ({ input: { onChange, ...restInput }, meta: { touched, error }, label }) => (
  <FieldItem>
    <Text style={styles.text14}>{label}</Text>
    <FieldInput>
      <TextInput
        multiline={true}
        numberOfLines={4}
        style={styles.areaInput}
        autoCorrect={false}
        underlineColorAndroid="transparent"
        selectionColor={Colors.textColor_181_181_181}
        keyboardAppearance={Colors.keyboardTheme}
        onChangeText={onChange}
        {...restInput}
      />
    </FieldInput>
    <FieldError>{touched && error}</FieldError>
  </FieldItem>
)

export const PasswordField = ({ input: { onChange, ...restInput }, meta: { touched, error }, label, rightContent }) => (
  <FieldItem>
    <Text style={styles.text14}>{label}</Text>
    <FieldInput rightContent={rightContent}>
      <TextInput
        style={styles.input}
        autoCorrect={false}
        underlineColorAndroid="transparent"
        selectionColor={Colors.textColor_181_181_181}
        keyboardAppearance={Colors.keyboardTheme}
        onChangeText={onChange}
        {...restInput}
        secureTextEntry={true}
      />
    </FieldInput>
    <FieldError>{touched && error}</FieldError>
  </FieldItem>
)

export const SubmitButton = ({ disabled, onPress, text }) => (
  <FieldItem>
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.submitButton, disabled ? styles.disabled : {}]}
    >
      <Text style={styles.submitButtonText}>{text}</Text>
    </TouchableOpacity>
  </FieldItem>
)
