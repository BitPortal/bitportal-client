/* @jsx */
import React, { Component } from 'react'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView, LayoutAnimation } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Header from './Header'
import Introduction from './Introduction'
import Contacts from './Contacts'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
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

export default class ProducerDetails extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  render() {
    const { locale, producer } = this.props
    const introduce = producer.getIn(['info', 'introduce', locale])
    const contacts = producer.getIn(['info', 'org', 'social'])
    const votes = producer.get('total_votes')
    const info = producer.get('info')

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={producer&&producer.get&&producer.get('owner')}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Header info={info} votes={votes} />
            <Introduction introduce={introduce} />
            {!!contacts && <Contacts contacts={contacts} />}
          </ScrollView>
        </View>
      </IntlProvider>
    )
  }
}
