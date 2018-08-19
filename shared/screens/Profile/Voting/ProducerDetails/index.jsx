import React, { Component } from 'react'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import Header from './Header'
import Introduction from './Introduction'
import Contacts from './Contacts'
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

  render() {
    const { locale, producer, total_producer_vote_weight } = this.props
    const introduce = producer.getIn(['info', 'introduce', locale])
    const contacts = producer.getIn(['info', 'org', 'social']) || producer.getIn(['info', 'org', 'social_network'])
    const votes = producer.get('total_votes')

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={producer && producer.get && producer.get('owner')}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Header producer={producer} votes={(+votes / +total_producer_vote_weight) * 100} />
            {!!introduce && <Introduction introduce={introduce} />}
            {!!contacts && <Contacts contacts={contacts} />}
          </ScrollView>
        </View>
      </IntlProvider>
    )
  }
}
