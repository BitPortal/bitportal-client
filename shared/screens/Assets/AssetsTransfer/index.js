
import React from 'react'
import { View, ScrollView } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import TransferAssetsForm from 'components/Form/TransferAssetsForm'
import styles from './styles'
import messages from './messages'
import TransferCard from './TransferCard'

@connect(
  state => ({
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
    if (this.props.entry && this.props.entry === 'scanner') {
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
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].snd_title_name_snd}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
            rightButton={<CommonRightButton iconName="md-qr-scanner" onPress={() => this.scanner()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TransferAssetsForm onPress={() => this.setState({ isVisible: true })} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
          <TransferCard isVisible={this.state.isVisible} onPress={() => { this.setState({ isVisible: false }) }} transferAsset={() => this.transferAsset()} />
        </View>
      </IntlProvider>
    )
  }
}
