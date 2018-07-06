/* @jsx */
import React, { Component } from 'react'
import { View, Text, TouchableHighlight, LayoutAnimation } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef : true }
)

export default class Introduction extends Component {

  state = {
    folded: false
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  hidden = () => {
    this.setState({ folded: !this.state.folded })
  }

  render() {
    const { locale, producer } = this.props
    const { folded } = this.state
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.intro}>
          <TouchableHighlight underlayColor={Colors.hoverColor} onPress={this.hidden} style={styles.introTitle}>
            <View style={[styles.introTitle, styles.between, { paddingHorizontal: 32 }]}>
              <Text style={[styles.text16, { color: Colors.textColor_89_185_226 }]}> 
                Team Introduction
              </Text>
              {
                folded ?
                <Ionicons name="ios-arrow-down" size={24} color={Colors.textColor_181_181_181} />
                :
                <Ionicons name="ios-arrow-up" size={24} color={Colors.textColor_181_181_181} />
              }
            </View>
          </TouchableHighlight>
          {
            !folded &&
            <Text style={[styles.text14, { marginHorizontal: 32, marginBottom: 20 }]}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
              qui officia deserunt mollit anim id est laborum.
            </Text>
          }
        </View>
      </IntlProvider>
    )
  }
}
