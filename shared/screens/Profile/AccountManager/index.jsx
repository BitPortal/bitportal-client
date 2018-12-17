import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import Colors from 'resources/colors'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import messages from 'resources/messages'
import WalletCard from 'components/WalletCard'
import { BPGradientButton } from 'components/BPNativeComponents'
import { walletListSelector } from 'selectors/wallet'
import { eosPriceSelector } from 'selectors/ticker'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    walletList: walletListSelector(state),
    eosPrice: eosPriceSelector(state)
  }),
  null,
  null,
  { withRef: true }
)
export default class AccountManager extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  routeToNewAccount = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: `BitPortal.AccountAdd`
      }
    })
  }

  checkAccountDetails = (item) => {
    const passProps = {
      origin: item.get('origin'),
      bpid: item.get('bpid'),
      eosAccountName: item.get('eosAccountName'),
      coin: item.get('coin'),
      permission: item.get('permission').toLowerCase(),
      publicKey: item.get('publicKey')
    }
    Navigation.push(this.props.componentId, {
      component: {
        name: `BitPortal.AccountDetails`,
        passProps
      }
    })
  }

  render() {
    const { locale, walletList, eosPrice } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].profile_button_wallet_mgmt}
            leftButton={
              <CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />
            }
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              {
                walletList.map((item) => (
                  <WalletCard 
                    key={`${item.get('permission')}_${item.get('eosAccountName')}`}
                    accountType={item.get('permission').toLowerCase()}
                    accountName={item.get('eosAccountName')}
                    eosValue={+eosPrice * +item.get('balance')}
                    eosAmount={item.get('balance')}
                    balanceTitle="Balance"
                    locale={locale}
                    active={item.get('active')}
                    onPress={this.checkAccountDetails.bind(this, item)}
                    colors={item.get('permission').toLowerCase() !== 'owner' && Colors.ramColor}
                  />
                ))
              }
            </ScrollView>
          </View>
          <View style={styles.btnContainer}>
            <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 }}>
              <BPGradientButton onPress={this.routeToNewAccount} extraStyle={{ marginHorizontal: 10 }}>
                <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
                  {messages[locale].account_change_button_add_account}
                </Text>
              </BPGradientButton>
            </View>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
