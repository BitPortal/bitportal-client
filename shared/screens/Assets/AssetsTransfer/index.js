
import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './styles'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import TransferCard from './TransferCard'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import messages from './messages'
import TransferAssetsForm from 'components/Form/TransferAssetsForm'

@connect(
  (state) => ({
    locale: state.intl.get('locale')
  })
)

export default class AssetsTransfer extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    isVisible: false
  }

  scanner = () => {
    if (this.props.entry && this.props.entry == 'scanner') {
      this.pop()
    } else {
      this.props.navigator.push({
        screen: 'BitPortal.QRCodeScanner'
      })
    }
  }

  transferAsset = () => {
    this.setState({ isVisible: false }, () => {
      this.props.navigator.push({
        screen: 'BitPortal.TransactionRecord'
      })
    })
  }

  render() {
    const { destination, amount, memo } = this.state
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar 
            title={messages[locale]["snd_title_name_snd"]}
            leftButton={ <CommonButton iconName="md-arrow-back" onPress={() => this.pop()}/> }
            rightButton={ <CommonRightButton iconName="md-qr-scanner" onPress={() => this.scanner()} /> }
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TransferAssetsForm onPress={() => this.setState({ isVisible: true })} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
          
          <TransferCard isVisible={this.state.isVisible} onPress={() => { this.setState({ isVisible: false }) }} transferAsset={() => this.transferAsset()}/>

        </View>
      </IntlProvider>
    )
  }
}
