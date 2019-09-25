import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  Keyboard,
  Alert,
  ActivityIndicator,
  Dimensions,
  Clipboard
} from 'react-native'
import { injectIntl } from 'react-intl'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Field, reduxForm, getFormValues, getFormSyncWarnings } from 'redux-form'
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode-svg'
import { identityEOSWalletSelector } from 'selectors/wallet'
import * as walletActions from 'actions/wallet'
import { FilledTextField } from 'components/Form'
import * as accountActions from 'actions/account'
import IndicatorModal from 'components/Modal/IndicatorModal'

const validate = (values) => {
  const errors = {}

  if (!values.accountName) {
    errors.accountName = '请输入账户名'
  } else if (values.accountName.length !== 12) {
    errors.accountName = '账户名长度为12位'
  } else if (!/^[a-z1-5\s]+$/.test(values.accountName)) {
    errors.accountName = '账户名由a-z与1-5字符组成'
  }

  return errors
}

const warn = (values) => {
  const warnings = {}

  return warnings
}

const shouldError = () => true

@reduxForm({ form: 'createEOSAccountByContractForm', validate, shouldError, warn })

@connect(
  state => ({
    createEOSAccount: state.createEOSAccount,
    formSyncWarnings: getFormSyncWarnings('createEOSAccountByContractForm')(state),
    formValues: getFormValues('createEOSAccountByContractForm')(state),
    wallet: identityEOSWalletSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
    }, dispatch)
  })
)

export default class CreateEOSAccountByContractForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.activeIndex !== prevState.activeIndex) {
      return {
        activeIndex: nextProps.activeIndex,
      }
    } else {
      return null
    }
  }

  state = {
    activeIndex: 0,
    showModal: false
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeIndex !== this.state.activeIndex && this.state.activeIndex === 2) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: []
        }
      })
    }
  }

  copy = (text) => {
    this.setState({ showModal: true, showModalContent: true }, () => {
      Clipboard.setString(text)

      setTimeout(() => {
        this.setState({ showModal: false })
      }, 1000)
    })
  }

  render() {
    const { formValues, change, wallet } = this.props
    const accountName = formValues && formValues.accountName
    const inviteCode = formValues && formValues.inviteCode
    const qrValue = { account: accountName, active: wallet.publicKeys[0], owner: wallet.publicKeys[0], blockchain: 'eos' }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ paddingTop: 0 }}>
            {wallet && wallet.publicKeys && wallet.publicKeys.length && <Fragment>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 }}>
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>公钥</Text>
              </View>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={{ width: '100%', alignItems: 'flex-start', height: 60, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 16, marginRight: 16, width: 60, color: 'rgba(0,0,0,0.87)' }}>Owner</Text>
                  <View style={{ width: Dimensions.get('window').width - 48 - 60 - 16 }}>
                    <TouchableHighlight underlayColor="rgba(255,255,255,0)" onPress={this.copy.bind(this, wallet.publicKeys[0])}>
                      <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>
                          {`${wallet.publicKeys[0]} `}
                        </Text>
                        <Image source={require('resources/images/copy_grey_android.png')} style={{ width: 14, height: 14, marginTop: 4 }} />
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
                <View style={{ width: '100%', alignItems: 'flex-start', height: 60, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 16, marginRight: 16, width: 60, color: 'rgba(0,0,0,0.87)' }}>Active</Text>
                  <View style={{ width: Dimensions.get('window').width - 48 - 60 - 16 }}>
                    <TouchableHighlight underlayColor="rgba(255,255,255,0)" onPress={this.copy.bind(this, wallet.publicKeys[0])}>
                      <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>
                          {`${wallet.publicKeys[0]} `}
                        </Text>
                        <Image source={require('resources/images/copy_grey_android.png')} style={{ width: 14, height: 14, marginTop: 4 }} />
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </Fragment>}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
          <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>注册信息</Text>
        </View>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Field
            label="账户名"
            placeholder="a-z 与 1-5 组合的12位字符"
            name="accountName"
            fieldName="accountName"
            component={FilledTextField}
            change={change}
            nonEmpty={!!accountName && accountName.length > 0}
          />
        </View>
        {wallet && wallet.publicKeys && wallet.publicKeys.length && <Fragment>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }}>
            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.87)' }}>合约信息</Text>
          </View>
          <View style={{ width: '100%', alignItems: 'center', backgroundColor: 'white' }}>
            <View style={{ width: '100%', alignItems: 'center', height: 44, paddingLeft: 16, paddingRight: 16, flexDirection: 'row', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, marginRight: 16, width: 60, color: 'rgba(0,0,0,0.87)' }}>名称</Text>
              <View style={{ marginRight: 16, width: Dimensions.get('window').width - 50 - 32 - 46 }}>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" onPress={this.copy.bind(this, 'signupeoseos')}>
                  <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.54)' }}>
                    {`signupeoseos `}
                    <Image source={require('resources/images/copy_grey_android.png')} style={{ width: 14, height: 14, marginTop: 4 }} />
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{ width: '100%', alignItems: 'flex-start', height: 60, paddingLeft: 16, paddingRight: 16, flexDirection: 'row' }}>
              <Text style={{ fontSize: 16, marginRight: 16, width: 60, color: 'rgba(0,0,0,0.87)' }}>备注</Text>
              <View style={{ marginRight: 16, width: Dimensions.get('window').width - 50 - 32 - 46 }}>
                <TouchableHighlight underlayColor="rgba(255,255,255,0)" onPress={this.copy.bind(this, `${accountName || ''}-${wallet.publicKeys[0]}`)}>
                  <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                    <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.54)' }}>
                      {`${accountName || ''}-${wallet.publicKeys[0]} `}
                    </Text>
                    <Image source={require('resources/images/copy_grey_android.png')} style={{ width: 14, height: 14, marginTop: 4 }} />
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Fragment>}
          </View>
        </ScrollView>
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
              <Text style={{ fontSize: 14, color: 'white' }}>已复制</Text>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}
