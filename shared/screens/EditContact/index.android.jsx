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
import { validateBTCAddress, validateETHAddress, validateEOSAccountName } from 'utils/validate'
import { findDuplicate } from 'utils'
import { OutlinedTextField } from 'components/Form'

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Invalid password':
      return '密码错误'
    default:
      return '操作失败'
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = '请输入姓名'
  } else if (!values.name.trim().length) {
    errors.name = '请输入姓名'
  } else if (values.name.trim().length > 50) {
    errors.name = '姓名不超过50个字符'
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
    eosIds: [],
    lastBTCId: 0,
    lastETHId: 0,
    lastEOSId: 0
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      // Keyboard.dismiss()
      Navigation.pop(this.props.componentId)
    } else if (buttonId === 'done') {
      const { formSyncWarnings, formValues } = this.props

      if (!formValues || !formValues.name || !formValues.name.trim().length) {
        Alert.alert(
          '请输入姓名',
          '',
          [
            { text: '确定', onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }

      const btc = []
      const eth = []
      const eos = []

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

      this.state.eosIds.forEach((value) => {
        if (formValues[`eos_accountName_${value}`]) {
          eos.push({ accountName: formValues[`eos_accountName_${value}`] })
        }
      })

      if (!btc.length && !eth.length && !eos.length) {
        Alert.alert(
          '请添加地址或账户名',
          '',
          [
            { text: '确定', onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }

      for (let i = 0; i < btc.length; i++) {
        if (!validateBTCAddress(btc[i].address)) {
          Alert.alert(
            '无效的BTC地址',
            btc[i].address,
            [
              { text: '确定', onPress: () => console.log('OK Pressed') }
            ]
          )
          return
        }
      }

      for (let i = 0; i < eth.length; i++) {
        if (!validateETHAddress(eth[i].address)) {
          Alert.alert(
            '无效的ETH地址',
            eth[i].address,
            [
              { text: '确定', onPress: () => console.log('OK Pressed') }
            ]
          )
          return
        }
      }

      for (let i = 0; i < eos.length; i++) {
        if (!validateEOSAccountName(eos[i].accountName)) {
          Alert.alert(
            '无效的EOS账户名',
            eos[i].accountName,
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
          '重复添加的BTC地址',
          btcDuplicate,
          [
            { text: '确定', onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }

      const ethAddresses = eth.map(item => item.address)
      const ethDuplicate = findDuplicate(ethAddresses)
      if (ethDuplicate) {
        Alert.alert(
          '重复添加的ETHC地址',
          ethDuplicate,
          [
            { text: '确定', onPress: () => console.log('OK Pressed') }
          ]
        )
        return
      }

      const eosAddresses = eos.map(item => item.accountName)
      const eosDuplicate = findDuplicate(eosAddresses)
      if (eosDuplicate) {
        Alert.alert(
          '重复添加的EOS账户名',
          eosDuplicate,
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
    const eos = []

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

    this.state.eosIds.forEach((value) => {
      if (data[`eos_accountName_${value}`]) {
        eos.push({ accountName: data[`eos_accountName_${value}`], memo: data[`eos_memo_${value}`] && data[`eos_memo_${value}`].trim() })
      }
    })

    if (this.props.editMode && this.props.contact) {
      this.props.actions.addContact({
        id: this.props.contact.id,
        name: data.name.trim(),
        description: data.description && data.description.trim(),
        btc,
        eth,
        eos
      })
    } else {
      this.props.actions.addContact({
        id: this.props.id || uuidv4(),
        name: data.name.trim(),
        description: data.description && data.description.trim(),
        btc,
        eth,
        eos
      })
    }

    Navigation.pop(this.props.componentId)
  }

  clearError = () => {

  }

  onModalHide = () => {

  }

  addEOSAccountName = () => {
    this.setState({ eosIds: [...this.state.eosIds, this.state.lastEOSId + 1], lastEOSId: this.state.lastEOSId + 1 })
  }

  addBTCAddress = () => {
    this.setState({ btcIds: [...this.state.btcIds, this.state.lastBTCId + 1], lastBTCId: this.state.lastBTCId + 1 })
  }

  addETHAddress = () => {
    this.setState({ ethIds: [...this.state.ethIds, this.state.lastETHId + 1], lastETHId: this.state.lastETHId + 1 })
  }

  removeEOSAccountName = (id) => {
    this.setState({ eosIds: this.state.eosIds.filter(item => item !== id) })
    this.props.change(`eos_accountName_${id}`, null)
  }

  removeBTCAddress = (id) => {
    this.setState({ btcIds: this.state.btcIds.filter(item => item !== id) })
    this.props.change(`btc_address_${id}`, null)
  }

  removeETHAddress = (id) => {
    this.setState({ ethIds: this.state.ethIds.filter(item => item !== id) })
    this.props.change(`eth_address_${id}`, null)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.btcIds.length !== this.state.btcIds.length
      || prevState.ethIds.length !== this.state.ethIds.length
      || prevState.eosIds.length !== this.state.eosIds.length
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

      if (this.props.contact.eos.length) {
        const eosIds = []

        for (let i = 0; i < this.props.contact.eos.length; i++) {
          this.props.change(`eos_accountName_${i}`, this.props.contact.eos[i].accountName)
          if (this.props.contact.eos[i].memo) {
            this.props.change(`eos_memo_${i}`, this.props.contact.eos[i].memo)
          }

          eosIds.push(i)
        }

        this.setState({ eosIds })
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
                  label="姓名"
                  placeholder="必填"
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
                  label="描述"
                  placeholder="选填"
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
                    label="BTC地址"
                    placeholder="必填"
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
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>添加BTC地址</Text>
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
                    label="ETH地址"
                    placeholder="必填"
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
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>添加ETH地址</Text>
          </View>
        </TouchableNativeFeedback>
          </View>
          <View style={{ width: '100%' }}>
            {this.state.eosIds.map((id, index) =>
              <View key={id} style={{ width: '100%', flexDirection: 'row' }}>
                <View style={{ width: 40, height: 56, alignItems: 'flex-end', justifyContent: 'center' }}>
                  <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 24, height: 24 }} onPress={this.removeEOSAccountName.bind(this, id)}>
                    <Image
                      source={require('resources/images/remove_circle_grey_android.png')}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableHighlight>
                </View>
                <View style={{ width: (Dimensions.get('window').width - 40) / 2 }}>
                  <Field
                    label="EOS账户名"
                    placeholder="必填"
                    name={`eos_accountName_${id}`}
                    fieldName={`eos_accountName_${id}`}
                    change={change}
                    component={OutlinedTextField}
                    containerStyle={{ paddingRight: 8 }}
                    nonEmpty={!!formValues && formValues[`eos_accountName_${id}`] && formValues[`eos_accountName_${id}`].length > 0}
                    autoFocus={!editMode || id > contact.eos.length - 1}
                    autoCapitalize="none"
                  />
                </View>
                <View style={{ width: (Dimensions.get('window').width - 40) / 2 }}>
                  <Field
                    label="默认备注"
                    placeholder="选填"
                    name={`eos_memo_${id}`}
                    fieldName={`eos_memo_${id}`}
                    change={change}
                    component={OutlinedTextField}
                    containerStyle={{ paddingLeft: 8 }}
                    nonEmpty={!!formValues && formValues[`eos_memo_${id}`] && formValues[`eos_memo_${id}`].length > 0}
                    autoFocus={false}
                    autoCapitalize="none"
                  />
                </View>
              </View>
             )}

        <TouchableNativeFeedback onPress={this.addEOSAccountName} background={TouchableNativeFeedback.SelectableBackground()} useForeground={true}>
          <View style={{ width: '100%', height: 48, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ paddingHorizontal: 16 }}>
              <Image
                source={require('resources/images/add_circle_grey_android.png')}
                style={{ width: 24, height: 24 }}
              />
            </View>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>添加EOS地址</Text>
          </View>
        </TouchableNativeFeedback>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
