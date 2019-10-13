import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import {
  View,
  Text,
  Share,
  Linking,
  Platform,
  ActivityIndicator,
  InteractionManager,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  LayoutAnimation,
  ScrollView,
  Animated,
  Easing,
  TextInput,
  Switch,
  Alert
} from 'react-native'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import { FormattedMessage, IntlProvider, injectIntl } from 'react-intl'
import ActionSheet from 'react-native-actionsheet'
import Url from 'url-parse'
import * as bridgeActions from 'actions/bridge'
import * as dappActions from 'actions/dapp'
import SearchWebsiteForm from 'components/Form/SearchWebsiteForm'
import Modal from 'react-native-modal'
import { activeWalletSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector } from 'selectors/balance'
import globalMessages from 'resources/messages'
import { walletIcons } from 'resources/images'
import { dappBookmarkAllIdsSelector } from 'selectors/dapp'
import { hex_to_ascii } from 'utils'
import RNWebView from 'react-native-webview'
import IndicatorModal from 'components/Modal/IndicatorModal'
import localMessages from './messages'
import styles from './styles'

const messages = { ...globalMessages, ...localMessages }

const tabHeight = (() => {
  const isIphoneX = () => {
    let dimensions
    if (Platform.OS !== 'ios') {
      return false
    }
    if (Platform.isPad || Platform.isTVOS) {
      return false
    }
    dimensions = Dimensions.get('window')
    if (dimensions.height === 812 || dimensions.width === 812) { // Checks for iPhone X in portrait or landscape
      return true
    }
    if (dimensions.height === 896 || dimensions.width === 896) {
      return true
    }
    return false
  }

  if (isIphoneX()) {
    return 84 // iPhone X
  } else if (Platform.OS == 'ios') {
    return 50 // Other iPhones
  } else {
    return 56 // Android
  }
})()

const injectedJavascript = inject => `(function() {
  window.WebViewBridge = {
    onMessage: function() {
      return null;
    },
    send: function(data) {
      window.ReactNativeWebView.postMessage(data);
    },
  };
  var event = new Event('WebViewBridge');
  window.dispatchEvent(event);
  console.log('loaded');
  ${inject}
})()`

const generateOnMessageFunction = data => `(function() { window.WebViewBridge.onMessage('${data}'); })()`

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.webview_invalid_password
    default:
      return messages.webview_signing_failed
  }
}

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    messageToSend: state.bridge.messageToSend,
    hasPendingMessage: state.bridge.hasPendingMessage,
    loadingContract: state.bridge.loadingContract,
    pendingMessage: state.bridge.pendingMessage,
    resolving: state.bridge.resolving,
    error: state.bridge.error,
    activeWallet: activeWalletSelector(state),
    balance: activeWalletBalanceSelector(state),
    bookmarkedIds: dappBookmarkAllIdsSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...bridgeActions,
      ...dappActions
    }, dispatch)
  })
)

