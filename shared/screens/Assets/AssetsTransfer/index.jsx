import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import TransferAssetsForm from 'components/Form/TransferAssetsForm'
import { checkCamera } from 'utils/permissions'
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

export default class AssetsTransfer extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  scanner = async () => {
    if (this.props.entry && this.props.entry === 'scanner') {
      Navigation.pop(this.props.componentId)
    } else {
      const authorized = await checkCamera()
      if (authorized) {
        Navigation.push(this.props.componentId, {
          component: {
            name: 'BitPortal.QRCodeScanner'
          }
        })
      }
    }
  }

  transferAsset = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionRecord'
      }
    })
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].snd_title_name_snd}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            rightButton={<CommonRightButton iconName="md-qr-scanner" onPress={() => this.scanner()} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TransferAssetsForm componentId={this.props.componentId} />
              <View style={styles.keyboard} />
            </ScrollView>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
