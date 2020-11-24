import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, ActionSheetIOS, Alert, Text, ActivityIndicator, Animated, TextInput, TouchableHighlight, Image, Keyboard, LayoutAnimation,
  SafeAreaView, UIManager, Dimensions, TouchableNativeFeedback } from 'react-native'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import { Navigation } from 'components/Navigation'
import * as contactActions from 'actions/contact'
import Modal from 'react-native-modal'
import uuidv4 from 'uuid/v4'
import {
  validateBTCAddress,
  validateETHAddress,
  // validateEOSAccountName
} from 'utils/validate'
import { findDuplicate } from 'utils'
import { OutlinedTextField } from 'components/Form'
import { injectIntl } from "react-intl";

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return gt('密码错误')
    default:
      return gt('操作失败')
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = gt('请输入姓名')
  } else if (!values.name.trim().length) {
    errors.name = gt('请输入姓名')
  } else if (values.name.trim().length > 50) {
    errors.name = gt('姓名不超过50个字符')
  }

  return errors
}

const warn = (values) => {

  const warnings = {}

  /* if (!values.name) {
   *   warnings.name = '请输入姓名'
   * } else if (!values.name.trim().length) {
   *   warnings.name = '请输入姓名'
   * } else if (values.name.trim().length > 50) {
   *   warnings.name = '姓名不超过50个字符'
   * }*/

  return warnings
}

const shouldError = () => true

@reduxForm({ form: 'editContactForm', validate, shouldError, warn })
@injectIntl
@connect(
  state => ({
    formSyncWarnings: getFormSyncWarnings('editContactForm')(state),
    formValues: getFormValues('editContactForm')(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...contactActions
    }, dispatch)
  })
)

