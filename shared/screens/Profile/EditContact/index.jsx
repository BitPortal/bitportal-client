import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { View, ScrollView, ActionSheetIOS, Alert, Text, ActivityIndicator, Animated, TextInput, TouchableHighlight, Image, Keyboard, LayoutAnimation } from 'react-native'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import { Navigation } from 'react-native-navigation'
import TableView from 'react-native-tableview'
import * as contactActions from 'actions/contact'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import uuidv4 from 'uuid/v4'
import { validateBTCAddress, validateETHAddress, validateEOSAccountName } from 'utils/validate'
import { findDuplicate } from 'utils'
import styles from './styles'

const { Section, Item } = TableView

const TextField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  placeholder,
  separator,
  secureTextEntry,
  fieldName,
  change,
  showClearButton,
  switchable,
  onSwitch,
  clearButtonRight,
  autoFocus,
  autoCapitalize
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 40, paddingRight: 16, flexDirection: 'row' }}>
    {!!label && !!switchable &&
     <View style={{ borderRightWidth: 0.5, borderColor: '#C8C7CC', height: '100%', width: 42, justifyContent: 'center', alignItems: 'center', paddingRight: 10 }}>
       <Text style={{ width: 30, height: '100%', justifyContent: 'center', alignItems: 'center', fontSize: 15, lineHeight: 40 }} numberOfLines={1}>{label}</Text>
     </View>
    }
    <TextInput
      style={{ width: '100%', height: '100%', fontSize: 17, paddingLeft: 16, paddingRight: clearButtonRight || 78 }}
      autoCorrect={false}
      autoCapitalize={autoCapitalize}
      placeholder={placeholder}
      onChangeText={onChange}
      secureTextEntry={secureTextEntry}
      autoFocus={autoFocus}
      {...restInput}
    />
    {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: clearButtonRight || 38, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.36)' }} />}
  </View>
)

const MiniTextField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  placeholder,
  separator,
  secureTextEntry,
  fieldName,
  change,
  showClearButton,
  switchable,
  onSwitch,
  clearButtonRight,
  autoFocus,
  autoCapitalize,
  rightBorder
}) => (
  <View style={{ flex: 1, alignItems: 'center', height: 40, paddingRight: 16, flexDirection: 'row', borderRightWidth: rightBorder ? 0.5 : 0, borderColor: '#C8C7CC' }}>
    <TextInput
      style={{ width: '100%', height: '100%', fontSize: 17, paddingLeft: 16, paddingRight: clearButtonRight || 78 }}
      autoCorrect={false}
      autoCapitalize={autoCapitalize}
      placeholder={placeholder}
      onChangeText={onChange}
      secureTextEntry={secureTextEntry}
      autoFocus={autoFocus}
      {...restInput}
    />
    {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: clearButtonRight || 38, top: 0, width: 20, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.36)' }} />}
  </View>
)

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

  /* if (!values.name) {
   *   errors.name = '请输入姓名'
   * }*/

  return errors
}

