import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, Image, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'

@connect(
  state => ({
    ui: state.ui
  })
)

export class SearchBarBackground extends Component {
  render() {
    return (
      <View style={{ width: Dimensions.get('window').width, height: 64, padding: 8, backgroundColor: '#673AB7' }}>
        <View style={{ width: '100%', height: '100%', borderRadius: 4, elevation: 2, backgroundColor: 'white' }} />
      </View>
    )
  }
}

export default class SearchBar extends Component {
  state = { value: '' }

  searchBarUpdated = (text) => {
    this.setState({ value: text })
    if (this.props.searchBarUpdated) {
      this.props.searchBarUpdated({ text })
    }
  }

  searchBarCleared = (text) => {
    this.setState({ value: '' })
    if (this.props.searchBarCleared) {
      this.props.searchBarCleared()
    }
  }

  render() {
    const { hasSearchResult, placeholder, onSubmit } = this.props

    return (
      <View style={{ width: Dimensions.get('window').width, height: hasSearchResult ? 56 : 64, padding: 8, paddingBottom: hasSearchResult ? 0 : 8 }}>
        <View style={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: 4, borderBottomLeftRadius: hasSearchResult ? 0 : 4, borderBottomRightRadius: hasSearchResult ? 0 : 4, flexDirection: 'row' }}>
          <View style={{ height: '100%', width: 64 }}>
            <TouchableNativeFeedback onPress={this.props.onBackPress} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
              <View style={{ width: 30, height: 30, borderRadius: 15, position: 'absolute', left: 13, top: 9, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('resources/images/arrow_back_android.png')} style={{ width: 24, height: 24 }} />
              </View>
            </TouchableNativeFeedback>
          </View>
          <TextInput
            style={{
              fontSize: 16,
              width: Dimensions.get('window').width - 64
            }}
            value={this.state.value}
            autoFocus={true}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={placeholder || gt('search')}
            onChangeText={this.searchBarUpdated}
            keyboardType="default"
            onSubmitEditing={onSubmit ? onSubmit : () => {}}
          />
          {!!this.state.value && <TouchableNativeFeedback onPress={this.searchBarCleared} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
            <View style={{ width: 30, height: 30, borderRadius: 15, position: 'absolute', right: 13, top: 9, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('resources/images/clear_android.png')} style={{ width: 24, height: 24 }} />
            </View>
          </TouchableNativeFeedback>}
        </View>
        {hasSearchResult && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(0,0,0,0.12)' }}/>}
      </View>
    )
  }
}
