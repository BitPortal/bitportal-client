import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, ScrollView, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class ExportPrivateKey extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  render() {
    const { locale, wifs } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].expvk_title_name_expvk}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              <View style={styles.content}>
                <Text style={[styles.text16, { marginLeft: -1 }]}>
                  <FormattedMessage id="expvk_hint_title_point1" />
                </Text>
                <Text style={[styles.text14, { marginTop: 15 }]} multiline={true}>
                  <FormattedMessage id="expvk_hint_txt_point1" />
                </Text>
                <Text style={[styles.text16, { marginLeft: -1, marginTop: 30, marginBottom: 10 }]}>
                  <FormattedMessage id="expvk_txtbox_title_pvk_owner" />
                </Text>
                <View style={[styles.inputContainer]}>
                  {wifs.map(item => <TextInput
                      key={item.wif}
                      editable={false}
                      multiline={true}
                      autoCorrect={false}
                      style={styles.input}
                      underlineColorAndroid="transparent"
                      selectionColor={Colors.textColor_181_181_181}
                      placeholder="Private key"
                      placeholderTextColor={Colors.textColor_181_181_181}
                      value={item.wif}
                  />
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
