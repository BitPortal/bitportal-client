import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardType, ReturnKeyType } from 'react-native'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { noop } from 'utils'
import Colors from 'resources/colors'
import Tips from 'components/Tips'
import ModalDropdown from 'react-native-modal-dropdown'

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

interface FieldErrorProps {
  tips?: JSX.Element | string
}

interface TextFieldProps {
  input: {
    onChange(text: string): void
  }
  meta: {
    touched: boolean
    error: string
  }
  label?: JSX.Element | string
  keyboardType?: KeyboardType
  leftContent?: JSX.Element | string
  rightContent?: JSX.Element | string
  tips?: JSX.Element | string
  info?: JSX.Element | string
  placeholder?: string
  returnKeyType?: ReturnKeyType
  onSubmitEditing?: any
  value?: string
  editable?: boolean
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

interface SearchContainer {
  style?: React.CSSProperties
}

export const FormContainer: React.SFC = ({ children }) => <View style={styles.formContainer}>{children}</View>

export const FormContainerAutoWidth: React.SFC = ({ children }) => (
  <View style={styles.FormContainerAutoWidth}>{children}</View>
)

export const SearchContainer: React.SFC<SearchContainer> = ({ children, style }) => (
  <View style={[styles.searchContainer, style]}>{children}</View>
)

export const FieldItem: React.SFC = ({ children }) => <View style={styles.fieldItem}>{children}</View>

export const FieldInput: React.SFC<FieldInputProps> = ({ children, rightContent, leftContent, style }) => (
  <View style={[styles.fieldInput, style]}>
    {leftContent && <View>{leftContent}</View>}
    {children}
    {rightContent && <View>{rightContent}</View>}
  </View>
)

const SearchFieldInput: React.SFC<FieldInputProps> = ({ children, rightContent, leftContent, style }) => (
  <View style={[styles.searchFieldInput, style]}>
    {leftContent && <View>{leftContent}</View>}
    {children}
    {rightContent && <View>{rightContent}</View>}
  </View>
)

export const FieldInfo: React.SFC<FieldInfoProps> = ({ children, style }) => (
  <View style={[styles.fieldInfo, style]}>{children}</View>
)

export const FieldError: React.SFC<FieldErrorProps> = ({ children, tips }) => (
  <View>
    <View style={[styles.fieldError, { paddingRight: 10 }]}>
      <Text style={styles.text12}>{children}</Text>
      {tips && <Tips tips={tips} />}
    </View>
    <View style={styles.triangle} />
  </View>
)

export const TextField: React.SFC<TextFieldProps> = ({
  input: { onChange, ...restInput },
  meta: { touched, error },
  label,
  keyboardType,
  rightContent,
  tips,
  extraTips,
  info,
  placeholder,
  value,
  editable
}) => (
  <FieldItem>
    {touched && error && <FieldError tips={tips}>{touched && error}</FieldError>}
    <FieldInfo>
      {!(touched && error) && (
        <View style={styles.between}>
          {label && <Text style={styles.label}>{label}</Text>}
          {tips && <Tips tips={tips} />}
        </View>
      )}
      {info && <View style={styles.info}>{info}</View>}
    </FieldInfo>
    <FieldInput style={touched && error && styles.errorBorder} rightContent={rightContent}>
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
        value={value}
        editable={editable}
      />
    </FieldInput>
    {extraTips && <Text style={[styles.text12, { alignSelf: 'flex-end', marginTop: 4 }]}>{extraTips}</Text>}
  </FieldItem>
)

export const SearchField: React.SFC<TextFieldProps> = ({
  input: { onChange, ...restInput },
  keyboardType,
  leftContent,
  returnKeyType,
  onSubmitEditing,
  placeholder
}) => (
  <FieldItem>
    <SearchFieldInput leftContent={leftContent}>
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
        returnKeyType={returnKeyType || 'done'}
        onSubmitEditing={onSubmitEditing}
        {...restInput}
      />
    </SearchFieldInput>
  </FieldItem>
)

export const TextAreaField: React.SFC<TextFieldProps> = ({
  input: { onChange, ...restInput },
  meta: { touched, error },
  label,
  tips,
  placeholder,
  value,
  editable
}) => (
  <FieldItem>
    {touched && error && <FieldError tips={tips}>{touched && error}</FieldError>}
    <FieldInfo>
      {!(touched && error) && (
        <View style={styles.between}>
          {label && <Text style={styles.label}>{label}</Text>}
          {tips && <Tips tips={tips} />}
        </View>
      )}
    </FieldInfo>
    <FieldInput style={touched && error && styles.errorBorder}>
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
        value={value}
        editable={editable}
      />
    </FieldInput>
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
    {touched && error && <FieldError tips={tips}>{touched && error}</FieldError>}
    <FieldInfo>
      {!(touched && error) && (
        <View style={styles.between}>
          {label && <Text style={styles.label}>{label}</Text>}
          {tips && <Tips tips={tips} />}
        </View>
      )}
      {info && <View>{info}</View>}
    </FieldInfo>
    <FieldInput style={touched && error && styles.errorBorder} rightContent={rightContent}>
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
  </FieldItem>
)

export const SubmitButton: React.SFC<SubmitButtonProps> = ({ disabled, loading, onPress, text }) => (
  <FieldItem>
    <TouchableOpacity onPress={!disabled ? onPress : noop} disabled={disabled}>
      <LinearGradientContainer type="right" colors={disabled ? Colors.disabled : null} style={[styles.submitButton]}>
        <Text style={styles.submitButtonText}>{text}</Text>
        {loading && <ActivityIndicator style={styles.indicator} size="small" color="white" />}
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

export const CancelButton: React.SFC<ButtonProps> = ({ onPress, text }) => (
  <FieldItem>
    <TouchableOpacity onPress={onPress} style={styles.cancelButton}>
      <Text style={styles.submitButtonText}>{text}</Text>
    </TouchableOpacity>
  </FieldItem>
)

export const Dropdown = ({ touched, error, label, tips, info, options }) => (
  <FieldItem>
    <FieldInfo>
      {!(touched && error) && (
        <View style={styles.between}>
          {label && <Text style={styles.label}>{label}</Text>}
          {tips && <Tips tips={tips} />}
        </View>
      )}
      {info && <View>{info}</View>}
    </FieldInfo>
    {/* <View style={styles.input}> */}
    <FieldInput>
      <ModalDropdown
        style={styles.dropdownBox}
        textStyle={[styles.input]}
        dropdownTextStyle={styles.dropdownMenuItem}
        dropdownStyle={styles.dropdownMenu}
        options={options}
        renderButtonText={() => <Text>testing</Text>}
      />
    </FieldInput>

    {/* </View> */}
  </FieldItem>
)
