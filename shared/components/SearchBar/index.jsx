import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IntlProvider, FormattedMessage } from 'react-intl'
import {
  View,
  Animated,
  TouchableOpacity,
  Text,
  TextInput,
  Easing
} from 'react-native'

import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

//props:locale, onChangeText, clearSearch
export default class SearchBar extends Component {
  state = {
    expanded: false,
    height: undefined,
    translateX: new Animated.Value(0),
    searchBoxColor: new Animated.Value(0),
    wrapperColor: new Animated.Value(0),
    opacity: new Animated.Value(0)
  }

  getHeight = (event) => {
    const { height } = event.nativeEvent.layout
    this.setState({ height })
  }

  toggleExpanded = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }))
  }

  clearSearch = () => {
    this.props.clearSearch()
  }

  animate = () => {
    const { expanded } = this.state
    this.state.translateX.setValue(expanded ? 1 : 0)
    this.state.searchBoxColor.setValue(expanded ? 1 : 0)
    this.state.opacity.setValue(expanded ? 1 : 0)
    return expanded
      ? Animated.sequence([
        Animated.parallel([
          Animated.timing(this.state.searchBoxColor, {
            toValue: 0,
            duration: 250,
            easing: Easing.ease
          }),
          Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 250,
            easing: Easing.ease
          })
        ]),
        Animated.timing(this.state.translateX, {
          toValue: 0,
          duration: 250,
          easing: Easing.ease
        }),
        Animated.timing(this.state.wrapperColor, {
          toValue: 0,
          duration: 100,
          easing: Easing.ease
        })
      ]).start()
      : Animated.sequence([
        Animated.timing(this.state.wrapperColor, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease
        }),
        Animated.timing(this.state.translateX, {
          toValue: 1,
          duration: 250,
          easing: Easing.ease
        }),
        Animated.parallel([
          Animated.timing(this.state.searchBoxColor, {
            toValue: 1,
            duration: 250,
            easing: Easing.ease
          }),
          Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 250,
            easing: Easing.ease
          })
        ])
      ]).start()
  }

  render() {
    const translateX = this.state.translateX.interpolate({
      inputRange: [0, 1],
      outputRange: ['15%', '80%']
    })
    const searchBoxColor = this.state.searchBoxColor.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.minorThemeColor, 'rgb(0,0,0)']
    })
    const wrapperColor = this.state.wrapperColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(32,33,38,0)', 'rgba(32,33,38,1)']
    })
    const { styleProps, locale } = this.props
    const { expanded, opacity } = this.state

    return (
      <IntlProvider messages={messages[locale]}>
        <Animated.View
          onLayout={(event) => {
            this.getHeight(event)
          }}
        >
          <View style={[styles.container, { height: this.state.height }]}>
            <Animated.View
              style={[
                styles.searchWrapper,
                {
                  justifyContent: 'flex-end',
                  backgroundColor: wrapperColor
                }
              ]}
            >
              <Animated.View style={{ opacity }}>
                <TouchableOpacity
                  onPress={() => {
                    this.toggleExpanded()
                    this.clearSearch()
                    this.animate()
                  }}
                  style={{ paddingHorizontal: 20 }}
                >
                  <Ionicons
                    name="md-arrow-back"
                    size={24}
                    color={Colors.textColor_181_181_181}
                  />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[
                  styles.searchBox,
                  styleProps,
                  {
                    width: translateX,
                    backgroundColor: searchBoxColor,
                    borderColor: searchBoxColor
                  }
                ]}
              >
                <Ionicons
                  name="ios-search"
                  onPress={() => {
                    this.toggleExpanded()
                    this.animate()
                  }}
                  size={24}
                  color={Colors.textColor_181_181_181}
                />
                <Text>{'  '}</Text>
                <Animated.View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity
                  }}
                >
                  <TextInput
                    style={[styles.textInput]}
                    placeholder={messages[locale].search}
                    placeholderTextColor={Colors.textColor_181_181_181}
                    numberOfLines={1}
                    onChangeText={text => this.props.onChangeText(text)}
                    autoCapitalize="characters"
                  />
                </Animated.View>
              </Animated.View>
              <View />
            </Animated.View>
          </View>
        </Animated.View>
      </IntlProvider>
    )
  }
}