export default class WebView extends Component {
  static get options() {
    return {
      topBar: {
        rightButtonColor: 'white',
        rightButtons: [
          {
            id: 'share',
            icon: require('resources/images/share_android.png'),
            text: '分享',
            color: 'white'
          },
          {
            id: 'refresh',
            icon: require('resources/images/refresh_android.png'),
            text: '刷新',
            color: 'white'
          },
          {
            id: 'next',
            icon: require('resources/images/next_android.png'),
            text: '下一页'
          },

          {
            id: 'previous',
            icon: require('resources/images/previous_android.png'),
            text: '上一页'
          }
        ]
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.messageToSend !== prevState.messageToSend) {
      return {
        messageToSend: nextProps.messageToSend
      }
    } else {
      return null
    }
  }

  state = {
    showPrompt: false,
    hasPendingMessage: false,
    loadingContract: false,
    requirePassword: false,
    amountFontSize: new Animated.Value(30),
    actionFontSize: new Animated.Value(24),
    symbolFontSize: new Animated.Value(18),
    symbolMarginTop: new Animated.Value(5),
    amountLabelOpacity: new Animated.Value(0),
    amountContainerHeight: new Animated.Value(80),
    amountContainerPaddingVertical: new Animated.Value(25),
    amountMarginLeft: new Animated.Value((Dimensions.get('window').width - 0) / 2 - 18),
    passwordTextInputOpacity: new Animated.Value(0),
    whiteListOpacity: new Animated.Value(0),
    passwordValue: '',
    largeAmountWidth: 0,
    largeAmount: true,
    contractDataHeight: new Animated.Value(80),
    whiteListOpen: false,
    showSideCard: false,
    progress: new Animated.Value(0),
    progressOpacity: new Animated.Value(0),
    navigationHeight: 0,
    showBookmark: false,
    showBookmarkContent: false,
    showCancelBookmark: false,
    showCancelBookmarkContent: false,
    uri: 'https://build-prguimiryr.now.sh/'
  }

  subscription = Navigation.events().bindComponent(this)

  async componentDidMount() {
    this.props.actions.clearMessage()
    setTimeout(() => {
      this.setState({ showPrompt: true })
    }, 100)

    const constants = await Navigation.constants()
    this.setState({ navigationHeight: constants.statusBarHeight + 44 })

    this.onLoadStart()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.messageToSend && prevProps.messageToSend !== this.props.messageToSend && this.webviewbridge) {
      this.sendMessageToWebView(this.props.messageToSend)
    } else if (prevState.showSideCard !== this.state.showSideCard) {
      LayoutAnimation.easeInEaseOut()
    } else if (prevProps.error !== this.props.error && !!this.props.error) {
      Alert.alert(
        '密码错误',
        '',
        [
          { text: '确定', onPress: () => this.props.actions.clearPasswordError() }
        ]
      )
    }
  }

