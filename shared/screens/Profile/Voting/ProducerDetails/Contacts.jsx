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
  { withRef: true }
)

export default class Contacts extends Component {

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
        <View style={[styles.intro, { marginTop: 10 }]}>
          <TouchableHighlight underlayColor={Colors.hoverColor} onPress={this.hidden} style={styles.introTitle}>
            <View style={[styles.introTitle, styles.between, { paddingHorizontal: 32 }]}>
              <Text style={[styles.text16, { color: Colors.textColor_89_185_226 }]}> 
                Contacts
              </Text>
              {
                folded ?
                <Ionicons name="ios-arrow-down" size={24} color={Colors.textColor_181_181_181} />
                :
                <Ionicons name="ios-arrow-up" size={24} color={Colors.textColor_181_181_181} />
              }
            </View>
          </TouchableHighlight>
          {!folded &&<Text style={[styles.text14, { marginHorizontal: 32, marginBottom: 20 }]}> Github </Text>}
          {!folded &&<Text style={[styles.text14, { marginHorizontal: 32, marginBottom: 20 }]}> Twitter </Text>}
          {!folded &&<Text style={[styles.text14, { marginHorizontal: 32, marginBottom: 20 }]}> Facebook </Text>}
          {!folded &&<Text style={[styles.text14, { marginHorizontal: 32, marginBottom: 20 }]}> Telegram </Text>}
          {!folded &&<Text style={[styles.text14, { marginHorizontal: 32, marginBottom: 20 }]}> Wechat </Text>}
        </View>
      </IntlProvider>
    )
  }
}
