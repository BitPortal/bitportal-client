
import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './styles'
import Colors from 'resources/colors'
import NavigationBar, { BackButton } from 'components/NavigationBar'
import InputItem from './InputItem'
import Modal from 'react-native-modal'
import TransferCard from './TransferCard'

export default class AssetsTransfer extends BaseScreen {

  state = {
    destination: '',
    amount: '',
    memo: '',
    isVisible: false
  }

  goBack = () => {
    this.props.navigator.pop()
  }

  scanner = () => {
    if (this.props.entry && this.props.entry == 'scanner') {
      this.goBack()
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
    return (
      <View style={styles.container}>
        <NavigationBar 
          leftButton={<BackButton iconName="md-arrow-back" onPress={() => this.goBack()}/>}
          title={"Send"}
          rightButton={
            <TouchableOpacity onPress={() => this.scanner()} style={styles.navButton}>
              <View style={{ marginLeft: 40 }}>
                <Ionicons name="md-qr-scanner" size={20} color={Colors.textColor_255_255_238} />
              </View>
            </TouchableOpacity>
          }
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <InputItem 
                title="Account Name" 
                placeholder="Up to 12 characters" 
                changeInputContent={(e) => this.changeDestination(e)} 
              />
              <InputItem 
                title="Amount" 
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
                  placeholder={'Memo...'}
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
                  Next 
                </Text>
              </TouchableHighlight>
            </View>
          </ScrollView>
        </View>

        <Modal
          animationIn="slideInUp"
          animationOut="slideOutDown"
          useNativeDriver={true}
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
    )
  }
}
