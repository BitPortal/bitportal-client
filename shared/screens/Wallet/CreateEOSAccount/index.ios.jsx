import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  SegmentedControlIOS,
  TouchableHighlight,
  Keyboard,
  Alert,
  ActivityIndicator,
  Dimensions,
  Clipboard,
  SafeAreaView
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode-svg'
import { identityEOSWalletSelector } from 'selectors/wallet'
import Sound from 'react-native-sound'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'

const copySound = new Sound('copy.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error)
    return
  }

  console.log(`duration in seconds: ${copySound.getDuration()}number of channels: ${copySound.getNumberOfChannels()}`)
})

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
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
    width: '100% - 138'
  },
  textAreaFiled: {
    height: '100%',
    fontSize: 17,
    width: '100% - 52'
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
  }
})

const TextField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  label,
  placeholder,
  separator,
  secureTextEntry,
  fieldName,
  change,
  showClearButton
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <Text style={{ fontSize: 17, marginRight: 16, width: 70 }}>{label}</Text>
    <TextInput
      style={styles.textFiled}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      secureTextEntry={secureTextEntry}
      {...restInput}
    />
    {showClearButton && active && <View style={{ height: '100%', position: 'absolute', right: 16, top: 0, width: 20, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
    {separator && <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />}
  </View>
)

const TextAreaField = ({
  input: { onChange, ...restInput },
  meta: { touched, error, active },
  placeholder,
  fieldName,
  change,
  showClearButton
}) => (
  <View style={{ width: '100%', alignItems: 'center', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
    <TextInput
      style={styles.textAreaFiled}
      autoCorrect={false}
      autoCapitalize="none"
      placeholder={placeholder}
      onChangeText={onChange}
      {...restInput}
    />
    {showClearButton && active && <View style={{ position: 'absolute', right: 13, top: 0, width: 20, height: 44, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight underlayColor="rgba(255,255,255,0)" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.42} onPress={() => change(fieldName, null)}>
        <FastImage
          source={require('resources/images/clear.png')}
          style={{ width: 14, height: 14 }}
        />
      </TouchableHighlight>
    </View>}
  </View>
)

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Account name already exists':
      return '账户名已存在'
    case 'Invalid private key!':
      return '私钥无效，请导入有效的私钥'
    case 'Campaign is for invitation only':
      return '该活动仅向受邀用户开放'
    case 'Campaign is for eos only':
      return '该活动仅适用于EOS'
    case 'Unknown invitation Code':
      return '无效的注册码'
    case 'Coupon code is used':
      return '注册码已使用'
    case 'Error retrieving data':
      return '数据提取错误，请重新创建'
    default:
      return '创建失败'
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.accountName) {
    errors.accountName = '请输入账户名'
  }

  if (!values.inviteCode) {
    errors.inviteCode = '请输入邀请码'
  }

  return errors
}

const warn = (values) => {
  const warnings = {}

  if (!values.accountName) {
    warnings.accountName = '账户名不能为空'
  } else if (values.accountName.length !== 12) {
    warnings.accountName = '账户名长度为12位'
  } else if (!/^[a-z1-5\s]+$/.test(values.accountName)) {
    warnings.accountName = '账户名由a-z与1-5字符组成'
  } else if (!values.inviteCode) {
    warnings.inviteCode = '邀请码不能为空'
  } else if (values.inviteCode.trim().length !== 5) {
    warnings.inviteCode = '邀请码长度为5位'
  }

  return warnings
}

const shouldError = () => true

@reduxForm({ form: 'createEOSAccountForm', validate, shouldError, warn })

@connect(
  state => ({
    createEOSAccount: state.createEOSAccount,
    formSyncWarnings: getFormSyncWarnings('createEOSAccountForm')(state),
    formValues: getFormValues('createEOSAccountForm')(state),
    wallet: identityEOSWalletSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
    }, dispatch)
  })
)

export default class CreateEOSAccount extends Component {
  static get options() {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'submit',
            text: '确认',
            fontWeight: '400',
            enabled: false
          }
        ],
        largeTitle: {
          visible: false
        },
        backButton: {
          title: '返回'
        },
        title: {
          text: '创建EOS帐户'
        },
        noBorder: true,
        drawBehind: false
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.invalid !== prevState.invalid
      || nextProps.pristine !== prevState.pristine
      || nextProps.createEOSAccount.loading !== prevState.createEOSAccountLoading
      || nextProps.createEOSAccount.error !== prevState.createEOSAccountError
    ) {
      return {
        invalid: nextProps.invalid,
        pristine: nextProps.pristine,
        createEOSAccountLoading: nextProps.createEOSAccount.loading,
        createEOSAccountError: nextProps.createEOSAccount.error
      }
    } else {
      return null
    }
  }

  state = {
    selectedIndex: 0,
    createEOSAccountLoading: false,
    invalid: false,
    pristine: false,
    createEOSAccountError: null,
    showModal: false,
    showModalContent: false
  }

  subscription = Navigation.events().bindComponent(this)

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'submit') {
      const { formSyncWarnings } = this.props
      if (typeof formSyncWarnings === 'object') {
        const warning = formSyncWarnings.accountName || formSyncWarnings.inviteCode
        if (warning) {
          Alert.alert(
            warning,
            '',
            [
              { text: '确定', onPress: () => console.log('OK Pressed') }
            ]
          )
          return
        }
      }

      Keyboard.dismiss()
      this.props.handleSubmit(this.submit)()
    }
  }

  submit = (data) => {
    const { wallet } = this.props
    const publicKey = wallet && wallet.publicKeys && wallet.publicKeys.length && wallet.publicKeys[0]

    if (!!publicKey && this.state.selectedIndex === 0) {
      this.props.actions.createEOSAccount.requested({
        ...data,
        ownerKey: publicKey,
        activeKey: publicKey,
        componentId: this.props.componentId,
        delay: 500
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.invalid !== this.state.invalid
      || prevState.pristine !== this.state.pristine
      || prevState.createEOSAccountLoading !== this.state.createEOSAccountLoading
      || prevState.selectedIndex !== this.state.selectedIndex
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: this.state.selectedIndex === 0 ? [
            {
              id: 'submit',
              text: '确认',
              fontWeight: '400',
              enabled: !this.state.invalid && !this.state.pristine && !this.state.createEOSAccountLoading
            }
          ] : [
            /* {
             *   id: 'share',
             *   text: '分享',
             *   fontWeight: '400',
             *   enabled: !this.state.invalid && !this.state.pristine && !this.state.createEOSAccountLoading
             * }*/
          ]
        }
      })
    }
  }

  componentDidMount() {
    // this.props.actions.createEOSAccount.failed()
  }

  copy = (text) => {
    this.setState({ showModal: true, showModalContent: true }, () => {
      Clipboard.setString(text)
      copySound.play((success) => {
        if (success) {
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
          copySound.reset()
        }
      })

      setTimeout(() => {
        this.setState({ showModal: false }, () => {
          this.setState({ showModalContent: false })
        })
      }, 1000)
    })
  }

  clearError = () => {
    if (this.state.selectedIndex === 0) {
      this.props.actions.createEOSAccount.clearError()
    }
  }

  onModalHide = () => {
    const error = this.state.createEOSAccountError

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          '',
          [
            { text: '确定', onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  changeSelectedIndex = (e) => {
    this.setState({ selectedIndex: e.nativeEvent.selectedSegmentIndex })
  }

  render() {
    const { formValues, change, wallet } = this.props
    const accountName = formValues && formValues.accountName
    const inviteCode = formValues && formValues.inviteCode
    const qrValue = `eos:createAccount?name=${accountName || ''}&active=${wallet.publicKeys[0] || ''}&owner=${wallet.publicKeys[0] || ''}`

    return (
      <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ height: 52, width: '100%', justifyContent: 'center', paddingTop: 5, paddingBottom: 13, paddingLeft: 16, paddingRight: 16, backgroundColor: '#F7F7F7', borderColor: '#C8C7CC', borderBottomWidth: 0.5 }}>
          <SegmentedControlIOS
            values={['邀请码', '好友协助', '智能合约']}
            selectedIndex={this.state.selectedIndex}
            onChange={this.changeSelectedIndex}
            style={{ width: '100%' }}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            {wallet && wallet.publicKeys && wallet.publicKeys.length && <Fragment>
              <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 13, color: '#666666' }}>公钥</Text>
              </View>
              <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: 'white' }}>
                <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 , paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 17, marginRight: 16, width: 70 }}>Owner</Text>
                  <View style={{ marginRight: 16, width: Dimensions.get('window').width - 50 - 32 - 36 }}>
                    <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, wallet.publicKeys[0])}>
                      <Text style={{ fontSize: 15 }}>
                        {`${wallet.publicKeys[0]} `}
                        <Image
                          source={require('resources/images/copy_black.png')}
                          style={{ width: 18, height: 18 }}
                        />
                      </Text>
                    </TouchableHighlight>
                  </View>
                  <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />
                </View>
                <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 , paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 17, marginRight: 16, width: 70 }}>Active</Text>
                  <View style={{ marginRight: 16, width: Dimensions.get('window').width - 50 - 32 - 36 }}>
                    <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, wallet.publicKeys[0])}>
                      <Text style={{ fontSize: 15 }}>
                        {`${wallet.publicKeys[0]} `}
                        <Image
                          source={require('resources/images/copy_black.png')}
                          style={{ width: 18, height: 18 }}
                        />
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </Fragment>}
        <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
          <Text style={{ fontSize: 13, color: '#666666' }}>注册信息</Text>
        </View>
        <Fragment>
          <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: 'white' }}>
            <Field
              label="账户名"
              placeholder="a-z 与 1-5 组合的12位字符"
              name="accountName"
              fieldName="accountName"
              component={TextField}
              change={change}
              showClearButton={!!accountName && accountName.length > 0}
              separator={this.state.selectedIndex === 0}
            />
            {this.state.selectedIndex === 0 && <Field
              label="邀请码"
              placeholder="必填"
              name="inviteCode"
              fieldName="inviteCode"
              component={TextField}
              change={change}
              showClearButton={!!inviteCode && inviteCode.length > 0}
            />}
          </View>
        </Fragment>
        {wallet && wallet.publicKeys && wallet.publicKeys.length && this.state.selectedIndex === 1 && <Fragment>
          <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 13, color: '#666666' }}>扫码信息</Text>
          </View>
          <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: 'white' }}>
            <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 16, paddingBottom: 16 , paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
              <View style={{ backgroundColor: 'white' }}>
                <QRCode
                  value={qrValue}
                  size={120}
                  color="black"
                />
              </View>
              <View style={{ marginLeft: 16, width: Dimensions.get('window').width - 120 - 32 - 16, height: 120 }}>
                <Text style={{ fontSize: 17, marginBottom: 12 }}>如何协助注册？</Text>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.42)', marginBottom: 6, lineHeight: 17 }}>1. 填写EOS账户名，分享二维码给好友</Text>
                <Text style={{ fontSize: 15, color: 'rgba(0,0,0,0.42)', lineHeight: 17 }}>2. 好友扫码支付EOS，完成EOS账户注册</Text>
              </View>
            </View>
          </View>
        </Fragment>}
        {wallet && wallet.publicKeys && wallet.publicKeys.length && this.state.selectedIndex === 2 && <Fragment>
          <View style={{ width: '100%', height: 40, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6, justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 13, color: '#666666' }}>合约信息</Text>
          </View>
          <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#C8C7CC', backgroundColor: 'white' }}>
            <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 , paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
              <Text style={{ fontSize: 17, marginRight: 16, width: 70 }}>名称</Text>
              <View style={{ marginRight: 16, width: Dimensions.get('window').width - 50 - 32 - 36 }}>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, 'signupeoseos')}>
                  <Text style={{ fontSize: 15 }}>
                    {`signupeoseos `}
                    <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18 }}
                    />
                  </Text>
                </TouchableHighlight>
              </View>
              <View style={{ position: 'absolute', height: 0.5, bottom: 0, right: 0, left: 16, backgroundColor: '#C8C7CC' }} />
            </View>
            <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 , paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
              <Text style={{ fontSize: 17, marginRight: 16, width: 70 }}>备注</Text>
              <View style={{ marginRight: 16, width: Dimensions.get('window').width - 50 - 32 - 36 }}>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={this.copy.bind(this, `${accountName}-${wallet.publicKeys[0]}`)}>
                  <Text style={{ fontSize: 15 }}>
                    {`${accountName || ''}-${wallet.publicKeys[0]} `}
                    <Image
                      source={require('resources/images/copy_black.png')}
                      style={{ width: 18, height: 18 }}
                    />
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Fragment>}
          </View>
        </ScrollView>
        <Modal
          isVisible={this.state.createEOSAccountLoading}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
          onModalHide={this.onModalHide}
          onModalShow={this.onModalShow}
        >
          {this.state.createEOSAccountLoading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#000000" />
              <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>创建中...</Text>
            </View>
          </View>}
        </Modal>
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
        >
          {this.state.showModalContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>已复制</Text>
            </View>
          </View>}
        </Modal>
      </View>
      </SafeAreaView>
    )
  }
}
