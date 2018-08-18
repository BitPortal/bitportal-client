import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { View, Animated, TouchableOpacity, TextInput } from 'react-native'
import Colors from 'resources/colors'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class SearchBar extends Component {
  state = { expanded: false }

  render() {
    const { styleProps, locale } = this.props
    const { expanded } = this.state

    return (
      <IntlProvider messages={messages[locale]}>
        <Animated.View>
          <View
            style={[
              {
                width: expanded ? 150 : 50,
                borderColor: expanded ? 'black' : 'transparent',
                backgroundColor: expanded ? 'black' : 'transparent',
                borderWidth: 1,
                borderRadius: 5,
                paddingVertical: 2,
                marginRight: 5
              },
              styleProps
            ]}
          >
            <View
              style={{
                alignItems: expanded ? 'flex-start' : 'flex-end',
                paddingRight: 7,
                paddingLeft: 7,
                flexDirection: 'row'
                // backgroundColor: 'yellow',
              }}
            >
              <TouchableOpacity
                style={{
                  width: 30,
                  // backgroundColor: 'red',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
                onPress={() => {
                  this.setState(prevState => ({
                    expanded: !prevState.expanded
                  }))
                }}
              >
                <Ionicons
                  name="ios-search"
                  size={24}
                  color={Colors.textColor_181_181_181}
                />
              </TouchableOpacity>
              {expanded && (
                <TextInput
                  style={{
                    color: Colors.textColor_181_181_181,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  placeholder={messages[locale].search}
                  placeholderTextColor={Colors.textColor_181_181_181}
                  numberOfLines={1}
                  onChangeText={() => {}}
                >
                  {/* <FormattedMessage id="search" /> */}
                </TextInput>
              )}
            </View>
          </View>
        </Animated.View>
      </IntlProvider>
    )
  }
}
