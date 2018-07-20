

import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { noop } from 'utils'
import Colors from 'resources/colors'
import Tips from 'components/Tips'
import styles from './styles'

export const FormContainer = ({ children }) => (
  <View style={styles.formContainer}>{children}</View>
)

export const FieldItem = ({ children }) => (
  <View style={styles.fieldItem}>{children}</View>
)

export const FieldInput = ({ children, rightContent, leftContent, style }) => (
  <View style={[styles.fieldInput, style]}>
    {leftContent && <View>{leftContent}</View>}
    {children}
    {rightContent && <View>{rightContent}</View>}
  </View>
)

export const FieldError = ({ children }) => (
  <Text style={styles.fieldError}>{children}</Text>
)

export const TextField = ({ input: { onChange, ...restInput }, meta: { touched, error }, label, keyboardType, rightContent, tips }) => (
  <FieldItem>
    <View style={{ flexDirection: 'row' }}>
      {label && <Text style={styles.text14}>{label}</Text>}
      {tips && <Tips tips={tips} />}
    </View>
    <FieldInput rightContent={rightContent}>
      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType={keyboardType || 'default'}
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

export const TextAreaField = ({ input: { onChange, ...restInput }, meta: { touched, error }, label, placeholder }) => (
  <FieldItem>
    <Text style={styles.text14}>{label}</Text>
    <FieldInput style={{ borderBottomWidth: 0 }}>
      <TextInput
        multiline={true}
        numberOfLines={4}
        style={styles.areaInput}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        placeholderTextColor={Colors.textColor_181_181_181}
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
        autoCapitalize="none"
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

export const SubmitButton = ({ disabled, loading, onPress, text }) => (
  <FieldItem>
    <TouchableOpacity
      onPress={!disabled ? onPress : noop}
      disabled={disabled}
      style={[styles.submitButton, disabled ? styles.disabled : {}]}
    >
      <Text style={styles.submitButtonText}>{text}</Text>
      {loading && <ActivityIndicator style={styles.indicator} size="small" color="white" />}
    </TouchableOpacity>
  </FieldItem>
)

export const Button = ({ onPress, text }) => (
  <FieldItem>
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  </FieldItem>
)
