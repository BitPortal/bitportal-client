import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ScrollView, Text, TouchableHighlight, Image, TextInput, Alert, ActivityIndicator, LayoutAnimation, NativeModules } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import Modal from 'react-native-modal'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import * as identityActions from 'actions/identity'
import { DarkModeContext } from 'utils/darkMode'
const SPAlert = NativeModules.SPAlert

const styles = EStyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17
  },
  textFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 102'
  }
})

const shuffleArray = (array) => {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

@injectIntl

@connect(
  state => ({
    validateMnemonics: state.validateMnemonics
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...identityActions
    }, dispatch)
  })
)

export default class BackupIdentity extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'next',
            text: gt('下一步'),
            fontWeight: '400'
          }
        ],
        largeTitle: {
          visible: false
        },
        noBorder: true
      }
    }
  }
  static contextType = DarkModeContext
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.validateMnemonics.loading !== prevState.loading) {
      return {
        loading: nextProps.validateMnemonics.loading
      }
    } else {
      return null
    }
  }

  state = { validating: false, shuffledMnemonics: '', userEntry: '', loading: false }
  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'next') {
      this.setState({
        validating: true,
        mnemonics: this.props.mnemonics,
        shuffledMnemonics: shuffleArray(this.props.mnemonics.split(' ')).join(' '),
        userEntry: ''
      }, () => {
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            rightButtons: [
              {
                id: 'verify',
                text: t(this,'验证'),
                fontWeight: '400',
                enabled: this.props.mnemonics.split(' ').length === this.state.userEntry.split(' ').length
              }
            ]
          }
        })
      })
    } else if (buttonId === 'verify') {
      if (this.state.userEntry !== this.props.mnemonics) {
        Alert.alert(
          t(this,'助记词顺序不正确，请校对'),
          '',
          [
            { text: t(this,'确定'), onPress: () => console.log('OK Pressed') }
          ]
        )
      } else {
        SPAlert.presentDone(t(this,'助记词顺序正确!'))
        this.props.actions.validateMnemonics.requested({ componentId: this.props.componentId, delay: 2000, backup: this.props.backup })
      }
    } else if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userEntry !== this.state.userEntry || prevState.loading !== this.state.loading) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'verify',
              text: t(this,'验证'),
              fontWeight: '400',
              enabled: this.props.mnemonics.split(' ').length === this.state.userEntry.split(' ').length && !this.state.loading
            }
          ]
        }
      })
      LayoutAnimation.easeInEaseOut()
    }
  }

  onPressWord = (word, source, index) => {
    if (source === 'shuffledMnemonics') {
      if (!!this.state.userEntry) {
        this.setState({ userEntry: [...this.state.userEntry.split(' '), word].join(' ') })
      } else {
        this.setState({ userEntry: word })
      }

      const shuffledMnemonicsList = this.state.shuffledMnemonics.split(' ')
      // const wordIndex = shuffledMnemonicsList.findIndex(item => item === word)

      if (index !== -1) {
        shuffledMnemonicsList.splice(index, 1)
        const newShuffledMnemonics = shuffledMnemonicsList.join(' ')
        this.setState({ shuffledMnemonics: newShuffledMnemonics })
      }
    } else {
      if (!!this.state.shuffledMnemonics) {
        this.setState({ shuffledMnemonics: [...this.state.shuffledMnemonics.split(' '), word].join(' ') })
      } else {
        this.setState({ shuffledMnemonics: word })
      }

      const userEntryList = this.state.userEntry.split(' ')
      // const wordIndex = userEntryList.findIndex(item => item === word)

      if (index !== -1) {
        userEntryList.splice(index, 1)
        const newUserEntry = userEntryList.join(' ')
        this.setState({ userEntry: newUserEntry })
      }
    }
  }

  componentDidAppear() {

  }

  componentWillUnmount() {

  }

  componentDidMount() {
    // this.props.actions.validateMnemonics.succeeded()
  }

  render() {
    const { intl, mnemonics, validateMnemonics, backup } = this.props
    const loading = validateMnemonics.loading
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <ScrollView style={[styles.container, { color: isDarkMode ? 'black' : 'white' }]} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ marginBottom: 14 }}>
            {(this.props.backup && !this.props.fromIdentity) && <Text style={{ fontSize: 26, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>{intl.formatMessage({ id: 'manage_wallet_title_backup_mnemonics' })}</Text>}
            {(!this.props.backup || !!this.props.fromIdentity) && <Text style={{ fontSize: 26, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>{intl.formatMessage({ id: 'manage_wallet_title_backup_identity' })}</Text>}
            {/* {loading && !backup && (
                <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, right: -25 }}>
                <ActivityIndicator size="small" color="#000000" />
                </View>
                )
                } */}
          </View>
          {!this.state.validating && <Text style={{ fontSize: 17, marginBottom: 16, paddingLeft: 32, paddingRight: 32, lineHeight: 22, textAlign: 'center', color: isDarkMode ? 'white' : 'black' }}>
            {intl.formatMessage({ id: 'mnemonics_backup_hint_write_down' })}
          </Text>}
          {this.state.validating && <Text style={{ fontSize: 17, marginBottom: 16, paddingLeft: 32, paddingRight: 32, lineHeight: 22, textAlign: 'center', color: isDarkMode ? 'white' : 'black' }}>
            {intl.formatMessage({ id: 'mnemonics_backup_hint_verify_by_click' })}
          </Text>}
          <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, marginTop: 50, minHeight: 72 }}>
            {!this.state.validating && <Text style={{ fontSize: 17, lineHeight: 28, color: isDarkMode ? 'white' : 'black' }}>{mnemonics}</Text>}
            {this.state.validating && !!this.state.userEntry && <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
              {this.state.userEntry.split(' ').map((word, index) => (
                <TouchableHighlight
                  key={`${word}-${index}`}
                  underlayColor="rgba(255,255,255,0)"
                  onPress={this.onPressWord.bind(this, word, 'userEntry', index)}
                  style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.3)', paddingTop: 2, paddingBottom: 4, paddingHorizontal: 8, marginRight: 10, marginBottom: 10, borderRadius: 9, backgroundColor: isDarkMode ? 'black' : '#F8F8F8' }}
                >
                  <Text style={{ fontSize: 17, color: isDarkMode ? 'white' : 'black' }}>{word}</Text>
                </TouchableHighlight>
              ))}
            </View>}
          </View>
          {this.state.validating && !!this.state.shuffledMnemonics && <View style={{ width: '100%', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, marginTop: 2, flexDirection: 'row', flexWrap: 'wrap' }}>
            {this.state.shuffledMnemonics.split(' ').map((word, index) => (
              <TouchableHighlight
                key={`${word}-${index}`}
                underlayColor="rgba(255,255,255,0)"
                onPress={this.onPressWord.bind(this, word, 'shuffledMnemonics', index)}
                style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.3)', paddingTop: 2, paddingBottom: 4, paddingHorizontal: 8, marginRight: 10, marginBottom: 10, borderRadius: 9, backgroundColor: isDarkMode ? 'black' : '#F8F8F8' }}
              >
                <Text style={{ fontSize: 17, color: isDarkMode ? 'white' : 'black' }}>{word}</Text>
              </TouchableHighlight>
            ))}
          </View>}
        </View>
      </ScrollView>
    )
  }
}
