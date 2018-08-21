import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { Navigation } from 'react-native-navigation'
import { View, Animated, TouchableOpacity, Text, TextInput } from 'react-native'

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
export default class SearchBar extends Component {
  state = { expanded: false, height: undefined }

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

  render() {
    const { styleProps, locale } = this.props
    const { expanded } = this.state
    return (
      <IntlProvider messages={messages[locale]}>
        <Animated.View
          onLayout={(event) => {
            this.getHeight(event)
          }}
        >
          <View style={[styles.container, { height: this.state.height }]}>
            <View
              style={[
                styles.searchWrapper,
                {
                  justifyContent: expanded ? 'flex-start' : 'flex-end',
                  backgroundColor: expanded
                    ? Colors.minorThemeColor
                    : 'transparent'
                }
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  this.toggleExpanded()
                  this.clearSearch()
                }}
                style={{ paddingHorizontal: 20 }}
              >
                <Ionicons
                  name="md-arrow-back"
                  size={24}
                  color={
                    expanded ? Colors.textColor_181_181_181 : 'transparent'
                  }
                />
              </TouchableOpacity>
              {!expanded && (
                <TouchableOpacity
                  onPress={() => {
                    this.toggleExpanded()
                  }}
                >
                  <Ionicons
                    name="ios-search"
                    size={24}
                    color={Colors.textColor_181_181_181}
                  />
                </TouchableOpacity>
              )}
              {expanded && (
                <View style={[styles.searchBox, styleProps]}>
                  <Ionicons
                    name="ios-search"
                    size={24}
                    color={Colors.textColor_181_181_181}
                  />
                  <Text>{'  '}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={
                      this.props.searchTerm || messages[locale].search
                    }
                    placeholderTextColor={Colors.textColor_181_181_181}
                    numberOfLines={1}
                    onChangeText={text => this.props.onChangeText(text)}
                    autoCapitalize="characters"
                  />
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </IntlProvider>
    )
  }
}
