import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import Colors from 'resources/colors'
import AccountCard from './AccountCard'
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

export default class AccountSelection extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  selectAccount = () => {

  }

  render() {
    const { locale } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          title={messages[locale].actslt_nav_title_name}
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <AccountCard 
              accountType={'Owner'} 
              accountName="testaccounts"
              EOSValue={12135.53}
              EOSAmount={421.4323}
              balanceTitle="Balance"
              onPress={this.selectAccount} 
            />
            <AccountCard 
              EOSValue={23142.55}
              EOSAmount={5242.5}
              balanceTitle="Balance"
              accountType={'Active'} 
              accountName="testaccounts" 
              colors={Colors.ramColor} 
            />
          </ScrollView>
        </View>
      </View>
    )
  }
}
