import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  LayoutAnimation,
  Animated,
  Easing,
  Dimensions,
  TouchableNativeFeedback
} from 'react-native'
import FastImage from 'react-native-fast-image'
import EStyleSheet from 'react-native-extended-stylesheet'

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

export class FilledTextField extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.meta.active !== prevState.active || nextProps.nonEmpty !== prevState.nonEmpty) {
      return {
        active: nextProps.meta.active,
        nonEmpty: nextProps.nonEmpty,
      }
    } else {
      return null
    }
  }

  state = {
    active: false,
    nonEmpty: false,
    labelFontSize: new Animated.Value((this.props.meta.active || this.props.nonEmpty || this.props.selectable || (typeof this.props.editable === 'boolean' && !this.props.editable)) ? 12 : 16),
    labelTop: new Animated.Value((this.props.meta.active || this.props.nonEmpty || this.props.selectable || (typeof this.props.editable === 'boolean' && !this.props.editable)) ? 6 : 16),
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.nonEmpty !== prevState.active) || (this.state.nonEmpty !== this.state.active)) {
      if (((prevState.nonEmpty || prevState.active) !== (this.state.nonEmpty || this.state.active))) {
        if (this.state.nonEmpty || this.state.active) {
          Animated.parallel([
            Animated.timing(this.state.labelFontSize, {
              toValue: 12,
              duration: 300,
              easing: Easing.inOut(Easing.quad)
            }),
            Animated.timing(this.state.labelTop, {
              toValue: 6,
              duration: 300,
              easing: Easing.inOut(Easing.quad)
            })
          ]).start()
        } else {
          Animated.parallel([
            Animated.timing(this.state.labelFontSize, {
              toValue: 16,
              duration: 300,
              easing: Easing.inOut(Easing.quad)
            }),
            Animated.timing(this.state.labelTop, {
              toValue: 16,
              duration: 300,
              easing: Easing.inOut(Easing.quad)
            })
          ]).start()
        }
      }
    }
  }

  render() {
    const {
      input: { onChange, ...restInput },
      meta: { touched, error, active },
      label,
      switchLabel,
      fieldName,
      placeholder,
      secureTextEntry,
      separator,
      change,
      nonEmpty,
      selectable,
      onSwitch,
      editable,
      keyboardType
    } = this.props

    return (
      <View style={{ width: '100%', height: 96, paddingLeft: 16, paddingRight: 16, flexDirection: 'row', alignItems: 'flex-start' }}>
        {!!selectable &&
         <View style={{ height: 96, marginRight: 16, width: (Dimensions.get('window').width - 32) * 0.4 - 8 }}>
           <View
             style={{
               backgroundColor: '#f5f5f5',
               borderTopRightRadius: 4,
               borderTopLeftRadius: 4,
               height: 56,
               overflow: 'hidden',
               alignItems: 'center',
               justifyContent: 'center'
             }}
           >
             <TouchableNativeFeedback onPress={onSwitch} background={TouchableNativeFeedback.SelectableBackground()}>
               <View
                 style={{
                   position: 'absolute',
                   top: 0,
                   left: 0,
                   right: 0,
                   bottom: 0,
                   borderColor: 'rgba(0,0,0,0.42)',
                   borderBottomWidth: 1,
                   paddingTop: 16,
                   paddingHorizontal: 16,
                   paddingBottom: 6,
                 }}
               >
                 <Text style={{ color: 'rgba(0,0,0,0.6)', fontSize: 16 }}>{switchLabel}</Text>
                 <FastImage source={require('resources/images/dropdown_android.png')} style={{ width: 24, height: 24, position: 'absolute', right: 12, top: 16 }} />
               </View>
             </TouchableNativeFeedback>
           </View>
         </View>}
        <View style={selectable ? [{ height: 96, width: (Dimensions.get('window').width - 32) * 0.6 - 8 }] : ({ height: 96, width: '100%' })}>
          <View
          style={{
            backgroundColor: '#f5f5f5',
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4,
            height: 56,
            overflow: 'hidden'
          }}
        >
            {label && <Animated.Text
            style={{
              position: 'absolute',
              fontSize: this.state.labelFontSize,
              width: '100%',
              color: (touched && error && nonEmpty) ? '#d32f2f' : (active ? '#673AB7' : 'rgba(0,0,0,0.6)'),
              top: this.state.labelTop,
              left: 16
            }}
          >
            {label}
          </Animated.Text>}
          <TextInput
            style={{
              fontSize: 16,
              padding: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: 20,
              paddingHorizontal: 16,
              paddingBottom: 6,
              paddingRight: (nonEmpty && active) ? 36 : 16,
              borderColor: (touched && error && nonEmpty) ? '#d32f2f' : (active ? '#673AB7' : 'rgba(0,0,0,0.42)'),
              borderBottomWidth: (active ? 2 : 1),
            }}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={onChange}
            keyboardType={keyboardType || 'default'}
            secureTextEntry={secureTextEntry}
            editable={typeof editable === 'boolean' ? editable : true}
            {...restInput}
          />
          {nonEmpty && active && <View style={{ height: 56, position: 'absolute', right: 10, top: 0, width: 24, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
              <FastImage
                source={require('resources/images/clear_circle_android.png')}
                style={{ width: 24, height: 24 }}
              />
            </TouchableHighlight>
          </View>}
        </View>
        {!(touched && error && nonEmpty) && placeholder && <Text style={{ fontSize: 12, width: '100%', color: 'rgba(0,0,0,0.54)', paddingTop: 6, paddingLeft: 16 }}>{placeholder}</Text>}
        {touched && error && nonEmpty && <Text style={{ fontSize: 12, width: '100%', color: '#d32f2f', paddingTop: 6, paddingLeft: 16 }}>{error}</Text>}
        </View>
      </View>
    )
  }
}

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

export class FilledTextArea extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.meta.active !== prevState.active || nextProps.nonEmpty !== prevState.nonEmpty) {
      return {
        active: nextProps.meta.active,
        nonEmpty: nextProps.nonEmpty,
      }
    } else {
      return null
    }
  }

  state = {
    active: false,
    nonEmpty: false,
    labelFontSize: new Animated.Value(16),
    labelTop: new Animated.Value(16)
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.nonEmpty !== prevState.active) || (this.state.nonEmpty !== this.state.active)) {
      if (((prevState.nonEmpty || prevState.active) !== (this.state.nonEmpty || this.state.active))) {
        if (this.state.nonEmpty || this.state.active) {
          Animated.parallel([
            Animated.timing(this.state.labelFontSize, {
              toValue: 12,
              duration: 300,
              easing: Easing.inOut(Easing.quad)
            }),
            Animated.timing(this.state.labelTop, {
              toValue: 6,
              duration: 300,
              easing: Easing.inOut(Easing.quad)
            })
          ]).start()
        } else {
          Animated.parallel([
            Animated.timing(this.state.labelFontSize, {
              toValue: 16,
              duration: 300,
              easing: Easing.inOut(Easing.quad)
            }),
            Animated.timing(this.state.labelTop, {
              toValue: 16,
              duration: 300,
              easing: Easing.inOut(Easing.quad)
            })
          ]).start()
        }
      }
    }
  }

  render() {
    const {
      input: { onChange, ...restInput },
      meta: { touched, error, active },
      label,
      fieldName,
      placeholder,
      secureTextEntry,
      separator,
      change,
      nonEmpty,
      trailingIcon
    } = this.props

    return (
      <View style={{ width: '100%', height: 130, paddingLeft: 16, paddingRight: 16 }}>
        <View
          style={{
            backgroundColor: '#f5f5f5',
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4,
            height: 90,
            overflow: 'hidden'
          }}
        >
          <Animated.Text
            style={{
              position: 'absolute',
              fontSize: this.state.labelFontSize,
              width: '100%',
              color: (touched && error && nonEmpty) ? '#d32f2f' : (active ? '#673AB7' : 'rgba(0,0,0,0.6)'),
              top: this.state.labelTop,
              left: 16
            }}
          >
            {label}
          </Animated.Text>
          <TextInput
            style={{
              fontSize: 16,
              padding: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: 24,
              paddingHorizontal: 16,
              paddingBottom: 6,
              paddingRight: (nonEmpty && active) ? (trailingIcon ? 64 : 34) : (trailingIcon ? 37 : 16),
              borderColor: (touched && error && nonEmpty) ? '#d32f2f' : (active ? '#673AB7' : 'rgba(0,0,0,0.42)'),
              borderBottomWidth: (active ? 2 : 1),
            }}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={onChange}
            keyboardType="default"
            numberOfLines={3}
            multiline={true}
            secureTextEntry={secureTextEntry}
            {...restInput}
          />
          {nonEmpty && active && <View style={{ height: 36, position: 'absolute', right: trailingIcon ? 37 : 7, top: 29, width: 30, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
              <FastImage
                source={require('resources/images/clear_circle_android.png')}
                style={{ width: 24, height: 24 }}
              />
            </TouchableHighlight>
          </View>}
          {trailingIcon && <View style={{ height: 36, position: 'absolute', right: 7, top: 29, width: 30, alignItems: 'center', justifyContent: 'center' }}>
            {trailingIcon}
          </View>}
        </View>
        {!(touched && error && nonEmpty) && placeholder && <Text style={{ fontSize: 12, width: '100%', color: 'rgba(0,0,0,0.54)', paddingTop: 6, paddingLeft: 16 }}>{placeholder}</Text>}
        {touched && error && nonEmpty && <Text style={{ fontSize: 12, width: '100%', color: '#d32f2f', paddingTop: 6, paddingLeft: 16 }}>{error}</Text>}
      </View>
    )
  }
}


export class OutlinedTextField extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.meta.active !== prevState.active || nextProps.nonEmpty !== prevState.nonEmpty) {
      return {
        active: nextProps.meta.active,
        nonEmpty: nextProps.nonEmpty,
      }
    } else {
      return null
    }
  }

  state = {
    active: false,
    nonEmpty: false,
    labelFontSize: new Animated.Value((this.props.meta.active || this.props.nonEmpty) ? 12 : 16),
    labelTop: new Animated.Value((this.props.meta.active || this.props.nonEmpty) ? -7 : 16),
    labelZIndex: new Animated.Value((this.props.meta.active || this.props.nonEmpty) ? 1 : 0),
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.nonEmpty !== prevState.active) || (this.state.nonEmpty !== this.state.active)) {
      if (((prevState.nonEmpty || prevState.active) !== (this.state.nonEmpty || this.state.active))) {
        if (this.state.nonEmpty || this.state.active) {
          Animated.sequence([
            Animated.timing(this.state.labelZIndex, {
              toValue: 1,
              duration: 0
            }),
            Animated.parallel([
              Animated.timing(this.state.labelFontSize, {
                toValue: 12,
                duration: 300,
                easing: Easing.inOut(Easing.quad)
              }),
              Animated.timing(this.state.labelTop, {
                toValue: -7,
                duration: 300,
                easing: Easing.inOut(Easing.quad)
              })
            ])
          ]).start()
        } else {
          Animated.sequence([
            Animated.parallel([
              Animated.timing(this.state.labelFontSize, {
                toValue: 16,
                duration: 300,
                easing: Easing.inOut(Easing.quad)
              }),
              Animated.timing(this.state.labelTop, {
                toValue: 16,
                duration: 300,
                easing: Easing.inOut(Easing.quad)
              })
            ]),
            Animated.timing(this.state.labelZIndex, {
              toValue: 0,
              duration: 0
            })
          ]).start()
        }
      }
    }
  }

  render() {
    const {
      input: { onChange, ...restInput },
      meta: { touched, error, active },
      label,
      fieldName,
      placeholder,
      secureTextEntry,
      separator,
      change,
      nonEmpty
    } = this.props

    return (
      <View style={{ width: '100%', height: 96, paddingLeft: 16, paddingRight: 16 }}>
        <View
          style={{
            borderRadius: 4,
            height: 56
          }}
        >
          <Animated.Text
            style={{
              position: 'absolute',
              fontSize: this.state.labelFontSize,
              color: (touched && error && nonEmpty) ? '#d32f2f' : (active ? '#673AB7' : 'rgba(0,0,0,0.6)'),
              top: this.state.labelTop,
              left: 12,
              backgroundColor: 'white',
              paddingHorizontal: 4,
              zIndex: this.state.labelZIndex
            }}
          >
            {label}
          </Animated.Text>
          <TextInput
            style={{
              fontSize: 16,
              padding: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: 12,
              paddingHorizontal: 16,
              paddingBottom: 14,
              paddingRight: (nonEmpty && active) ? 36 : 16,
              borderRadius: 4,
              borderColor: (touched && error && nonEmpty) ? '#d32f2f' : (active ? '#673AB7' : 'rgba(0,0,0,0.42)'),
              borderWidth: (active ? 2 : 1),
            }}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={onChange}
            keyboardType="default"
            secureTextEntry={secureTextEntry}
            {...restInput}
          />
          {nonEmpty && active && <View style={{ height: 56, position: 'absolute', right: 10, top: 0, width: 24, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
              <FastImage
                source={require('resources/images/clear_circle_android.png')}
                style={{ width: 24, height: 24 }}
              />
            </TouchableHighlight>
          </View>}
        </View>
        {!(touched && error && nonEmpty) && placeholder && <Text style={{ fontSize: 12, width: '100%', color: 'rgba(0,0,0,0.54)', paddingTop: 6, paddingLeft: 16 }}>{placeholder}</Text>}
        {touched && error && nonEmpty && <Text style={{ fontSize: 12, width: '100%', color: '#d32f2f', paddingTop: 6, paddingLeft: 16 }}>{error}</Text>}
      </View>
    )
  }
}

export class OutlinedTextArea extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.meta.active !== prevState.active || nextProps.nonEmpty !== prevState.nonEmpty) {
      return {
        active: nextProps.meta.active,
        nonEmpty: nextProps.nonEmpty,
      }
    } else {
      return null
    }
  }

  state = {
    active: false,
    nonEmpty: false,
    labelFontSize: new Animated.Value((this.props.meta.active || this.props.nonEmpty) ? 12 : 16),
    labelTop: new Animated.Value((this.props.meta.active || this.props.nonEmpty) ? -7 : 16),
    labelZIndex: new Animated.Value((this.props.meta.active || this.props.nonEmpty) ? 1 : 0),
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.nonEmpty !== prevState.active) || (this.state.nonEmpty !== this.state.active)) {
      if (((prevState.nonEmpty || prevState.active) !== (this.state.nonEmpty || this.state.active))) {
        if (this.state.nonEmpty || this.state.active) {
          Animated.sequence([
            Animated.timing(this.state.labelZIndex, {
              toValue: 1,
              duration: 0
            }),
            Animated.parallel([
              Animated.timing(this.state.labelFontSize, {
                toValue: 12,
                duration: 300,
                easing: Easing.inOut(Easing.quad)
              }),
              Animated.timing(this.state.labelTop, {
                toValue: -7,
                duration: 300,
                easing: Easing.inOut(Easing.quad)
              })
            ])
          ]).start()
        } else {
          Animated.sequence([
            Animated.parallel([
              Animated.timing(this.state.labelFontSize, {
                toValue: 16,
                duration: 300,
                easing: Easing.inOut(Easing.quad)
              }),
              Animated.timing(this.state.labelTop, {
                toValue: 16,
                duration: 300,
                easing: Easing.inOut(Easing.quad)
              })
            ]),
            Animated.timing(this.state.labelZIndex, {
              toValue: 0,
              duration: 0
            })
          ]).start()
        }
      }
    }
  }

  render() {
    const {
      input: { onChange, ...restInput },
      meta: { touched, error, active },
      label,
      fieldName,
      placeholder,
      secureTextEntry,
      separator,
      change,
      nonEmpty,
      trailingIcon
    } = this.props

    return (
      <View style={{ width: '100%', height: 130, paddingLeft: 16, paddingRight: 16 }}>
        <View
          style={{
            borderRadius: 4,
            height: 90
          }}
        >
          <Animated.Text
            style={{
              position: 'absolute',
              fontSize: this.state.labelFontSize,
              color: (touched && error && nonEmpty) ? '#d32f2f' : (active ? '#673AB7' : 'rgba(0,0,0,0.6)'),
              top: this.state.labelTop,
              left: 12,
              backgroundColor: 'white',
              paddingHorizontal: 4,
              zIndex: this.state.labelZIndex
            }}
          >
            {label}
          </Animated.Text>
          <TextInput
            style={{
              fontSize: 16,
              padding: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: 12,
              paddingHorizontal: 16,
              paddingBottom: 14,
              paddingRight: (nonEmpty && active) ? (trailingIcon ? 64 : 34) : (trailingIcon ? 37 : 16),
              borderRadius: 4,
              borderColor: (touched && error && nonEmpty) ? '#d32f2f' : (active ? '#673AB7' : 'rgba(0,0,0,0.42)'),
              borderWidth: (active ? 2 : 1)
            }}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={onChange}
            keyboardType="default"
            numberOfLines={3}
            multiline={true}
            secureTextEntry={secureTextEntry}
            {...restInput}
          />
          {nonEmpty && active && <View style={{ height: 36, position: 'absolute', right: trailingIcon ? 37 : 7, top: 29, width: 30, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
              <FastImage
                source={require('resources/images/clear_circle_android.png')}
                style={{ width: 24, height: 24 }}
              />
            </TouchableHighlight>
          </View>}
          {trailingIcon && <View style={{ height: 36, position: 'absolute', right: 7, top: 29, width: 30, alignItems: 'center', justifyContent: 'center' }}>
            {trailingIcon}
          </View>}
        </View>
        {!(touched && error && nonEmpty) && placeholder && <Text style={{ fontSize: 12, width: '100%', color: 'rgba(0,0,0,0.54)', paddingTop: 6, paddingLeft: 16 }}>{placeholder}</Text>}
        {touched && error && nonEmpty && <Text style={{ fontSize: 12, width: '100%', color: '#d32f2f', paddingTop: 6, paddingLeft: 16 }}>{error}</Text>}
      </View>
    )
  }
}
