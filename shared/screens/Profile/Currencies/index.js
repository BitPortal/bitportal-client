/* @tsx */

import React from 'react'
import BaseScreen from 'components/BaseScreen'
import Colors from 'resources/colors'
import SettingItem from 'components/SettingItem'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { bindActionCreators } from 'redux'
import * as currencyActions from 'actions/currency'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    currency: state.currency
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...currencyActions
    }, dispatch)
  })
)

export default class Currencies extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  switchCurrency = (symbol) => {
    this.props.actions.setCurrency(symbol)
  }

  render() {
    const { locale, currency } = this.props
    const currentSymbol = currency.get('symbol')

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].cur_title_name_currency}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SettingItem
                leftItemTitle="CNY"
                onPress={() => this.switchCurrency('CNY')}
                extraStyle={{ marginTop: 10 }}
                iconColor={Colors.bgColor_0_122_255}
                rightItemTitle={currentSymbol === 'CNY' ? null : ' '}
                rightImageName={currentSymbol === 'CNY' && 'md-checkmark'}
              />
              <SettingItem
                leftItemTitle="USD"
                iconColor={Colors.bgColor_0_122_255}
                rightItemTitle={currentSymbol === 'USD' ? null : ' '}
                rightImageName={currentSymbol === 'USD' && 'md-checkmark'}
                onPress={() => this.switchCurrency('USD')}
              />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
