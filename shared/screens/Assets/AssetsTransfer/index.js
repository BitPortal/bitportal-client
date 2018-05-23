
import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './styles'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import Modal from 'react-native-modal'
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
    destination: '',
    amount: '',
    memo: '',
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

  changeDestination = (destination) => {
    this.setState({ destination })
  }

  changeAmount = (amount) => {
    this.setState({ amount })
  }

  changeMemo = (memo) => {
    this.setState({ memo })
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
              <TransferAssetsForm onPress={() => this.transferAsset()} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>

          <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            style = {{  margin: 0 }}
            isVisible={this.state.isVisible}
            backdropOpacity={0.9}
          >
            <TransferCard 
              amount={amount}
              quote="EOS"
              destination={destination}
              memo={memo}
              onPress={() => { this.setState({ isVisible: false }) }}
              transferAsset={() => this.transferAsset()}
            />
          </Modal>

        </View>
      </IntlProvider>
    )
  }
}
