import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ScrollView, Text, TouchableHighlight, Image, TextInput, Alert, ActivityIndicator, LayoutAnimation, UIManager } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import Modal from 'react-native-modal'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import * as identityActions from 'actions/identity'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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
        title: {
          text: gt('backup_mnemonic')
        },
        leftButtons: [
          {
            id: 'cancel',
            icon: require('resources/images/cancel_android.png'),
            color: 'white'
          }
        ],
        rightButtons: [
          {
            id: 'next',
            text: gt('button_next'),
            fontWeight: '400',
            color: 'white'
          }
        ]
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.validateMnemonics.loading !== prevState.loading) {
      return {
        loading: nextProps.validateMnemonics.loading
      }
    } else {
      return null
    }
  }

  state = { validating: false, shuffledMnemonics: '', userEntry: '', loading: false, showModal: false, showModalContent: false }
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
                text: t(this,'validation'),
                fontWeight: '400',
                color: 'white',
                enabled: this.props.mnemonics.split(' ').length === this.state.userEntry.split(' ').length
              }
            ]
          }
        })
      })
    } else if (buttonId === 'verify') {
      if (this.state.userEntry !== this.props.mnemonics) {
        Alert.alert(
          t(this,'backup_mnemonic_wrongorder'),
          '',
          [
            { text: t(this,'button_ok'), onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        )
      } else {
        this.setState({ showModal: true, showModalContent: true }, () => {
          setTimeout(() => {
            this.setState({ showModal: false, showModalContent: false }, () => {
              if (!this.props.backup) {
                this.props.actions.validateMnemonics.requested({ componentId: this.props.componentId })
              }
            })
          }, 1000)
        })
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
              text: t(this,'validation'),
              fontWeight: '400',
              color: 'white',
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

  onModalHide = () => {
    setTimeout(() => {
      if (this.props.backup) {
        Navigation.dismissModal(this.props.componentId)
      }
    }, 20)
  }

  componentDidAppear() {

  }

  componentWillUnmount() {

  }

  componentDidMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  render() {
    const { intl, mnemonics, validateMnemonics } = this.props
    const loading = validateMnemonics.loading

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ marginTop: 30, marginBottom: 30 }}>
            {!this.state.validating && <Text style={{ fontSize: 20, color: 'black', paddingLeft: 16, paddingRight: 16, fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'mnemonics_backup_hint_write_down' })}
            </Text>}
            {this.state.validating && <Text style={{ fontSize: 20, color: 'black', paddingLeft: 16, paddingRight: 16, fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'mnemonics_backup_hint_verify_by_click' })}
            </Text>}
          </View>
          <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.12)', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, minHeight: 72 }}>
            {!this.state.validating && <Text style={{ fontSize: 17, lineHeight: 28, color: 'rgba(0,0,0,0.87)' }}>{mnemonics}</Text>}
            {this.state.validating && !!this.state.userEntry && <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
             {this.state.userEntry.split(' ').map((word, index) => (
                <TouchableHighlight
                  key={`${word}-${index}`}
                  underlayColor="rgba(255,255,255,0)"
                  onPress={this.onPressWord.bind(this, word, 'userEntry', index)}
                  style={{ borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)', paddingTop: 2, paddingBottom: 4, paddingHorizontal: 8, marginRight: 10, marginBottom: 10, borderRadius: 4, backgroundColor: '#F8F8F8' }}
                >
                  <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.87)' }}>{word}</Text>
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
                  style={{ borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)', paddingTop: 2, paddingBottom: 4, paddingHorizontal: 8, marginRight: 10, marginBottom: 10, borderRadius: 4, backgroundColor: '#F8F8F8' }}
                >
                  <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.87)' }}>{word}</Text>
                </TouchableHighlight>
              ))}
          </View>}
        </View>
        <Modal
          isVisible={this.state.showModal}
          backdropOpacity={0}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
          onModalHide={this.onModalHide}
        >
          {this.state.showModal && <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.87)', padding: 16, borderRadius: 4, height: 48, elevation: 1, justifyContent: 'center', width: '100%' }}>
              <Text style={{ fontSize: 14, color: 'white' }}>{t(this,'backup_mnemonic_correct')}</Text>
            </View>
          </View>}
        </Modal>
      </ScrollView>
    )
  }
}
