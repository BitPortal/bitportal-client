import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableHighlight
} from 'react-native'
import FastImage from 'react-native-fast-image'

export const TextField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  fieldName,
  placeholder,
  secureTextEntry,
  separator,
  change,
  showClearButton
}) => (
  <View style={{ width: '100%', height: 86, paddingLeft: 16, paddingRight: 16 }}>
    <Text style={{ fontSize: 12, width: '100%', height: 16, marginBottom: 2, color: (touched && error) ? '#FF5722' : 'rgba(0,0,0,0.54)' }}>{label}</Text>
    <TextInput
      style={{
        fontSize: 16,
        padding: 0,
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: (showClearButton && active) ? 20 : 0
      }}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      keyboardType="default"
      secureTextEntry={secureTextEntry}
      {...restInput}
    />
    <View style={{ height: (touched && error) ? 2 : 1, backgroundColor: (touched && error) ? '#FF5722' : 'rgba(0,0,0,0.12)', position: 'absolute', left: 16, right: 16, top: 53 }} />
    {showClearButton && active && <View style={{ height: 38, position: 'absolute', right: 11, top: 18, width: 24, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear_android.png')}
          style={{ width: 22, height: 22 }}
        />
      </TouchableHighlight>
    </View>}
    {touched && error && active && <Text style={{ fontSize: 12, width: '100%', color: 'rgba(0,0,0,0.38)', paddingTop: 6 }}>{error}</Text>}
  </View>
)

export const TextArea = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  fieldName,
  placeholder,
  secureTextEntry,
  separator,
  change,
  showClearButton,
  numberOfLines,
  rightComponent
}) => (
  <View style={{ width: '100%', height: 118, paddingLeft: 16, paddingRight: 16 }}>
    <Text style={{ fontSize: 12, width: '100%', height: 16, marginBottom: 2, color: (touched && error) ? '#FF5722' : 'rgba(0,0,0,0.54)' }}>{label}</Text>
    <TextInput
      style={{
        fontSize: 16,
        padding: 0,
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: (showClearButton && active) ? 48 : 30,
        maxHeight: 69
      }}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      keyboardType="default"
      numberOfLines={3}
      multiline={true}
      secureTextEntry={secureTextEntry}
      {...restInput}
    />
    <View style={{ height: (touched && error) ? 2 : 1, backgroundColor: (touched && error) ? '#FF5722' : 'rgba(0,0,0,0.12)', position: 'absolute', left: 16, right: 16, top: 85 }} />
    {(showClearButton && active) && <View style={{ height: 38, position: 'absolute', right: 39, top: 34, width: 24, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear_android.png')}
          style={{ width: 22, height: 22 }}
        />
      </TouchableHighlight>
    </View>}
    {rightComponent}
    {touched && error && active && <Text style={{ fontSize: 12, width: '100%', color: 'rgba(0,0,0,0.38)', paddingTop: 6 }}>{error}</Text>}
  </View>
)
