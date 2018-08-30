import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { noop } from 'utils'
import Colors from 'resources/colors'
import Tips from 'components/Tips'
import styles from './styles'

export const FormContainer = ({ children }) => (
  <View style={styles.formContainer}>{children}</View>
)

export const SearchContainer = ({ children }) => (
  <View style={styles.searchContainer}>{children}</View>
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

export const SearchFieldInput = ({
  children,
  rightContent,
  leftContent,
  style
}) => (
  <View style={[styles.searchFieldInput, style]}>
    {leftContent && <View>{leftContent}</View>}
    {children}
    {rightContent && <View>{rightContent}</View>}
  </View>
)

export const FieldInfo = ({ children, style }) => (
  <View style={[styles.fieldInfo, style]}>{children}</View>
)

export const FieldError = ({ children }) => (
  <Text style={styles.fieldError}>{children}</Text>
)

export const TextField = ({
  input: { onChange, ...restInput },
  meta: { touched, error },
  label,
  keyboardType,
  rightContent,
  tips,
  info,
  placeholder
}) => (
  <FieldItem>
    <FieldInfo>
      <View style={{ flexDirection: 'row' }}>
        {label && <Text style={styles.label}>{label}</Text>}
        {tips && <Tips tips={tips} />}
      </View>
      {info && <View>{info}</View>}
    </FieldInfo>
    <FieldInput rightContent={rightContent}>
      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        placeholderTextColor={Colors.textColor_107_107_107}
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

export const SearchField = ({
  input: { onChange, ...restInput },
  keyboardType,
  rightContent,
  placeholder
}) => (
  <FieldItem>
    <SearchFieldInput rightContent={rightContent}>
      <TextInput
        style={styles.searchInput}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        placeholderTextColor={Colors.textColor_107_107_107}
        keyboardType={keyboardType || 'default'}
        underlineColorAndroid="transparent"
        selectionColor={Colors.textColor_181_181_181}
        keyboardAppearance={Colors.keyboardTheme}
        onChangeText={onChange}
        {...restInput}
      />
    </SearchFieldInput>
    {/* <FieldError>{touched && error}</FieldError> */}
  </FieldItem>
)

export const TextAreaField = ({
  input: { onChange, ...restInput },
  meta: { touched, error },
  label,
  placeholder
}) => (
  <FieldItem>
    <Text style={styles.label}>{label}</Text>
    <FieldInput style={{ borderBottomWidth: 0 }}>
      <TextInput
        multiline={true}
        numberOfLines={4}
        style={styles.areaInput}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        placeholderTextColor={Colors.textColor_107_107_107}
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

export const PasswordField = ({
  input: { onChange, ...restInput },
  meta: { touched, error },
  label,
  placeholder,
  rightContent,
  tips,
  info
}) => (
  <FieldItem>
    <FieldInfo>
      <View style={{ flexDirection: 'row' }}>
        {label && <Text style={styles.label}>{label}</Text>}
        {tips && <Tips tips={tips} />}
      </View>
      {info && <View>{info}</View>}
    </FieldInfo>
    <FieldInput rightContent={rightContent}>
      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder}
        placeholderTextColor={Colors.textColor_107_107_107}
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
    <TouchableOpacity onPress={!disabled ? onPress : noop} disabled={disabled}>
      <LinearGradientContainer
        type="right"
        colors={disabled ? Colors.disabled : null}
        style={[styles.submitButton]}
      >
        <Text style={styles.submitButtonText}>{text}</Text>
        {loading && (
          <ActivityIndicator
            style={styles.indicator}
            size="small"
            color="white"
          />
        )}
      </LinearGradientContainer>
    </TouchableOpacity>
  </FieldItem>
)

export const Button = ({ onPress, text }) => (
  <FieldItem>
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  </FieldItem>
)
