import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import AccordionPanel from 'components/AccordionPanel'
import { IntlProvider } from 'react-intl'
import styles from './styles'
import messages from 'resources/messages'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    token: state.token.get('data'),
    loading: state.token.get('loading')
  }),
  null,
  null,
  { withRef: true }
)
export default class Description extends Component {
  getDescription = (locale) => {
    const { token } = this.props

    if (
      token.get('description')
      && token.get('description').get(locale)
      && token.get('description').get(locale).length !== 0
    ) { return token.get('description').get(locale) } else if (
      token.get('description')
      && token.get('description').get('en')
      && token.get('description').get('en').length !== 0
    ) { return token.get('description').get('en') } else { return messages[locale].description_null }
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <AccordionPanel title={messages[locale].description}>
          <View
            style={{
              paddingHorizontal: 25,
              paddingBottom: 30,
              marginLeft: 4
            }}
          >
            <Text ellipseMode="clip" style={[styles.text14]}>
              {this.getDescription(locale)}
            </Text>
          </View>
        </AccordionPanel>
      </IntlProvider>
    )
  }
}