  sendMessageToWebView = (message) => {
    this.webviewbridge.injectJavaScript(generateOnMessageFunction(message))
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'refresh') {
      this.webviewbridge.reload()
      this.onLoadStart()
    } else if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    } else if (buttonId === 'previous') {
      this.goBack()
    } else if (buttonId === 'next') {
      this.goForward()
    } else if(buttonId === 'share') {
      this.share()
    }
  }

  textInput = React.createRef()

  share = async () => {
    try {
      const result = await Share.share({
        url: this.props.url, title: this.props.title
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

  showActionSheet = () => {
    this.actionSheet.show()
  }

  selectActionSheet = (index) => {
    switch (index) {
      case 0:
        this.share()
        break
      case 1:
        this.linking()
        break

      default:
        break
    }
  }

  linking = () => {
    const url = this.props.uri
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          // console.log(`Can't handle url: ${url}`);
        } else {
          console.log('open', url)
          Linking.openURL(url)
        }
      })
      .catch(err => console.error('An error occurred', err))
  }

  renderError = (e) => {
    if (e === 'WebKitErrorDomain') {
      return null
    }
    return (
      <View style={[styles.center, styles.content]}>
        <Text style={styles.text18}>
          加载失败
        </Text>
      </View>
    )
  }

  onNavigationStateChange = (navState) => {
    const url = new Url(navState.url)
    const hostname = url.hostname
    const host = hostname.indexOf('www.') === 0 ? hostname.replace('www.', '') : hostname
    this.props.actions.setHost(host)
  }

  onBridgeMessage = (event) => {
    this.props.actions.receiveMessage(event.nativeEvent.data)
  }

  rejectMessage = () => {
    this.props.actions.rejectMessage()
  }

  resolveMessage = (password) => {
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.resolveMessage({ password })
    })
  }

  closePrompt = () => {
    this.setState({ showPrompt: false })
    this.rejectMessage()
  }

  onModalHide = () => {
    setTimeout(() => {
      this.setState({ showPrompt: true, passwordValue: '' })
      this.enlargeAmount()
    }, 500)
  }

  onProgress = (e) => {
    const data = e.nativeEvent.progress
    if (data > 0 && data < 1) {
      Animated.timing(this.state.progress, {
        toValue: 0.1 * Dimensions.get('window').width + Dimensions.get('window').width * 0.9 * data,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }).start()
    } else if (data === 1) {
      this.onLoadEnd()
    }
  }

  onLoadStart = () => {
    Animated.sequence([
      Animated.timing(this.state.progressOpacity, {
        toValue: 1,
        duration: 10,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.progress, {
        toValue: 0.1 * Dimensions.get('window').width,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      })
    ]).start()
  }

  onLoadEnd = () => {
    Animated.sequence([
      Animated.timing(this.state.progress, {
        toValue: Dimensions.get('window').width,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.progressOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.progress, {
        toValue: 0,
        duration: 10,
        easing: Easing.inOut(Easing.quad)
      })
    ]).start()
  }

  onError = () => {
    this.onLoadEnd()
  }

  shareDapp = () => {
    try {
      Share.share({ url: this.props.url, title: this.props.title })
    } catch (e) {
      console.warn('share error --', e)
    }
  }

  onPasswordChange = (e) => {
    this.setState({ passwordValue: e })
  }

  onPasswordBlur = () => {
    if (!this.state.passwordValue) {
      this.enlargeAmount()
    }
  }

  goBack = () => {
    this.webviewbridge.goBack()
  }

  goForward = () => {
    this.webviewbridge.goForward()
  }

  enlargeAmount = () => {
    Animated.parallel([
      Animated.timing(this.state.amountFontSize, {
        toValue: 30,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.actionFontSize, {
        toValue: 24,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.symbolFontSize, {
        toValue: 18,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.symbolMarginTop, {
        toValue: 5,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.amountContainerHeight, {
        toValue: 80,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.amountContainerPaddingVertical, {
        toValue: 25,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.passwordTextInputOpacity, {
        toValue: 0,
        duration: 250,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.whiteListOpacity, {
        toValue: 0,
        duration: 150,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.amountLabelOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.amountMarginLeft, {
        toValue: (Dimensions.get('window').width - this.state.largeAmountWidth) / 2 - 18,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.contractDataHeight, {
        toValue: 80,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
    ]).start()

    this.setState({ largeAmount: true })
  }

  changeAmountSize = () => {
    if (!this.state.largeAmount) {
      this.enlargeAmount()
    } else {
      this.shrinkAmount()
      this.textInput.current.focus()
    }
  }

  shrinkAmount = () => {
    Animated.parallel([
      Animated.timing(this.state.amountFontSize, {
        toValue: 13,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.actionFontSize, {
        toValue: 13,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.symbolFontSize, {
        toValue: 13,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.symbolMarginTop, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.amountContainerHeight, {
        toValue: 44,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.amountContainerPaddingVertical, {
        toValue: 15,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.passwordTextInputOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.whiteListOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.amountLabelOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.amountMarginLeft, {
        toValue: 95,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.contractDataHeight, {
        toValue: 60,
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }),
    ]).start()

    this.setState({ largeAmount: false })
  }

  formatAddress = (address) => {
    if (address && address.length > 16) {
      return `${address.slice(0, 8)}....${address.slice(-8)}`
    } else {
      return address
    }
  }

  onWhiteListChange = (value) => {
    this.setState({ whiteListOpen: value })
  }

  toNext = () => {
    this.setState({ showSideCard: true })
  }

  toPrev = () => {
    this.setState({ showSideCard: false })
  }

  submit = () => {
    if (!this.state.passwordValue) {
      this.shrinkAmount()
      this.textInput.current.focus()
    } else {
      this.props.actions.resolveMessage({ password: this.state.passwordValue })
    }
  }

  bookmark = () => {
    const { id, bookmarkedIds } = this.props
    const isBookmarked = bookmarkedIds.indexOf(id) !== -1

    if (isBookmarked) {
      this.props.actions.unBookmarkDapp({ id: this.props.id })

      this.setState({ showCancelBookmark: true, showCancelBookmarkContent: true }, () => {
        setTimeout(() => {
          this.setState({ showCancelBookmark: false }, () => {
            this.setState({ showCancelBookmarkContent: false })
          })
        }, 1000)
      })
    } else {
      this.props.actions.bookmarkDapp({ id: this.props.id })

      this.setState({ showBookmark: true, showBookmarkContent: true }, () => {
        setTimeout(() => {
          this.setState({ showBookmark: false }, () => {
            this.setState({ showBookmarkContent: false })
          })
        }, 1000)
      })
    }
  }

  renderContractAction = (action) => {
    return (
      <Fragment>
        {this.renderActiveWallet()}
        <TouchableHighlight underlayColor="white" style={{ width: '100%' }} onPress={this.toNext}>
          <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
            <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>合约详情</Text>
            <View style={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 13 }}>{action.account} (合约名)</Text>
                <Text style={{ fontSize: 13 }}>{action.authorization.map((auth => `${auth.actor}@${auth.permission}`)).join(' ')} (权限)</Text>
              </View>
              <Image source={require('resources/images/arrow_right_bold.png')} />
            </View>
            <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
          </View>
        </TouchableHighlight>
        <Animated.View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, opacity: this.state.passwordTextInputOpacity, paddingHorizontal: 18 }}>
          <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>输入密码</Text>
          <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row' }}>
            <TextInput
              style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, width: '100%' }}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={this.onPasswordChange}
              value={this.state.passwordValue}
              ref={this.textInput}
              onBlur={this.onPasswordBlur}
              onSubmitEditing={this.submit}
              disabled
              secureTextEntry
              focuses
            />
          </View>
          {(!!this.state.largeAmount || !!this.props.resolving) && <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }} />}
          <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
        </Animated.View>
      </Fragment>
    )
  }

  renderActiveWallet = () => {
    if (!this.props.activeWallet) return null

    return (
      <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
        <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>当前钱包</Text>
        <View style={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={walletIcons[this.props.activeWallet.chain.toLowerCase()]}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                borderWidth: 0.5,
                borderColor: 'rgba(0,0,0,0.2)',
                backgroundColor: 'white',
                marginRight: 10
              }}
            />
            <View>
              <Text style={{ fontSize: 13, marginBottom: 2 }}>{this.formatAddress(this.props.activeWallet.address)}</Text>
              <Text style={{ fontSize: 13 }}>{`${this.props.intl.formatNumber(this.props.balance.balance, { minimumFractionDigits: this.props.balance.precision, maximumFractionDigits: this.props.balance.precision })} ${this.props.balance.symbol}`}</Text>
            </View>
          </View>
        </View>
        <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
      </View>
    )
  }

  renderTransferAction = action => (
    <Fragment>
      <Animated.View style={{ paddingVertical: this.state.amountContainerPaddingVertical, height: this.state.amountContainerHeight, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 18 }}>
        <View
            style={{ flexDirection: 'row', position: 'absolute', left: '-100%', top: 25, opacity: 1 }}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout
              this.setState({
                largeAmountWidth: layout.width,
                amountMarginLeft: new Animated.Value((Dimensions.get('window').width - layout.width) / 2 - 18)
              })
            }}
        >
          <Text style={{ fontSize: 30 }}>
            {action.data.quantity.split(' ')[0]}
          </Text>
          <Text style={{ fontSize: 18, marginTop: 5, marginLeft: 4 }}>
            {action.data.quantity.split(' ')[1]}
          </Text>
        </View>
        <Animated.Text style={{ fontSize: 13, color: '#A2A2A6', width: 95, position: 'absolute', left: 18, top: 15, opacity: this.state.amountLabelOpacity }}>
            支付金额
        </Animated.Text>
        <Animated.View
            style={{ flexDirection: 'row', marginLeft: this.state.amountMarginLeft }}
        >
          <Animated.Text style={{ fontSize: this.state.amountFontSize }}>
            {action.data.quantity.split(' ')[0]}
          </Animated.Text>
          <Animated.Text style={{ fontSize: this.state.symbolFontSize, marginTop: this.state.symbolMarginTop, marginLeft: 4 }}>
            {action.data.quantity.split(' ')[1]}
          </Animated.Text>
        </Animated.View>
        <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
      </Animated.View>
      {this.renderActiveWallet()}
      <TouchableHighlight underlayColor="white" style={{ width: '100%' }} onPress={this.toNext}>
        <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
          <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>合约详情</Text>
          <View style={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 13 }}>{`${action.account}->${action.name}`}</Text>
              <Text style={{ fontSize: 13 }}>{action.authorization.map((auth => `${auth.actor}@${auth.permission}`)).join(' ')}</Text>
            </View>
            <Image source={require('resources/images/arrow_right_bold.png')} />
          </View>
          <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
        </View>
      </TouchableHighlight>
      <Animated.View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, opacity: this.state.passwordTextInputOpacity, paddingHorizontal: 18 }}>
        <Text
	  style={{
	    paddingTop: 15,
	    paddingBottom: 15,
	    fontSize: 13,
	    color: '#A2A2A6',
	    width: 95
	  }}
	>
	  输入密码
	</Text>
        <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row' }}>
          <TextInput
            style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, width: '100%' }}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={this.onPasswordChange}
            value={this.state.passwordValue}
            ref={this.textInput}
            onBlur={this.onPasswordBlur}
            onSubmitEditing={this.submit}
            disabled
            secureTextEntry
            focuses
          />
        </View>
        {(!!this.state.largeAmount || !!this.props.resolving) &&
	 <View
	   style={{
	     position: 'absolute',
	     left: 0,
	     top: 0,
	     right: 0,
	     bottom: 0
	   }}
	 />
	}
        <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
      </Animated.View>
    </Fragment>
  )

  renderTransactionDetail = (message) => {
    if (message.type === 'requestSignature') {
      const actions = message.payload.transaction.actions

      if (this.state.showSideCard) {
        return (
          <ScrollView style={{ height: 340, width: '100%' }}>
            {actions.map((action, index) => <Fragment key={action.name}>
              <View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, paddingHorizontal: 18 }}>
                <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>合约操作</Text>
                <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13 }}>{action.name}</Text>
                </View>
                <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
              </View>
              <View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, paddingHorizontal: 18 }}>
                <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>合约名称</Text>
                <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13 }}>{action.account}</Text>
                </View>
                <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
              </View>
              <View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, paddingHorizontal: 18 }}>
                <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>使用权限</Text>
                <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13 }}>{action.authorization.map((auth => `${auth.actor}@${auth.permission}`)).join(' ')}</Text>
                </View>
                <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
              </View>
              <View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
                <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>合约参数</Text>
                <View style={{ width: Dimensions.get('window').width - 36 - 95, paddingTop: 15, paddingBottom: 15 }}>
                  {Object.keys(action.data).map(key => <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text style={{ fontSize: 13, color: '#A2A2A6', height: 20 }}>{key}</Text>
                    <Text style={{ fontSize: 13 }}>{typeof action.data[key] === 'object' ? JSON.stringify(action.data[key]) : action.data[key]}</Text>
                  </View>
                  )}
                </View>
                {(index !== actions.length - 1) && <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />}
              </View>
            </Fragment>
            )}
          </ScrollView>
        )
      } else if (actions.length >= 1) {
        const action = actions[0]
        const name = action.name
        const account = action.account
        const authorization = action.authorization
        const data = action.data

        return (
          <View style={{ height: 340 }}>
            {(name === 'transfer' && account === 'eosio.token') && this.renderTransferAction(action)}
            {(name !== 'transfer' || account !== 'eosio.token') && this.renderContractAction(action)}
            <View style={{ paddingTop: 10, paddingBottom: 10, position: 'absolute', bottom: 0, left: 0, width: '100%', paddingHorizontal: 18 }}>
              <TouchableOpacity style={{ backgroundColor: '#007AFF', borderRadius: 10, width: '100%', height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.7} onPress={this.state.largeAmount ? this.changeAmountSize : this.submit} disabled={!!this.props.resolving}>
                {(!!this.state.largeAmount || !this.state.passwordValue) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>确认交易</Text>}
                {(!this.state.largeAmount && !!this.state.passwordValue && !this.props.resolving) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>验证密码</Text>}
                {(!this.state.largeAmount && !!this.state.passwordValue && !!this.props.resolving) && <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 5 }} />}
                {(!this.state.largeAmount && !!this.state.passwordValue && !!this.props.resolving) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>验证密码中...</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )
      }
    } else if (message.type === 'requestArbitrarySignature' || message.type === 'authenticate') {
      return (
        <View style={{ height: 240 }}>
          <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
            <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>签名内容</Text>
            <View style={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 13 }}>{message.payload.data}</Text>
            </View>
            <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
          </View>
          <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
            <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>签名公钥</Text>
            <View style={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 13 }}>{message.payload.publicKey}</Text>
            </View>
            <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
          </View>
          <Animated.View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, opacity: this.state.passwordTextInputOpacity, paddingHorizontal: 18 }}>
            <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>输入密码</Text>
            <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row' }}>
              <TextInput
                style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, width: '100%' }}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.onPasswordChange}
                value={this.state.passwordValue}
                ref={this.textInput}
                onBlur={this.onPasswordBlur}
                onSubmitEditing={this.submit}
                disabled
                secureTextEntry
                focuses
              />
            </View>
            {(!!this.state.largeAmount || !!this.props.resolving) && <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }} />}
            <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
          </Animated.View>
          <View style={{ paddingTop: 10, paddingBottom: 10, position: 'absolute', bottom: 0, left: 0, width: '100%', paddingHorizontal: 18 }}>
            <TouchableOpacity style={{ backgroundColor: '#007AFF', borderRadius: 10, width: '100%', height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.7} onPress={this.state.largeAmount ? this.changeAmountSize : this.submit} disabled={!!this.props.resolving}>
              {(!!this.state.largeAmount || !this.state.passwordValue) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>确认签名</Text>}
              {(!this.state.largeAmount && !!this.state.passwordValue && !this.props.resolving) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>验证密码</Text>}
              {(!this.state.largeAmount && !!this.state.passwordValue && !!this.props.resolving) && <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 5 }} />}
              {(!this.state.largeAmount && !!this.state.passwordValue && !!this.props.resolving) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>验证密码中...</Text>}
            </TouchableOpacity>
          </View>
        </View>
      )
    } else if (message.type === 'eth_rpc_request') {
      if (message.payload.method === 'personal_sign') {
        return (
          <View style={{ height: 290 }}>
            <Animated.View style={{ paddingVertical: this.state.amountContainerPaddingVertical, height: this.state.amountContainerHeight, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 18 }}>
              <View
                style={{ flexDirection: 'row', position: 'absolute', left: '-100%', top: 25, opacity: 1 }}
                onLayout={(event) => {
                  const layout = event.nativeEvent.layout
                  this.setState({
                    largeAmountWidth: layout.width,
                    amountMarginLeft: new Animated.Value((Dimensions.get('window').width - layout.width) / 2 - 18)
                  })
                }}
              >
                <Text style={{ fontSize: 24 }}>
                  个人签名
                </Text>
              </View>
              <Animated.Text style={{ fontSize: 13, color: '#A2A2A6', width: 95, position: 'absolute', left: 18, top: 15, opacity: this.state.amountLabelOpacity }}>
                当前操作
              </Animated.Text>
              <Animated.View
                style={{ flexDirection: 'row', marginLeft: this.state.amountMarginLeft }}
              >
                <Animated.Text style={{ fontSize: this.state.actionFontSize }}>
                  个人签名
                </Animated.Text>
              </Animated.View>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </Animated.View>
            {this.renderActiveWallet()}
            <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>签名内容</Text>
              <ScrollView contentContainerStyle={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row' }} style={{ maxHeight: 32 }}>
                <Text style={{ fontSize: 13 }}>{hex_to_ascii(message.payload.params[0])}</Text>
              </ScrollView>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </View>
            <Animated.View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, opacity: this.state.passwordTextInputOpacity, paddingHorizontal: 18 }}>
              <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>输入密码</Text>
              <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row' }}>
                <TextInput
                  style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, width: '100%' }}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={this.onPasswordChange}
                  value={this.state.passwordValue}
                  ref={this.textInput}
                  onBlur={this.onPasswordBlur}
                  onSubmitEditing={this.submit}
                  disabled
                  secureTextEntry
                  focuses
                />
              </View>
              {(!!this.state.largeAmount || !!this.props.resolving) && <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }} />}
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </Animated.View>
            <View style={{ paddingTop: 10, paddingBottom: 10, position: 'absolute', bottom: 0, left: 0, width: '100%', paddingHorizontal: 18 }}>
              <TouchableOpacity style={{ backgroundColor: '#007AFF', borderRadius: 10, width: '100%', height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.7} onPress={this.state.largeAmount ? this.changeAmountSize : this.submit} disabled={!!this.props.resolving}>
                {(!!this.state.largeAmount || !this.state.passwordValue) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>确认签名</Text>}
                {(!this.state.largeAmount && !!this.state.passwordValue && !this.props.resolving) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>验证密码</Text>}
                {(!this.state.largeAmount && !!this.state.passwordValue && !!this.props.resolving) && <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 5 }} />}
                {(!this.state.largeAmount && !!this.state.passwordValue && !!this.props.resolving) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>验证密码中...</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )
      } else {
        return null
      }
    }
  }

  render() {
    const {
      title,
      locale,
      inject,
      url,
      bookmarkedIds,
      id
    } = this.props
    const isBookmarked = id ? (bookmarkedIds.indexOf(id) !== -1) : false

    if (!inject) {
      return (
        <View style={{ flex: 1 }}>
          <RNWebView
            source={{ uri: url }}
            ref={(e) => { this.webviewbridge = e }}
            renderError={this.renderError}
            renderLoading={() => {}}
            startInLoadingState={true}
            automaticallyAdjustContentInsets={false}
            onNavigationStateChange={this.onNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            decelerationRate="normal"
            scalesPageToFit={true}
            nativeConfig={{ props: { backgroundColor: 'white', flex: 1 } }}
            onLoadProgress={this.onProgress}
            onError={this.onError}
          />
          <Animated.View style={{ width: '100%', height: 2, position: 'absolute', top: 0, left: 0, opacity: this.state.progressOpacity }}>
            <Animated.View style={{ height: '100%', width: this.state.progress, backgroundColor: '#007AFF' }} />
          </Animated.View>
        </View>
      )
    }

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={{ flex: 1 }}>
          <RNWebView
            source={{ uri: url }}
            ref={(e) => { this.webviewbridge = e }}
            renderError={this.renderError}
            renderLoading={() => {}}
            startInLoadingState={true}
            automaticallyAdjustContentInsets={false}
            onNavigationStateChange={this.onNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            decelerationRate="normal"
            useWebKit={true}
            onMessage={this.onBridgeMessage}
            injectedJavaScriptBeforeLoad={injectedJavascript(inject || '')}
            onLoadProgress={this.onProgress}
            onError={this.onError}
          />
          <Animated.View style={{ width: '100%', height: 2, position: 'absolute', top: 0, left: 0, opacity: this.state.progressOpacity }}>
            <Animated.View style={{ height: '100%', width: this.state.progress, backgroundColor: '#007AFF' }} />
          </Animated.View>
          <IndicatorModal isVisible={this.props.loadingContract} message="合约加载中..." />
          <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            isVisible={!!this.props.hasPendingMessage && !this.props.loadingContract && !!this.state.showPrompt}
            onModalHide={this.onModalHide}
            backdropOpacity={0.4}
            style={{ margin: 0 }}
          >
            <View style={{ backgroundColor: '#F7F7F8', position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: tabHeight - 44 }}>
              <View style={{ height: 44, borderBottomWidth: 0.5, borderColor: '#E3E3E4', flex: 1, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
                {!this.state.showSideCard && <Text style={{ fontSize: 17, fontWeight: 'bold' }}>交易详情</Text>}
                {!!this.state.showSideCard && <TouchableOpacity onPress={this.toPrev} style={{ height: 44 }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('resources/images/arrow_left_short.png')}
                    style={{ height: 18, width: 10, marginRight: 5 }}
                  />
                  <Text style={{ fontSize: 17, color: '#007AFF', lineHeight: 44 }}>返回</Text>
                </TouchableOpacity>}
                <TouchableOpacity onPress={!this.props.resolving ? this.closePrompt : () => {}} style={{ height: 44 }} disabled={this.props.resolving}>
                  <Text style={{ fontSize: 17, color: '#007AFF', lineHeight: 44 }}>取消</Text>
                </TouchableOpacity>
              </View>
              {!!this.props.pendingMessage && this.renderTransactionDetail(this.props.pendingMessage)}
            </View>
          </Modal>
          <Modal
            isVisible={this.state.showBookmark}
            backdropOpacity={0}
            useNativeDriver
            animationIn="fadeIn"
            animationInTiming={200}
            backdropTransitionInTiming={200}
            animationOut="fadeOut"
            animationOutTiming={200}
            backdropTransitionOutTiming={200}
          >
            {this.state.showBookmarkContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>已收藏</Text>
              </View>
            </View>}
          </Modal>
          <Modal
            isVisible={this.state.showCancelBookmark}
            backdropOpacity={0}
            useNativeDriver
            animationIn="fadeIn"
            animationInTiming={200}
            backdropTransitionInTiming={200}
            animationOut="fadeOut"
            animationOutTiming={200}
            backdropTransitionOutTiming={200}
          >
            {this.state.showCancelBookmarkContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>已取消收藏</Text>
              </View>
            </View>}
          </Modal>
        </View>
      </IntlProvider>
    )
  }
}
