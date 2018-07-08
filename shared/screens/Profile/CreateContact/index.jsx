/* @jsx */

import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, TouchableHighlight } from 'react-native'
import Colors from 'resources/colors'
import InputItem from 'components/InputItem'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
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

export default class CreateContact extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    isAccountVaild: true
  }

  changeNickName = () => {

  }

  saveContact = () => {

  }

  render() {
    const { isAccountVaild } = this.state
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].newct_title_name_newct}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <View style={styles.content}>

              <InputItem
                title={messages[locale].newct_sec_title_nick}
                placeholder=""
                onChangeText={e => this.changeNickName(e)}
              />

              <InputItem
                title=""
                placeholder={messages[locale].newct_txtbox_txt_hint}
                isContentVaild={isAccountVaild}
                textFilter={text => (text.substring(0, 12))}
                onChangeText={e => this.changeNickName(e)}
                TipsComponent={() => (
                  !isAccountVaild &&
                  <Text style={[styles.text14, { color: Colors.textColor_255_98_92 }]}>
                    <FormattedMessage id="newct_txtbox_txt_warning" />
                  </Text>
                )}
              />

              <TouchableHighlight
                onPress={() => this.saveContact()}
                underlayColor={Colors.textColor_89_185_226}
                style={[styles.btn, styles.center, {
                  marginTop: 100,
                  backgroundColor: Colors.textColor_89_185_226
                }]}
              >
                <Text style={styles.text14}>
                  <FormattedMessage id="newct_button_name_txt" />
                </Text>
              </TouchableHighlight>


            </View>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
