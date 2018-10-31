import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import messages from 'resources/messages'
import Colors from 'resources/colors'

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.minorThemeColor,
    flex: 1,
    flexDirection: 'row',
    marginTop: 10
  },
  item: {
    width: '50%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  itemText: {
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  active: {
    borderBottomWidth: 1,
    borderBottomColor: '#59b9e2'
  },
  activeText: {
    color: '#59b9e2'
  }
})

@connect(state => ({
  locale: state.intl.get('locale')
}))
export default class Switch extends Component {
  render() {
    const { itemList, active, onSwitch, locale } = this.props
    const transactions = {
      Buy: messages[locale].resource_ram_button_buy,
      Sell: messages[locale].resource_ram_button_sell,
      Delegate: messages[locale].resource_button_stake,
      Undelegate: messages[locale].resource_button_unstake
    }
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          {itemList.map(item => (
            <TouchableOpacity
              key={item}
              style={[styles.item, active === item ? styles.active : {}]}
              onPress={() => onSwitch(item)}
            >
              <Text style={[styles.itemText, active === item ? styles.activeText : {}]}>{transactions[item]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </IntlProvider>
    )
  }
}
