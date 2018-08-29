import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import {
  View,
  Animated,
  TouchableOpacity,
  Text,
  TextInput,
  Easing,
  Platform,
  InteractionManager,
  Keyboard
} from 'react-native'
import { Field, reduxForm } from 'redux-form/immutable'
import { SearchContainer, FormContainer, SearchField } from 'components/Form'

import Colors from 'resources/colors'
import { SCREEN_WIDTH } from 'utils/dimens'
import messages from './messages'
import styles from './styles'

const validate = (values) => {
  const errors = {}

  // if (!values.get('eosAccountName')) {
  //   errors.eosAccountName = (
  //     <FormattedMessage id="contacts_txtbox_txt_acchint2" />
  //   )
  // } else if (values.get('eosAccountName').length > 12) {
  //   errors.eosAccountName = (
  //     <FormattedMessage id="contacts_txtbox_txt_acchint" />
  //   )
  // }
  //
  // if (values.get('note') && values.get('note').length > 64) {
  //   errors.note = <FormattedMessage id="contacts_txtbox_txt_hint" />
  // }

  return errors
}

@reduxForm({
  form: 'addContactsForm',
  validate
  // asyncValidate,
  // asyncBlurFields: ['eosAccountName']
})
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
    translateX: new Animated.Value(0),
    searchBoxColor: new Animated.Value(0),
    wrapperColor: new Animated.Value(0),
    opacity: new Animated.Value(0),
    containerWidth: new Animated.Value(0)
  }

  toggleExpanded = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }))
  }

  clearSearch = () => {
    this.props.clearSearch()
    Keyboard.dismiss()
  }

  animate = () => {
    const handle = InteractionManager.createInteractionHandle()
    const { expanded } = this.state
    this.state.translateX.setValue(expanded ? 1 : 0)
    this.state.searchBoxColor.setValue(expanded ? 1 : 0)
    this.state.opacity.setValue(expanded ? 1 : 0)
    this.state.containerWidth.setValue(expanded ? 1 : 0)
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
        Animated.parallel([
          Animated.timing(this.state.wrapperColor, {
            toValue: 0,
            duration: 100,
            easing: Easing.ease
          }),
          Animated.timing(this.state.containerWidth, {
            toValue: 0,
            duration: 0,
            easing: Easing.ease
          })
        ])
      ]).start(() => {
        InteractionManager.clearInteractionHandle(handle)
      })
      : Animated.sequence([
        Animated.parallel([
          Animated.timing(this.state.containerWidth, {
            toValue: 1,
            duration: 100,
            easing: Easing.ease
          }),
          Animated.timing(this.state.wrapperColor, {
            toValue: 1,
            duration: 100,
            easing: Easing.ease
          })
        ]),
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
      ]).start(() => InteractionManager.clearInteractionHandle(handle))
  }

  render() {
    const translateX = this.state.translateX.interpolate({
      inputRange: [0, 1],
      outputRange: ['20%', '80%']
    })
    const searchBoxColor = this.state.searchBoxColor.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.minorThemeColor, 'rgb(0,0,0)']
    })
    const wrapperColor = this.state.wrapperColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(32,33,38,0)', 'rgba(32,33,38,1)']
    })
    const containerWidth = this.state.containerWidth.interpolate({
      inputRange: [0, 1],
      outputRange: [SCREEN_WIDTH / 1.5, SCREEN_WIDTH]
    })
    const { styleProps, locale } = this.props
    const { opacity } = this.state

    return (
      <IntlProvider messages={messages[locale]}>
        <Animated.View
          style={[
            styles.container,
            {
              width: containerWidth
            }
          ]}
        >
          <Animated.View
            style={[
              styles.searchWrapper,
              {
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
                  flex: 1,
                  opacity
                }}
              >
                {/* <TextInput
                  ref={(input) => {
                    this.textInput = input
                  }}
                  style={[styles.textInput]}
                  placeholder={
                    Platform.OS === 'ios' ? messages[locale].search : null
                  }
                  placeholderTextColor={Colors.textColor_181_181_181}
                  numberOfLines={1}
                  onChangeText={text => this.props.onChangeText(text)}
                  autoCapitalize="characters"
                  underlineColorAndroid="transparent"
                /> */}
                <SearchContainer>
                  <Field
                    name="searchField"
                    component={SearchField}
                    onChange={text => this.props.onChangeText(text)}
                    placeholder={
                      Platform.OS === 'ios' ? messages[locale].search : null
                    }
                    placeholderTextColor={Colors.textColor_181_181_181}
                    numberOfLines={1}
                  />
                </SearchContainer>
              </Animated.View>
            </Animated.View>
            <View />
          </Animated.View>
        </Animated.View>
      </IntlProvider>
      // <View>
      //   <View style={styles.container}>
      //     <Text>TEST</Text>
      //   </View>
      // </View>
    )
  }
}
