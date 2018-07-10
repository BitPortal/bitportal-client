/* @jsx */
import React, { Component } from 'react'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import StakeEOSForm from 'components/Form/StakeEOSForm'
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

export default class Stake extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    amount: 0
  }

  enterStakeAmount = (amount) => {
    this.setState({ amount })
  }

  stakeEOS = () => {

  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].vt_title_name_vote}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <StakeEOSForm />
          </ScrollView>
        </View>
      </IntlProvider>
    )
  }
}