const warn = (values) => {

  const warnings = {}

  if (!values.name) {
    warnings.name = '请输入姓名'
  } else if (!values.name.trim().length) {
    warnings.name = '请输入姓名'
  } else if (values.name.trim().length > 50) {
    warnings.name = '姓名不超过50个字符'
  }

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

export default class MyIdentity extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        },
        title: {
          text: ''
        },
        leftButtons: [
          {
            id: 'cancel',
            text: '取消'
          }
        ],
        rightButtons: [
          {
            id: 'done',
            fontWeight: '400',
            text: '完成'
          }
        ],
        noBorder: true,
        background: {
          color: 'white',
          translucent: true
        }
      },
      bottomTabs: {
        visible: false
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
      Navigation.dismissModal(this.props.componentId)
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

    Navigation.dismissModal(this.props.componentId)
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
  }

  render() {
    const { formValues, change, contact, editMode } = this.props
    const name = formValues && formValues.name
    const description = formValues && formValues.description

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ width: '100%', height: 0.5, backgroundColor: 'rgba(0,0,0,0)' }} />
        <ScrollView
          style={{ flex: 1, backgroundColor: 'white' }}
          showsVerticalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: '100%', paddingLeft: 16, flexDirection: 'row', paddingBottom: 30 }}>
            <View style={{ width: 41, height: 41, marginRight: 16 }}>
              <FastImage
                source={require('resources/images/Userpic2.png')}
                style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)' }}
              />
            </View>
            <View>
              <Field
                label="姓名"
                placeholder="姓名"
                name="name"
                fieldName="name"
                change={change}
                component={TextField}
                separator={true}
                showClearButton={!!name && name.length > 0}
                clearButtonRight={64}
                autoFocus={!editMode}
                autoCapitalize="sentences"
              />
              <Field
                label="描述"
                placeholder="描述"
                name="description"
                fieldName="description"
                change={change}
                component={TextField}
                separator={true}
                clearButtonRight={64}
                showClearButton={!!description && description.length > 0}
                autoCapitalize="sentences"
              />
            </View>
          </View>
          <View style={{ width: '100%', marginTop: 40 }}>
            {this.state.btcIds.map((id, index) =>
              <View key={id} style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 16 }}>
                <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 28 * 0.8, height: 30 * 0.8, marginRight: 8 }} onPress={this.removeBTCAddress.bind(this, id)}>
                  <FastImage
                    source={require('resources/images/remove_red.png')}
                    style={{ width: 28 * 0.8, height: 30 * 0.8 }}
                  />
                </TouchableHighlight>
                <Field
                  label="BTC"
                  placeholder="地址"
                  name={`btc_address_${id}`}
                  fieldName={`btc_address_${id}`}
                  change={change}
                  component={TextField}
                  switchable
                  onSwitch={() => {}}
                  showClearButton={!!formValues && formValues[`btc_address_${id}`] && formValues[`btc_address_${id}`].length > 0}
                  autoFocus={!editMode || id > contact.btc.length - 1}
                  autoCapitalize="none"
                />
                {(index !== this.state.btcIds.length - 1) && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: 'rgba(0,0,0,0.36)' }} />}
              </View>
             )}
        <TouchableHighlight underlayColor="#D9D9D9" style={{ width: '100%', height: 40 }} onPress={this.addBTCAddress}>
            <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 16 }}>
              <FastImage
                source={require('resources/images/add_green.png')}
                style={{ width: 28 * 0.8, height: 30 * 0.8, marginRight: 8 }}
              />
              <Text style={{ fontSize: 15 }}>添加BTC地址</Text>
              <View style={{ position: 'absolute', height: 0.5, top: 0, right: 0, left: 16, backgroundColor: 'rgba(0,0,0,0.36)' }} />
              <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: 'rgba(0,0,0,0.36)' }} />
            </View>
        </TouchableHighlight>
          </View>
          <View style={{ width: '100%', marginTop: 40 }}>
            {this.state.ethIds.map((id, index) =>
              <View key={id} style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 16 }}>
                <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 28 * 0.8, height: 30 * 0.8, marginRight: 8 }} onPress={this.removeETHAddress.bind(this, id)}>
                  <FastImage
                    source={require('resources/images/remove_red.png')}
                    style={{ width: 28 * 0.8, height: 30 * 0.8 }}
                  />
                </TouchableHighlight>
                <Field
                  label="ETH"
                  placeholder="地址"
                  name={`eth_address_${id}`}
                  fieldName={`eth_address_${id}`}
                  change={change}
                  component={TextField}
                  switchable
                  onSwitch={() => {}}
                  showClearButton={!!formValues && formValues[`eth_address_${id}`] && formValues[`eth_address_${id}`].length > 0}
                  autoFocus={!editMode || id > contact.eth.length - 1}
                  autoCapitalize="none"
                />
                {(index !== this.state.ethIds.length - 1) && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: 'rgba(0,0,0,0.36)' }} />}
              </View>
             )}
        <TouchableHighlight underlayColor="#D9D9D9" style={{ width: '100%', height: 40 }} onPress={this.addETHAddress}>
            <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 16 }}>
              <FastImage
                source={require('resources/images/add_green.png')}
                style={{ width: 28 * 0.8, height: 30 * 0.8, marginRight: 8 }}
              />
              <Text style={{ fontSize: 15 }}>添加ETH地址</Text>
              <View style={{ position: 'absolute', height: 0.5, top: 0, right: 0, left: 16, backgroundColor: 'rgba(0,0,0,0.36)' }} />
              <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: 'rgba(0,0,0,0.36)' }} />
            </View>
        </TouchableHighlight>
          </View>
          <View style={{ width: '100%', marginTop: 40 }}>
          {this.state.eosIds.map((id, index) =>
            <View key={id} style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 16 }}>
              <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{ width: 28 * 0.8, height: 30 * 0.8, marginRight: 8 }} onPress={this.removeEOSAccountName.bind(this, id)}>
                <FastImage
                  source={require('resources/images/remove_red.png')}
                  style={{ width: 28 * 0.8, height: 30 * 0.8 }}
                />
              </TouchableHighlight>
              <View style={{ width: '100%', alignItems: 'center', height: 40, paddingRight: 16, flexDirection: 'row' }}>
                 <View style={{ borderRightWidth: 0.5, borderColor: '#C8C7CC', height: '100%', width: 42, justifyContent: 'center', alignItems: 'center', paddingRight: 10 }}>
                   <Text style={{ width: 30, height: '100%', justifyContent: 'center', alignItems: 'center', fontSize: 15, lineHeight: 40 }} numberOfLines={1}>EOS</Text>
                 </View>
                 <View style={{ flex: 1, height: 40, flexDirection: 'row' }}>
                   <Field
                     label="EOS"
                     placeholder="账户名"
                     name={`eos_accountName_${id}`}
                     fieldName={`eos_accountName_${id}`}
                     change={change}
                     component={MiniTextField}
                     switchable
                     onSwitch={() => {}}
                     showClearButton={!!formValues && formValues[`eos_accountName_${id}`] && formValues[`eos_accountName_${id}`].length > 0}
                     autoFocus={!editMode || id > contact.eos.length - 1}
                     autoCapitalize="none"
                     rightBorder
                     clearButtonRight={6}
                   />
                   <Field
                     label="EOS"
                     placeholder="默认备注"
                     name={`eos_memo_${id}`}
                     fieldName={`eos_memo_${id}`}
                     change={change}
                     component={MiniTextField}
                     switchable
                     onSwitch={() => {}}
                     showClearButton={!!formValues && formValues[`eos_memo_${id}`] && formValues[`eos_memo_${id}`].length > 0}
                     autoFocus={false}
                     autoCapitalize="none"
                     clearButtonRight={16}
                   />
                 </View>
              </View>
              {(index !== this.state.eosIds.length - 1) && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: 'rgba(0,0,0,0.36)' }} />}
            </View>
           )}
        <TouchableHighlight underlayColor="#D9D9D9" style={{ width: '100%', height: 40 }} onPress={this.addEOSAccountName}>
          <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 16 }}>
            <FastImage
              source={require('resources/images/add_green.png')}
              style={{ width: 28 * 0.8, height: 30 * 0.8, marginRight: 8 }}
            />
            <Text style={{ fontSize: 15 }}>添加EOS账户</Text>
            <View style={{ position: 'absolute', height: 0.5, top: 0, right: 0, left: 16, backgroundColor: 'rgba(0,0,0,0.36)' }} />
            <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: 'rgba(0,0,0,0.36)' }} />
          </View>
        </TouchableHighlight>
          </View>
      </ScrollView>
      </View>
    )
  }
}
