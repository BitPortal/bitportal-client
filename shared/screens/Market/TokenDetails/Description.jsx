import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import AccordionPanel from 'components/AccordionPanel'
import { IntlProvider } from 'react-intl'
import styles from './styles'
import messages from './messages'

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
    const { description } = this.props.token.toJS()

    if (
      description
      && description[locale]
      && description[locale].length !== 0
    ) {
      return description[locale]
    } else if (description && description.en && description.en.length !== 0) {
      return description.en
    } else {
      return messages[locale].description_null
    }
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
            <Text
              ellipseMode="clip"
              style={[
                styles.text14
              ]}
            >
              {this.getDescription(locale)}
            </Text>
          </View>
        </AccordionPanel>
      </IntlProvider>
    )
  }
}
