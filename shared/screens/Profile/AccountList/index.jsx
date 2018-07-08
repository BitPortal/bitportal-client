/* @tsx */

import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { eosAccountSelector } from 'selectors/eosAccount'
import WalletCard from './WalletCard'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    wallet: state.wallet,
    eosAccount: eosAccountSelector(state)
  }),
  null,
  null,
  { withRef: true }
)

export default class AccountList extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  createNewAccount = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AccountCreation'
      }
    })
  }

  importAccount = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AccountImport'
      }
    })
  }

  checkAsset = (item) => {
    const walletInfo = item.toJS()
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.AccountManager',
        passProps: walletInfo
      }
    })
  }

  render() {
    const { locale, wallet } = this.props
    const hdWalletList = wallet.get('hdWalletList')
    const classicWalletList = wallet.get('classicWalletList')

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].actlist_title_name_account}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            >
              {!!hdWalletList.size && hdWalletList.map(item => <WalletCard key={item.get('bpid')} assetName={item.get('name')} accountName={item.get('eosAccountName')} onPress={() => this.checkAsset(item)} />)}
              {!!classicWalletList.size && classicWalletList.map(item => <WalletCard key={item.get('eosAccountName')} assetName={item.get('name')} accountName={item.get('eosAccountName')} onPress={() => this.checkAsset(item)} />)}
            </ScrollView>
          </View>
          <View style={[styles.btnContainer, styles.between]}>
            <TouchableOpacity style={[styles.center, styles.btn]} onPress={() => this.createNewAccount()}>
              <Text style={styles.text14}> <FormattedMessage id="actlist_button_name_create" /> </Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity style={[styles.center, styles.btn]} onPress={() => this.importAccount()}>
              <Text style={styles.text14}> <FormattedMessage id="actlist_button_name_import" /> </Text>
            </TouchableOpacity>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
