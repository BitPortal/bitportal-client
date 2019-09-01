import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, Image, TouchableHighlight, TouchableOpacity, Animated, Easing, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import urlParse from 'url-parse'
import { walletIcons } from 'resources/images'
import { transfromUrlText } from 'utils'

@connect(
  state => ({ ui: state.ui })
)

export default class BrowserAddressBar extends Component {
  state = {
    value: this.props.url,
    editing: false,
    selectTextOnFocus: true,
    cancelTextWidth: 48,
    textInputOpacity: new Animated.Value(0),
    addressTextOpacity: new Animated.Value(1),
    showTextInput: false,
    showAddressText: true,
    cancelTextRight: new Animated.Value(-48 - 16),
    containerWidth: new Animated.Value(Dimensions.get('window').width - 16),
    cancelTextOpacity: new Animated.Value(0),
    textInputLeft: new Animated.Value((48 + 16) / 2)
  }

  addressBarUpdated = (text) => {
    this.setState({ value: text, selectTextOnFocus: false })
  }

  addressBarCleared = (text) => {
    this.setState({ value: '' })
  }

  clearText = () => {
    this.setState({ value: '' })
  }

  parseUrl = (data) => {
    try {
      if (data) {
        const url = urlParse(data)
        const hostname = url.hostname
        return hostname.indexOf('www.') === 0 ? hostname.slice(4) : hostname
      }
    } catch(error) {
      return ''
    }

    return ''
  }

  isHttps = (data) => {
    try {
      if (data) {
        const url = urlParse(data)
        const protocol = url.protocol
        return protocol === 'https:'
      }
    } catch(error) {
      return false
    }

    return false
  }

  startEditing = () => {
    setTimeout(() => {
      this.setState({ showTextInput: true, value: this.props.url })
      Animated.parallel([
        Animated.timing(this.state.addressTextOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.quad)
        }),
        Animated.timing(this.state.textInputOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.cubic)
        }),
        Animated.timing(this.state.textInputLeft, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.cubic)
        }),
        Animated.timing(this.state.containerWidth, {
          toValue: Dimensions.get('window').width - 24 - this.state.cancelTextWidth,
          duration: 500,
          easing: Easing.inOut(Easing.cubic)
        }),
        Animated.timing(this.state.cancelTextRight, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.cubic)
        }),
        Animated.timing(this.state.cancelTextOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.cubic)
        })
      ]).start(() => {
        this.setState({ showAddressText: false })
      })
    })
  }

  cancelEditing = () => {
    setTimeout(() => {
      Keyboard.dismiss()
      this.setState({ showAddressText: true }, () => {
        Animated.parallel([
          Animated.timing(this.state.textInputOpacity, {
            toValue: 0,
            duration: 200,
            easing: Easing.inOut(Easing.cubic)
          }),
          Animated.timing(this.state.textInputLeft, {
            toValue: (this.state.cancelTextWidth + 16) / 2,
            duration: 300,
            easing: Easing.inOut(Easing.cubic)
          }),
          Animated.timing(this.state.addressTextOpacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.cubic)
          }),
          Animated.timing(this.state.containerWidth, {
            toValue: Dimensions.get('window').width - 16,
            duration: 300,
            easing: Easing.inOut(Easing.cubic)
          }),
          Animated.timing(this.state.cancelTextRight, {
            toValue: -this.state.cancelTextWidth - 16,
            duration: 300,
            easing: Easing.inOut(Easing.cubic)
          }),
          Animated.timing(this.state.cancelTextOpacity, {
            toValue: 0,
            duration: 300,
            easing: Easing.inOut(Easing.cubic)
          })
        ]).start(() => {
          this.setState({ selectTextOnFocus: true, showTextInput: false })
        })
      })
    })
  }

  onLayout = (event) => {
    const layout = event.nativeEvent.layout

    if (this.state.cancelTextWidth !== layout.width) {
      this.setState({ cancelTextWidth: layout.width })
      Animated.parallel([
        Animated.timing(this.state.cancelTextRight, {
          toValue: -this.state.cancelTextWidth - 16,
          duration: 5,
          easing: Easing.inOut(Easing.quad)
        }),
        Animated.timing(this.state.textInputLeft, {
          toValue: (this.state.cancelTextWidth + 16) / 2,
          duration: 5,
          easing: Easing.inOut(Easing.quad)
        })
      ]).start()
    }
  }

  close = () => {
    if (this.props.close) {
      this.props.close()
    }
  }

  loadPage = () => {
    this.cancelEditing()

    if (this.props.loadPage && this.state.value) {
      const url = transfromUrlText(this.state.value)
      this.props.loadPage(url)
    }
  }

  render() {
    const { chain } = this.props

    return (
      <View style={{ width: Dimensions.get('window').width, height: 52, padding: 8, borderBottomWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}>
        <Animated.View style={{ width: this.state.containerWidth, height: '100%', borderRadius: 10, paddingHorizontal: 8, overflow: 'hidden', backgroundColor: 'rgba(142,142,149,0.12)', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
          {!!this.state.showTextInput && <Animated.View style={{ height: '100%', alignItems: 'flex-start', justifyContent: 'center', opacity: this.state.textInputOpacity, position: 'absolute', top: 0, left: 0, right: 0, left: this.state.textInputLeft }}>
            <TextInput
              ref={(e) => { this.textInput = e }}
              style={{ fontSize: 16, width: '100%', paddingLeft: 8 }}
              value={this.state.value}
              autoFocus={true}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="请输入网址"
              onChangeText={this.addressBarUpdated}
              keyboardType="default"
              clearButtonMode="while-editing"
              selectTextOnFocus={this.state.selectTextOnFocus}
              onSubmitEditing={this.loadPage}
            />
          </Animated.View>}

          {!!this.state.showAddressText &&
           <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', opacity: this.state.addressTextOpacity }}>
             <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%' }} activeOpacity={1} onPress={!this.state.showTextInput ? this.startEditing : () => {}}>
               <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, flexDirection: 'row' }}>
                 {this.isHttps(this.props.url) && <Image source={require('resources/images/secure_address.png')} style={{ width: 16, height: 16, marginRight: 4 }} />}
                 <Text style={{ fontSize: 16 }} ellipsizeMode="tail" numberOfLines={1}>{this.parseUrl(this.props.url)}</Text>

                 <TouchableOpacity underlayColor="rgba(255,255,255,0)" style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }} activeOpacity={0.42} onPress={this.close}>
                   <Image
                     source={require('resources/images/nav_close_black.png')}
                     style={{ width: 24, height: 24 }}
                   />
                 </TouchableOpacity>
                 {!!chain && <TouchableOpacity underlayColor="rgba(255,255,255,0)" style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, right: 0 }} activeOpacity={0.42} onPress={() => {}}>
                   <Image
                     source={walletIcons[chain.toLowerCase()]}
                     style={{ width: 28, height: 28 }}
                   />
                 </TouchableOpacity>}
               </View>
             </TouchableHighlight>
           </Animated.View>
          }
        </Animated.View>
        <Animated.View style={{ height: 52, width: 16 + this.state.cancelTextWidth, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: this.state.cancelTextRight, top: 0, opacity: this.state.cancelTextOpacity, zIndex: 2 }}>
          <TouchableOpacity underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={this.cancelEditing}>
          <Text
            style={{ fontSize: 17, color: '#007AFF' }}
            onLayout={this.onLayout}
          >
            取消
          </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}
