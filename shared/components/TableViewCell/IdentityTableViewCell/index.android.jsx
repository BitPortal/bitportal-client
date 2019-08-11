import React, { Component } from 'react'
import { View, Text, TouchableHighlight, TouchableNativeFeedback, Image } from 'react-native'
import { Navigation } from 'react-native-navigation'

const images = {
  home: {
    normal: require('resources/images/home_tab.png'),
    active: require('resources/images/home_tab_active.png')
  },
  contact: {
    normal: require('resources/images/contact_tab.png'),
    active: require('resources/images/contact_tab_active.png')
  },
  settings: {
    normal: require('resources/images/settings_tab.png'),
    active: require('resources/images/settings_tab_active.png')
  },
  help: {
    normal: require('resources/images/help_tab.png'),
    active: require('resources/images/help_tab_active.png')
  },
  aboutUs: {
    normal: require('resources/images/aboutus_tab.png'),
    active: require('resources/images/aboutus_tab_active.png')
  }
}

export default class IdentityTableViewCell extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.data.active !== this.props.data.active || nextProps.data.text !== this.props.data.text
  }

  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onPress} background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 2, height: 48, backgroundColor: this.props.data.active ? '#EEEEEE' : 'rgba(0,0,0,0)' }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image
              source={images[this.props.data.type][this.props.data.active ? 'active' : 'normal']}
              style={{ width: 24, height: 24, marginRight: 32, opacity: this.props.data.active ? 1 : 0.54 }}
            />
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: '100%' }}>
              <Text style={{ fontSize: 14, color: this.props.data.active ? '#FF5722' : 'rgba(0,0,0,0.87)', fontWeight: '500' }}>{this.props.data.text}</Text>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}
