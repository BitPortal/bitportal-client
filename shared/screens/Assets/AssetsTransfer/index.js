
import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './styles'
import Colors from 'resources/colors'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import InputItem from './InputItem'
import Modal from 'react-native-modal'
import TransferCard from './TransferCard'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'

@connect(
  (state) => ({
    locale: state.intl.get('locale')
  })
)

export default class AssetsTransfer extends BaseScreen {

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
              <View style={styles.content}>
                <InputItem 
                  title={<FormattedMessage id="snd_title_name_accnm" />} 
                  placeholder={messages[locale]['snd_title_name_acclmt']}
                  changeInputContent={(e) => this.changeDestination(e)} 
                />
                <InputItem 
                  title={<FormattedMessage id="snd_title_name_amt" />} 
                  placeholder="0" 
                  style={{ marginTop: 20 }}
                  changeInputContent={(e) => this.changeAmount(e)} 
                />

                <View style={[styles.inputContainer]}>
                  <TextInput
                    autoCorrect={false}
                    multiline={true}
                    underlineColorAndroid="transparent"
                    style={styles.input}
                    selectionColor={Colors.textColor_181_181_181}
                    keyboardAppearance={Colors.keyboardTheme}
                    placeholder={messages[locale]['sndcfm_title_name_rmk']}
                    placeholderTextColor={Colors.textColor_181_181_181}
                    onChangeText={(e) => this.changeMemo(e)}
                    value={memo}
                  />
                </View>

                <TouchableHighlight 
                  onPress={() => { this.setState({ isVisible: true }) }} 
                  underlayColor={Colors.textColor_89_185_226}
                  style={[styles.btn, styles.center, { marginTop: 20, backgroundColor: Colors.textColor_89_185_226 }]}
                >
                  <Text style={[styles.text14]}> 
                    <FormattedMessage id="snd_button_name_nxt" /> 
                  </Text>
                </TouchableHighlight>
              </View>
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