export default class EditContact extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        },
        title: {
          text: ''
        },
        /* leftButtons: [
         *   {
         *     id: 'cancel',
         *     icon: require('resources/images/cancel_android.png'),
         *     color: 'white'
         *   }
         * ],*/
        rightButtons: [
          {
            id: 'done',
            icon: require('resources/images/check_android.png'),
            color: 'white'
          }
        ],
        drawBehind: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    btcIds: [],
    ethIds: [],
    rioIds: [],
    lastBTCId: 0,
    lastETHId: 0,
    lastRIOId: 0
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      // Keyboard.dismiss()
      Navigation.pop(this.props.componentId)
    } else if (buttonId === 'done') {
      const { formSyncWarnings, formValues } = this.props

      if (!formValues || !formValues.name || !formValues.name.trim().length) {
        Alert.alert(
          t(this,'请输入姓名'),
          '',
          [
            { text: t(this,'确定'), onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }

      const btc = []
      const eth = []
      const rio = []

      this.state.btcIds.forEach((value) => {
        if (formValues[`btc_address_${value}`]) {
          btc.push({ address: formValues[`btc_address_${value}`] })
        }
      })

      this.state.ethIds.forEach((value) => {
        if (formValues[`eth_address_${value}`]) {
          eth.push({ address: formValues[`eth_address_${value}`] })
        }
      })
      this.state.rioIds.forEach(value => {
        if (formValues[`rio_address_${value}`]) {
          rio.push({ address: formValues[`rio_address_${value}`] })
        }
      })

      if (!btc.length && !eth.length) {
        Alert.alert(
          t(this,'请添加地址或账户名'),
          '',
          [
            { text: t(this,'确定'), onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }

      for (let i = 0; i < btc.length; i++) {
        if (!validateBTCAddress(btc[i].address)) {
          Alert.alert(
            t(this,'无效的{symbol}地址',{symbol:'BTC'}),
            btc[i].address,
            [
              { text: t(this,'确定'), onPress: () => console.log('OK Pressed') }
            ]
          )
          return
        }
      }

      for (let i = 0; i < eth.length; i++) {
        if (!validateETHAddress(eth[i].address)) {
          Alert.alert(
            t(this,'无效的{symbol}地址',{symbol:'ETH'}),
            eth[i].address,
            [
              { text: t(this,'确定'), onPress: () => console.log('OK Pressed') }
            ]
          )
          return
        }
      }

      for (let i = 0; i < rio.length; i++) {
        if (!validateRioAddress(rio[i].address)) {
          Alert.alert(
            '无效的RioChain地址',
            rio[i].address,
            [
              { text: '确定', onPress: () => console.log('OK Pressed') }
            ]
          )
          return
        }
      }

      const btcAddresses = btc.map(item => item.address)
      const btcDuplicate = findDuplicate(btcAddresses)
      if (btcDuplicate) {
        Alert.alert(
          t(this,'重复添加的{symbol}地址',{symbol:'BTC'}),
          btcDuplicate,
          [
            { text: t(this,'确定'), onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }

      const ethAddresses = eth.map(item => item.address)
      const ethDuplicate = findDuplicate(ethAddresses)
      if (ethDuplicate) {
        Alert.alert(
          t(this,'重复添加的{symbol}地址',{symbol:'ETH'}),
          ethDuplicate,
          [
            { text: t(this,'确定'), onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }
      const rioAddress = rio.map(item => item.address)
      const rioDuplicate = findDuplicate(rioAddress)
      if (rioDuplicate) {
        Alert.alert(
          '重复添加的RioChain地址',
          ethDuplicate,
          [
            { text: '确定', onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }

      this.props.handleSubmit(this.submit)()
    }
  }

  submit = (data) => {
    const btc = []
    const eth = []
    const rio = []

    this.state.btcIds.forEach((value) => {
      if (data[`btc_address_${value}`]) {
        btc.push({ address: data[`btc_address_${value}`] })
      }
    })

    this.state.ethIds.forEach((value) => {
      if (data[`eth_address_${value}`]) {
        eth.push({ address: data[`eth_address_${value}`] })
      }
    })
    this.state.rioIds.forEach((value) => {
      if (data[`rio_address_${value}`]) {
        rio.push({ address: data[`rio_address_${value}`] })
      }
    })

    if (this.props.editMode && this.props.contact) {
      this.props.actions.addContact({
        id: this.props.contact.id,
        name: data.name.trim(),
        description: data.description && data.description.trim(),
        btc,
        eth,
        // eos
      })
    } else {
      this.props.actions.addContact({
        id: this.props.id || uuidv4(),
        name: data.name.trim(),
        description: data.description && data.description.trim(),
        btc,
        eth,
        // eos
      })
    }

    Navigation.pop(this.props.componentId)
  }

  clearError = () => {

  }

  onModalHide = () => {

  }

  addBTCAddress = () => {
    this.setState({ btcIds: [...this.state.btcIds, this.state.lastBTCId + 1], lastBTCId: this.state.lastBTCId + 1 })
  }

  addETHAddress = () => {
    this.setState({ ethIds: [...this.state.ethIds, this.state.lastETHId + 1], lastETHId: this.state.lastETHId + 1 })
  }
  addRIOAddress = () => {
    this.setState({ rioIds: [...this.state.rioIds, this.state.lastRIOId + 1], lastRIOId: this.state.lastRIOId + 1 })
  }

  removeBTCAddress = (id) => {
    this.setState({ btcIds: this.state.btcIds.filter(item => item !== id) })
    this.props.change(`btc_address_${id}`, null)
  }

  removeETHAddress = (id) => {
    this.setState({ ethIds: this.state.ethIds.filter(item => item !== id) })
    this.props.change(`eth_address_${id}`, null)
  }
  removeRIOAddress = (id) => {
    this.setState({ rioIds: this.state.rioIds.filter(item => item !== id) })
    this.props.change(`rio_address_${id}`, null)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.btcIds.length !== this.state.btcIds.length
      || prevState.ethIds.length !== this.state.ethIds.length
      // || prevState.eosIds.length !== this.state.eosIds.length
    ) {
      LayoutAnimation.easeInEaseOut()
    }
  }

  componentDidMount() {
    if (this.props.editMode && this.props.contact) {
      this.props.change('name', this.props.contact.name)

      if (this.props.contact.description) {
        this.props.change('description', this.props.contact.description)
      }

      if (this.props.contact.btc.length) {
        const btcIds = []

        for (let i = 0; i < this.props.contact.btc.length; i++) {
          this.props.change(`btc_address_${i}`, this.props.contact.btc[i].address)
          btcIds.push(i)
        }

        this.setState({ btcIds })
      }

      if (this.props.contact.eth.length) {
        const ethIds = []

        for (let i = 0; i < this.props.contact.eth.length; i++) {
          this.props.change(`eth_address_${i}`, this.props.contact.eth[i].address)
          ethIds.push(i)
        }

        this.setState({ ethIds })
      }
      if (this.props.contact.rio.length) {
        const rioIds = []

        for (let i = 0; i < this.props.contact.rio.length; i++) {
          this.props.change(`rio_address_${i}`, this.props.contact.rio[i].address)
          rioIds.push(i)
        }

        this.setState({ rioIds })
      }
    }

    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  render() {
    const { formValues, change, contact, editMode } = this.props
    const name = formValues && formValues.name
    const description = formValues && formValues.description

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ width: '100%', paddingTop: 16 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 40, height: 56, alignItems: 'flex-end', justifyContent: 'center' }}>
                <Image
                  source={require('resources/images/contact_android.png')}
                  style={{ width: 24, height: 24 }}
                />
              </View>
              <View style={{ width: Dimensions.get('window').width - 40 }}>
                <Field
                  label={t(this,'姓名')}
                  placeholder={t(this,'必填')}
                  name="name"
                  fieldName="name"
                  change={change}
                  component={OutlinedTextField}
                  separator={true}
                  nonEmpty={!!name && name.length > 0}
                  autoCapitalize="sentences"
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 40, height: 56, alignItems: 'flex-end', justifyContent: 'center' }} />
              <View style={{ width: Dimensions.get('window').width - 40 }}>
                <Field
                  label={t(this,'描述')}
                  placeholder={t(this,'选填')}
                  name="description"
                  fieldName="description"
                  change={change}
                  component={OutlinedTextField}
                  nonEmpty={!!description && description.length > 0}
                  autoCapitalize="sentences"
                />
              </View>
            </View>
          </View>
          <View style={{ width: '100%' }}>
            {this.state.btcIds.map((id, index) =>
              <View key={id} style={{ width: '100%', flexDirection: 'row' }}>
                <View style={{ width: 40, height: 56, alignItems: 'flex-end', justifyContent: 'center' }}>
                  <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 24, height: 24 }} onPress={this.removeBTCAddress.bind(this, id)}>
                    <Image
                      source={require('resources/images/remove_circle_grey_android.png')}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableHighlight>
                </View>
                <View style={{ width: Dimensions.get('window').width - 40 }}>
                  <Field
                    label={t(this,'{symbol} 地址',{symbol:'BTC'}).replace(/\s+/g,"")}
                    placeholder={t(this,'必填')}
                    name={`btc_address_${id}`}
                    fieldName={`btc_address_${id}`}
                    change={change}
                    component={OutlinedTextField}
                    nonEmpty={!!formValues && formValues[`btc_address_${id}`] && formValues[`btc_address_${id}`].length > 0}
                    autoFocus={!editMode || id > contact.btc.length - 1}
                    autoCapitalize="none"
                  />
                </View>
              </View>
             )}
        <TouchableNativeFeedback onPress={this.addBTCAddress} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
          <View style={{ width: '100%', height: 48, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ paddingHorizontal: 16 }}>
              <Image
                source={require('resources/images/add_circle_grey_android.png')}
                style={{ width: 24, height: 24 }}
              />
            </View>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,"添加{symbol}地址",{symbol:'BTC'})}</Text>
          </View>
        </TouchableNativeFeedback>
          </View>
          <View style={{ width: '100%' }}>
            {this.state.ethIds.map((id, index) =>
              <View key={id} style={{ width: '100%', flexDirection: 'row' }}>
                <View style={{ width: 40, height: 56, alignItems: 'flex-end', justifyContent: 'center' }}>
                  <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 24, height: 24 }} onPress={this.removeETHAddress.bind(this, id)}>
                    <Image
                      source={require('resources/images/remove_circle_grey_android.png')}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableHighlight>
                </View>
                <View style={{ width: Dimensions.get('window').width - 40 }}>
                  <Field
                    label={t(this,'{symbol} 地址',{symbol:'ETH'}).replace(/\s+/g,"")}
                    placeholder={t(this,'必填')}
                    name={`eth_address_${id}`}
                    fieldName={`eth_address_${id}`}
                    change={change}
                    component={OutlinedTextField}
                    nonEmpty={!!formValues && formValues[`eth_address_${id}`] && formValues[`eth_address_${id}`].length > 0}
                    autoFocus={!editMode || id > contact.eth.length - 1}
                    autoCapitalize="none"
                  />
                </View>
              </View>
             )}
        <TouchableNativeFeedback onPress={this.addETHAddress} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
          <View style={{ width: '100%', height: 48, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ paddingHorizontal: 16 }}>
              <Image
                source={require('resources/images/add_circle_grey_android.png')}
                style={{ width: 24, height: 24 }}
              />
            </View>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,"添加{symbol}地址",{symbol:'ETH'})}</Text>
          </View>
        </TouchableNativeFeedback>
          </View>
        <View style={{ width: '100%' }}>
           {this.state.eosIds.map((id, index) =>
             <View key={id} style={{ width: '100%', flexDirection: 'row' }}>
                <View style={{ width: 40, height: 56, alignItems: 'flex-end', justifyContent: 'center' }}>
                <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 24, height: 24 }} onPress={this.removeRIOAddress.bind(this, id)}>
                    <Image
                      source={require('resources/images/remove_circle_grey_android.png')}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableHighlight>
                </View>
                <View style={{ width: (Dimensions.get('window').width - 40) / 2 }}>
                  <Field
                    label={t(this,'{symbol} 地址',{symbol:'RioChain'}).replace(/\s+/g,"")}
                    placeholder={t(this,'必填')}
                    name={`rio_address_${id}`}
                    fieldName={`rio_address_${id}`}
                    change={change}
                    component={OutlinedTextField}
                    containerStyle={{ paddingRight: 8 }}
                    nonEmpty={!!formValues && formValues[`rio_address_${id}`] && formValues[`rio_address_${id}`].length > 0}
                    autoFocus={!editMode || id > contact.eos.length - 1}
                    autoCapitalize="none"
                  />
                </View>
              </View>
             )}

        <TouchableNativeFeedback onPress={this.addRIOAddress} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
          <View style={{ width: '100%', height: 48, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ paddingHorizontal: 16 }}>
              <Image
                source={require('resources/images/add_circle_grey_android.png')}
                style={{ width: 24, height: 24 }}
              />
            </View>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>{t(this,"添加{symbol}地址",{symbol:'RioChain'})}</Text>
          </View>
        </TouchableNativeFeedback>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
