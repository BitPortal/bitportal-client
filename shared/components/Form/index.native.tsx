import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardType
} from 'react-native'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { noop } from 'utils'
import Colors from 'resources/colors'
import Tips from 'components/Tips'
import styles from './styles'

type KeyboardAppearance = 'default' | 'light' | 'dark'

interface FieldInputProps {
  rightContent?: JSX.Element | string
  leftContent?: JSX.Element | string
  style?: React.CSSProperties
}

interface FieldInfoProps {
  style?: React.CSSProperties
}

interface FieldInfoProps {
  style?: React.CSSProperties
}

interface TextFieldProps {
  input: {
    onChange(text: string): void
  },
  meta: {
    touched: boolean
    error: string
  },
  label?: JSX.Element | string,
  keyboardType?: KeyboardType,
  rightContent?: JSX.Element | string,
  tips?: JSX.Element | string,
  info?: JSX.Element | string,
  placeholder?: string
}

interface SubmitButtonProps {
  disabled: boolean
  loading: boolean
  text: string
  onPress(): void
}

interface ButtonProps {
  text: string
  onPress(): void
}

export const FormContainer: React.SFC = ({ children }) => (
  <View style={styles.formContainer}>{children}</View>
)

export const SearchContainer: React.SFC = ({ children }) => (
  <View style={styles.searchContainer}>{children}</View>
)

export const FieldItem: React.SFC = ({ children }) => (
  <View style={styles.fieldItem}>{children}</View>
)

export const FieldInput: React.SFC<FieldInputProps> = ({ children, rightContent, leftContent, style }) => (
  <View style={[styles.fieldInput, style]}>
    {leftContent && <View>{leftContent}</View>}
    {children}
    {rightContent && <View>{rightContent}</View>}
  </View>
)

export const SearchFieldInput: React.SFC<FieldInputProps> = ({
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

export const FieldInfo: React.SFC<FieldInfoProps> = ({ children, style }) => (
  <View style={[styles.fieldInfo, style]}>{children}</View>
)

export const FieldError: React.SFC = ({ children }) => (
  <Text style={styles.fieldError}>{children}</Text>
)

export const TextField: React.SFC<TextFieldProps> = ({
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
        keyboardAppearance={Colors.keyboardTheme as KeyboardAppearance}
        onChangeText={onChange}
        {...restInput}
      />
    </FieldInput>
    <FieldError>{touched && error}</FieldError>
  </FieldItem>
)

export const SearchField: React.SFC<TextFieldProps> = ({
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
        keyboardAppearance={Colors.keyboardTheme as KeyboardAppearance}
        onChangeText={onChange}
        {...restInput}
      />
    </SearchFieldInput>
  </FieldItem>
)

export const TextAreaField: React.SFC<TextFieldProps> = ({
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
        keyboardAppearance={Colors.keyboardTheme as KeyboardAppearance}
        onChangeText={onChange}
        {...restInput}
      />
    </FieldInput>
    <FieldError>{touched && error}</FieldError>
  </FieldItem>
)

export const PasswordField: React.SFC<TextFieldProps> = ({
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
        keyboardAppearance={Colors.keyboardTheme as KeyboardAppearance}
        onChangeText={onChange}
        {...restInput}
        secureTextEntry={true}
      />
    </FieldInput>
    <FieldError>{touched && error}</FieldError>
  </FieldItem>
)

export const SubmitButton: React.SFC<SubmitButtonProps> = ({ disabled, loading, onPress, text }) => (
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

export const Button: React.SFC<ButtonProps> = ({ onPress, text }) => (
  <FieldItem>
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  </FieldItem>
)
