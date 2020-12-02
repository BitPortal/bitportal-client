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
  ActionSheetIOS,
  ScrollView,
  Animated,
  Easing,
  TextInput,
  Switch,
  Alert,
  SafeAreaView,
  requireNativeComponent,
  TouchableNativeFeedback
} from 'react-native'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import { FormattedMessage, IntlProvider, injectIntl } from 'react-intl'
import ActionSheet from 'react-native-actionsheet'
import Url from 'url-parse'
import * as bridgeActions from 'actions/bridge'
import * as dappActions from 'actions/dapp'
import * as uiActions from 'actions/ui'
import SearchWebsiteForm from 'components/Form/SearchWebsiteForm'
import FastImage from 'react-native-fast-image'
import Modal from 'react-native-modal'
import { bridgeWalletSelector, bridgeChainSelector, bridgeWalletIdSelector } from 'selectors/wallet'
import { bridgeWalletBalanceSelector } from 'selectors/balance'
import globalMessages from 'resources/messages'
import { walletIcons } from 'resources/images'
import { dappBookmarkAllIdsSelector } from 'selectors/dapp'
import RNWebView from 'react-native-webview'
import localMessages from './messages'
import styles from './styles'
import urlParse from 'url-parse'
import { transfromUrlText } from 'utils'
import { loadScatterSync, loadMetaMaskSync } from 'utils/inject'
import SearchBar from 'components/Form/SearchBar'
import IndicatorModal from 'components/Modal/IndicatorModal'


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

const generateOnMessageFunction = data => `(function() { window.WebViewBridge.onMessage('${data}'); })()`

export const errorMessages = (error, messages) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.webview_invalid_password
    default:
      if (message.indexOf('transaction underpriced') !== -1) {
        return gt('gas_price_low')
      }
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
    activeWallet: bridgeWalletSelector(state),
    bridgeWalletId: bridgeWalletIdSelector(state),
    balance:  bridgeWalletBalanceSelector(state),
    bookmarkedIds: dappBookmarkAllIdsSelector(state),
    chain: bridgeChainSelector(state),
    ui: state.ui
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...bridgeActions,
      ...dappActions,
      ...uiActions
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
            id: 'next',
            icon: require('resources/images/next_android.png'),
            text: gt('button_next_page')
          },
          {
            id: 'previous',
            icon: require('resources/images/previous_android.png'),
            text: gt('button_pre_page')
          },
          {
            id: 'share',
            icon: require('resources/images/share_android.png'),
            text: gt('share'),
            color: 'white'
          },
          {
            id: 'refresh',
            icon: require('resources/images/refresh_android.png'),
            text: gt('refresh'),
            color: 'white'
          },
          {
            id: 'search',
            icon: require('resources/images/search_android.png'),
            text: gt('search')
          }
        ]
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.messageToSend !== prevState.messageToSend || nextProps.bridgeWalletId !== prevState.bridgeWalletId || nextProps.chain !== prevState.chain) {
      return {
        messageToSend: nextProps.messageToSend,
        bridgeWalletId: nextProps.bridgeWalletId,
        chain: nextProps.chain
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
    url: this.props.url,
    originurl: this.props.url,
    bridgeWalletId: this.props.bridgeWalletId,
    chain: this.props.chain,
    searchBarEnabled: false,
    searchUrl: ''
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

    const { title, chain } = this.props

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: title
        },
        rightButtonColor: 'white',
        rightButtons: [
          {
            id: 'next',
            icon: require('resources/images/next_android.png'),
            text: gt('button_next_page')
          },
          {
            id: 'previous',
            icon: require('resources/images/previous_android.png'),
            text: gt('button_pre_page')
          },
          {
            id: 'share',
            icon: require('resources/images/share_android.png'),
            text: gt('share'),
            color: 'white'
          },
          {
            id: 'refresh',
            icon: require('resources/images/refresh_android.png'),
            text: gt('share'),
            color: 'white'
          },
          {
            id: 'wallet',
            icon: chain === 'EOS' ? require('resources/images/eos_icon.png') : require('resources/images/eth_icon.png'),
            text: gt('wallet')
          },
          {
            id: 'search',
            icon: require('resources/images/search_android.png'),
            text: gt('search')
          }
        ]
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.messageToSend && prevProps.messageToSend !== this.props.messageToSend && this.webviewbridge) {
      this.sendMessageToWebView(this.props.messageToSend)
    } else if (prevState.showSideCard !== this.state.showSideCard) {
      LayoutAnimation.easeInEaseOut()
    } else if (prevProps.error !== this.props.error && !!this.props.error) {
      Alert.alert(
        errorMessages(this.props.error),
        '',
        [
          { text: t(this,'button_ok'), onPress: () => this.props.actions.clearPasswordError() }
        ]
      )
    } else if (prevState.bridgeWalletId !== this.state.bridgeWalletId) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'next',
              icon: require('resources/images/next_android.png'),
              text: gt('button_next_page')
            },
            {
              id: 'previous',
              icon: require('resources/images/previous_android.png'),
              text: gt('button_pre_page')
            },
            {
              id: 'share',
              icon: require('resources/images/share_android.png'),
              text: gt('share'),
              color: 'white'
            },
            {
              id: 'refresh',
              icon: require('resources/images/refresh_android.png'),
              text: gt('share'),
              color: 'white'
            },
            {
              id: 'wallet',
              icon: this.state.chain === 'EOS' ? require('resources/images/eos_icon.png') : require('resources/images/eth_icon.png'),
              text: gt('wallet')
            },
            {
              id: 'search',
              icon: require('resources/images/search_android.png'),
              text: gt('search')
            }
          ]
        }
      })

      setTimeout(() => {
        this.refresh()
      })
    }
  }

  sendMessageToWebView = (message) => {
    this.webviewbridge.injectJavaScript(generateOnMessageFunction(message))
  }

  /* componentWillUnmount() {
   *   this.props.actions.clearMessage()
   * }*/

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'refresh') {
      this.refresh()
    } else if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    } else if (buttonId === 'previous') {
      this.goBack()
    } else if (buttonId === 'next') {
      this.goForward()
    } else if (buttonId === 'share') {
      this.share()
    } else if (buttonId === 'search') {
      this.toSearch()
    } else if (buttonId === 'wallet') {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.SelectBridgeWallet'
            }
          }]
        }
      })
    }
  }

  textInput = React.createRef()

  cancel = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  refresh = () => {
    this.webviewbridge.reload()
    this.onLoadStart()
  }

  loadBridgeByChain = (chain) => {
    if (chain === 'EOS') {
      return loadScatterSync()
    } else if (chain === 'ETHEREUM') {
      return loadMetaMaskSync()
    }

    return ''
  }

  share = () => {
    try {
      Share.share({ url: this.props.url, title: this.props.title })
    } catch (e) {
      console.warn('share error --', e)
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
          {t(this,'failed_load')}
        </Text>
      </View>
    )
  }

  onNavigationStateChange = (navState) => {
    const url = new Url(navState.url)
    const hostname = url.hostname
    const host = hostname.indexOf('www.') === 0 ? hostname.replace('www.', '') : hostname
    this.props.actions.setHost(host)

    if (this.state.url !== navState.url) {
      this.setState({ url: navState.url })
    }
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
    this.setState({ showPrompt: false }, () => {
      setTimeout(() => {
        this.rejectMessage()
      }, 500)
    })
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
      if (!this.state.progressOpacity._value) {
        this.onLoadStart()
      } else {
        Animated.timing(this.state.progress, {
          toValue: 0.1 * Dimensions.get('window').width + Dimensions.get('window').width * 0.9 * data,
          duration: 300,
          easing: Easing.inOut(Easing.quad)
        }).start()
      }
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
    console.log('onError', this.props.url)
    this.onLoadEnd()
  }

  renderError = () => {
    console.log('renderError', this.props.url)
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

  toSearch = () => {
    this.props.actions.showSearchBar()
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
    const isDarkMode = this.context === 'dark'

    return (
      <Fragment>
        {this.renderActiveWallet()}
        <TouchableHighlight underlayColor="white" style={{ width: '100%' }} onPress={this.toNext}>
          <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
    <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'contract_detail')}</Text>
            <View style={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
              <View>
    <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{action.account} {t(this,'contract_name_bracket')}</Text>
    <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{action.authorization.map((auth => `${auth.actor}@${auth.permission}`)).join(' ')} {t(this,'permission_bracket')}</Text>
              </View>
              <Image source={require('resources/images/arrow_right_android.png')} />
            </View>
            <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
          </View>
        </TouchableHighlight>
        {this.renderPasswordInput()}
      </Fragment>
    )
  }

  renderActiveWallet = () => {
    if (!this.props.activeWallet) return null
    const isDarkMode = this.context === 'dark'

    return (
      <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
        <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'wallet_current')}</Text>
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
              <Text style={{ fontSize: 13, marginBottom: 2, color: isDarkMode ? 'white' : 'black' }}>{this.formatAddress(this.props.activeWallet.address)}</Text>
              <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{`${this.props.intl.formatNumber(this.props.balance.balance, { minimumFractionDigits: this.props.balance.precision, maximumFractionDigits: this.props.balance.precision })} ${this.props.balance.symbol}`}</Text>
            </View>
          </View>
        </View>
        <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
      </View>
    )
  }

  renderTransferAction = action => {
    const isDarkMode = this.context === 'dark'

    return (
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
            <Text style={{ fontSize: 30, color: isDarkMode ? 'white' : 'black' }}>
              {action.data.quantity.split(' ')[0]}
            </Text>
            <Text style={{ fontSize: 18, marginTop: 5, marginLeft: 4, color: isDarkMode ? 'white' : 'black' }}>
              {action.data.quantity.split(' ')[1]}
            </Text>
          </View>
          <Animated.Text style={{ fontSize: 13, color: '#A2A2A6', width: 95, position: 'absolute', left: 18, top: 15, opacity: this.state.amountLabelOpacity, color: isDarkMode ? 'white' : 'black' }}>
            {t(this,'amount_payment')}
          </Animated.Text>
          <Animated.View style={{ flexDirection: 'row', marginLeft: this.state.amountMarginLeft }}>
            <Animated.Text style={{ fontSize: this.state.amountFontSize, color: isDarkMode ? 'white' : 'black' }}>
              {action.data.quantity.split(' ')[0]}
            </Animated.Text>
            <Animated.Text style={{ fontSize: this.state.symbolFontSize, marginTop: this.state.symbolMarginTop, marginLeft: 4, color: isDarkMode ? 'white' : 'black' }}>
              {action.data.quantity.split(' ')[1]}
            </Animated.Text>
          </Animated.View>
          <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
        </Animated.View>
        {this.renderActiveWallet()}
        <TouchableHighlight underlayColor="white" style={{ width: '100%' }} onPress={this.toNext}>
          <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
          <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'contract_detail')}</Text>
            <View style={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{`${action.account}->${action.name}`}</Text>
                <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{action.authorization.map((auth => `${auth.actor}@${auth.permission}`)).join(' ')}</Text>
              </View>
              <Image source={require('resources/images/arrow_right_android.png')} />
            </View>
            <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
          </View>
        </TouchableHighlight>
        {this.renderPasswordInput()}
      </Fragment>
    )
  }

  renderPasswordInput = () => {
    const isDarkMode = this.context === 'dark'

    return (
      <Animated.View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, opacity: this.state.passwordTextInputOpacity, paddingHorizontal: 18 }}>
        <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95, color: isDarkMode ? 'white' : 'black' }}>{t(this,'pwd_enter1')}</Text>
        <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row' }}>
          <TextInput
            style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, width: '100%', color: isDarkMode ? 'white' : 'black' }}
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
    )
  }

  renderSubmitButton = () => {
    const isDarkMode = this.context === 'dark'

    return (
      <View style={{ paddingTop: 10, paddingBottom: 10, position: 'absolute', bottom: 0, left: 0, width: '100%', paddingHorizontal: 18 }}>
        <TouchableNativeFeedback onPress={this.state.largeAmount ? this.changeAmountSize : this.submit} disabled={!!this.props.resolving} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', false)}>
          <View style={{ backgroundColor: '#673AB7', borderRadius: 4, width: '100%', height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 2 }}>
    {(!!this.state.largeAmount || !this.state.passwordValue) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>{t(this,'tx_confirmation')}</Text>}
    {(!this.state.largeAmount && !!this.state.passwordValue && !this.props.resolving) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>{t(this,'pwd_verify')}</Text>}
            {(!this.state.largeAmount && !!this.state.passwordValue && !!this.props.resolving) && <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 5 }} />}
    {(!this.state.largeAmount && !!this.state.passwordValue && !!this.props.resolving) && <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17, textAlign: 'center', lineHeight: 44 }}>{t(this,'pwd_verify_verifying')}</Text>}
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  renderTransactionDetail = (message) => {
    const isDarkMode = this.context === 'dark'

    if (message.type === 'requestSignature') {
      const actions = message.payload.transaction.actions

      if (this.state.showSideCard) {
        return (
          <ScrollView style={{ height: 340, width: '100%' }}>
            {actions.map((action, index) => <Fragment key={action.name}>
              <View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, paddingHorizontal: 18 }}>
        <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'contract_operation')}</Text>
                <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{action.name}</Text>
                </View>
                <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
              </View>
              <View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, paddingHorizontal: 18 }}>
        <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'contract_name')}</Text>
                <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{action.account}</Text>
                </View>
                <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
              </View>
              <View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', height: 44, paddingHorizontal: 18 }}>
        <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'auth_using')}</Text>
                <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{action.authorization.map((auth => `${auth.actor}@${auth.permission}`)).join(' ')}</Text>
                </View>
                <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
              </View>
              <View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
        <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'contract_parameter')}</Text>
                <View style={{ width: Dimensions.get('window').width - 36 - 95, paddingTop: 15, paddingBottom: 15 }}>
                  {Object.keys(action.data).map(key => <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text style={{ fontSize: 13, color: '#A2A2A6', height: 20, color: isDarkMode ? 'white' : 'black' }}>{key}</Text>
                    <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{typeof action.data[key] === 'object' ? JSON.stringify(action.data[key]) : action.data[key]}</Text>
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
            {this.renderSubmitButton()}
          </View>
        )
      }
    } else if (message.type === 'requestArbitrarySignature' || message.type === 'authenticate') {
      return (
        <View style={{ height: 240 }}>
          <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
      <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'pwd_signature')}</Text>
            <View style={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{message.payload.data}</Text>
            </View>
            <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
          </View>
          <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
      <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'pwd_signature_publickey')}</Text>
            <View style={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{message.payload.publicKey}</Text>
            </View>
            <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
          </View>
          {this.renderPasswordInput()}
          {this.renderSubmitButton()}
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
                <Text style={{ fontSize: 24, color: isDarkMode ? 'white' : 'black' }}>
                  {t(this,'pwd_signature_personal')}
                </Text>
              </View>
              <Animated.Text style={{ fontSize: 13, color: '#A2A2A6', width: 95, position: 'absolute', left: 18, top: 15, opacity: this.state.amountLabelOpacity, color: isDarkMode ? 'white' : 'black' }}>
                {t(this,'operation_current')}
              </Animated.Text>
              <Animated.View
                style={{ flexDirection: 'row', marginLeft: this.state.amountMarginLeft }}
              >
                <Animated.Text style={{ fontSize: this.state.actionFontSize, color: isDarkMode ? 'white' : 'black' }}>
                  {t(this,'pwd_signature_personal')}
                </Animated.Text>
              </Animated.View>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </Animated.View>
            {this.renderActiveWallet()}
            <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'pwd_signature')}</Text>
              <ScrollView contentContainerStyle={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row' }} style={{ maxHeight: 32 }}>
                <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }} ellipsizeMode="tail" numberOfLines={200}>{message.info.data}</Text>
              </ScrollView>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </View>
            {this.renderPasswordInput()}
            {this.renderSubmitButton()}
          </View>
        )
      } else if (message.payload.method === 'eth_sign') {
        return (
          <View style={{ height: 335 }}>
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
                <Text style={{ fontSize: 24, color: isDarkMode ? 'white' : 'black' }}>
                  {t(this,'signature_eth')}
                </Text>
              </View>
              <Animated.Text style={{ fontSize: 13, color: '#A2A2A6', width: 95, position: 'absolute', left: 18, top: 15, opacity: this.state.amountLabelOpacity }}>
                {t(this,'operation_current')}
              </Animated.Text>
              <Animated.View
                style={{ flexDirection: 'row', marginLeft: this.state.amountMarginLeft }}
              >
                <Animated.Text style={{ fontSize: this.state.actionFontSize, color: isDarkMode ? 'white' : 'black' }}>
                {t(this,'signature_eth')}
                </Animated.Text>
              </Animated.View>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </Animated.View>
            {this.renderActiveWallet()}
            <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'pwd_signature')}</Text>
              <ScrollView contentContainerStyle={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row' }} style={{ maxHeight: 32 }}>
                <Text style={{ fontSize: 13 }} ellipsizeMode="tail" numberOfLines={200}>{message.info.data}</Text>
              </ScrollView>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </View>
            <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 13, color: 'rgba(255,59,48,1)', width: 95 }}>{t(this,'caution')}</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,59,48,1)', width: Dimensions.get('window').width - 36 - 95 }}>{t(this,'operation_hint')}</Text>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </View>
            {this.renderPasswordInput()}
            {this.renderSubmitButton()}
          </View>
        )
      } else if (message.payload.method === 'eth_signTypedData') {
        return (
          <View style={{ height: 310 }}>
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
                <Text style={{ fontSize: 24, color: isDarkMode ? 'white' : 'black' }}>
                  {t(this,'signature_apply')}
                </Text>
              </View>
              <Animated.Text style={{ fontSize: 13, color: '#A2A2A6', width: 95, position: 'absolute', left: 18, top: 15, opacity: this.state.amountLabelOpacity }}>
                {t(this,'operation_current')}
              </Animated.Text>
              <Animated.View
                style={{ flexDirection: 'row', marginLeft: this.state.amountMarginLeft }}
              >
                <Animated.Text style={{ fontSize: this.state.actionFontSize, color: isDarkMode ? 'white' : 'black' }}>
                  {t(this,'signature_apply')}
                </Animated.Text>
              </Animated.View>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </Animated.View>
            {this.renderActiveWallet()}
            <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'pwd_signature')}</Text>
              <ScrollView contentContainerStyle={{ width: Dimensions.get('window').width - 36 - 95 }} style={{ maxHeight: 52 }}>
                {message.info.data.map(data =>
                  <Text key={data.name} style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{`${data.name}: ${data.value}`}</Text>
                )}
              </ScrollView>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </View>
            {this.renderPasswordInput()}
            {this.renderSubmitButton()}
          </View>
        )
      } else if (message.payload.method === 'eth_signTypedData_v3' || message.payload.method === 'eth_signTypedData_v4') {
        return (
          <View style={{ height: 310 }}>
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
                <Text style={{ fontSize: 24, color: isDarkMode ? 'white' : 'black' }}>
                  {t(this,'signature_apply')}
                </Text>
              </View>
              <Animated.Text style={{ fontSize: 13, color: '#A2A2A6', width: 95, position: 'absolute', left: 18, top: 15, opacity: this.state.amountLabelOpacity }}>
                {t(this,'operation_current')}
              </Animated.Text>
              <Animated.View
                style={{ flexDirection: 'row', marginLeft: this.state.amountMarginLeft }}
              >
                <Animated.Text style={{ fontSize: this.state.actionFontSize, color: isDarkMode ? 'white' : 'black' }}>
                  {t(this,'signature_apply')}
                </Animated.Text>
              </Animated.View>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </Animated.View>
            {this.renderActiveWallet()}
            <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'pwd_signature')}</Text>
              <ScrollView contentContainerStyle={{ width: Dimensions.get('window').width - 36 - 95 }} style={{ maxHeight: 52 }}>
                <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{typeof message.info.data === 'object' ? JSON.stringify(message.info.data, null, 2) : message.info.data}</Text>
              </ScrollView>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </View>
            {this.renderPasswordInput()}
            {this.renderSubmitButton()}
          </View>
        )
      } else if (message.payload.method === 'eth_sendTransaction' || message.payload.method === 'eth_signTransaction') {
        const info = message.info
        const amount = this.props.intl.formatNumber(info.amount, { minimumFractionDigits: 4, maximumFractionDigits: 8 })
        const gasFee = this.props.intl.formatNumber(info.gasFee, { minimumFractionDigits: 4, maximumFractionDigits: 8 })
        const gasPrice = this.props.intl.formatNumber(info.gasPrice * 1000 * 1000 * 1000, { minimumFractionDigits: 0, maximumFractionDigits: 9 })
        const gasLimit = info.gas
        const total = this.props.intl.formatNumber(+amount + +gasFee, { minimumFractionDigits: 4, maximumFractionDigits: 8 })

        return (
          <View style={{ height: 330 }}>
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
                <Text style={{ fontSize: 30, color: isDarkMode ? 'white' : 'black' }}>
                  {amount}
                </Text>
                <Text style={{ fontSize: 18, marginTop: 5, marginLeft: 4, color: isDarkMode ? 'white' : 'black' }}>
                  ETH
                </Text>
              </View>
              <Animated.Text style={{ fontSize: 13, color: '#A2A2A6', width: 95, position: 'absolute', left: 18, top: 15, opacity: this.state.amountLabelOpacity }}>
                {t(this,'amount_payment')}
              </Animated.Text>
              <Animated.View
                style={{ flexDirection: 'row', marginLeft: this.state.amountMarginLeft }}
              >
                <Animated.Text style={{ fontSize: this.state.amountFontSize, color: isDarkMode ? 'white' : 'black' }}>
                  {amount}
                </Animated.Text>
                <Animated.Text style={{ fontSize: this.state.symbolFontSize, marginTop: this.state.symbolMarginTop, marginLeft: 4, color: isDarkMode ? 'white' : 'black' }}>
                  ETH
                </Animated.Text>
              </Animated.View>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </Animated.View>
            {this.renderActiveWallet()}
            <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'send_to')}</Text>
              <View style={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row', maxHeight: 32 }}>
                <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{this.formatAddress(info.toAddress)}</Text>
              </View>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </View>
  
            <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
              <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>{t(this,'gas_fee')}</Text>
              <View style={{ width: Dimensions.get('window').width - 36 - 95, flexDirection: 'row', maxHeight: 32 }}>
                <View>
                  <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{gasFee} ether</Text>
                  <Text style={{ fontSize: 13, color: isDarkMode ? 'white' : 'black' }}>{(`${gasPrice} gwei * ${gasLimit}`)}</Text>
                </View>
              </View>
              <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
            </View>
            {/* <View style={{ paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
                <Text style={{ fontSize: 13, color: '#A2A2A6', width: 95 }}>DATA</Text>
                <ScrollView contentContainerStyle={{ width: Dimensions.get('window').width - 36 - 95, justifyContent: 'space-between', flexDirection: 'row' }} style={{ maxHeight: 32 }}>
                <Text style={{ fontSize: 13 }}>{info.data}</Text>
                </ScrollView>
                <View style={{ position: 'absolute', left: 18, right: 0, bottom: 0, height: 0.5, backgroundColor: '#E3E3E4' }} />
                </View> */}
            {this.renderPasswordInput()}
            {this.renderSubmitButton()}
          </View>
        )
      } else {
        return null
      }
    }
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

  loadPage = (url) => {
    this.setState({ originurl: url })
  }

  parseUrlTitle = (data) => {
    try {
      if (data) {
        const url = urlParse(data)
        const hostname = url.hostname
        return hostname.indexOf('www.') === 0 ? hostname.slice(4) : hostname
      }
    } catch(error) {
      return null
    }

    return null
  }

  isHttps = (data) => {
    try {
      if (data) {
        const url = urlParse(data)
        const protocol = url.protocol
        return protocol === 'https:'
      }
    } catch(error) {
      return false
    }

    return false
  }

  onLeftButtonClicked = () => {
    Navigation.dismissModal(this.props.componentId)
  }

  onRightButtonClicked = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.SelectBridgeWallet',
            options: {
              modalPresentationStyle: 'sheets'
            }
          }
        }]
      }
    })
  }

  onSubmit = (event) => {
    event.persist()
    const text = event.nativeEvent.text
    const url = transfromUrlText(text)
    this.setState({ originurl: url })
    const title = this.parseUrlTitle(url)
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: title
        }
      }
    })
    this.onBackPress()
    this.refresh()
  }

  onBackPress = () => {
    this.setState({ searchUrl: '' })
    this.props.actions.hideSearchBar()
  }

  searchBarUpdated = ({ text }) => {
    this.setState({ searchUrl: text })
  }

  searchBarCleared = () => {
    this.setState({ searchUrl: '' })
  }

  render() {
    const {
      title,
      locale,
      url,
      bookmarkedIds,
      id,
      hasAddressBar,
      chain,
      activeWallet,
      ui
    } = this.props
    // const isBookmarked = id ? (bookmarkedIds.indexOf(id) !== -1) : false
    const inject = this.loadBridgeByChain(chain)
    const isDarkMode = this.context === 'dark'

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, width: '100%' }}>
          <Modal
            isVisible={ui.searchBarEnabled}
            backdropOpacity={0.4}
            useNativeDriver
            animationIn="fadeIn"
            animationInTiming={100}
            backdropTransitionInTiming={100}
            animationOut="fadeOut"
            animationOutTiming={100}
            backdropTransitionOutTiming={100}
            style={{ margin: 0 }}
            onBackdropPress={this.onBackPress}
          >
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
              <SearchBar
                onBackPress={this.onBackPress}
                searchBarUpdated={this.searchBarUpdated}
                searchBarCleared={this.searchBarCleared}
                hasSearchResult={false}
                placeholder={t(this,'search')}
                onSubmit={this.onSubmit}
              />
            </View>
          </Modal>
          <RNWebView
            source={{ uri: this.state.originurl }}
            ref={(e) => { this.webviewbridge = e }}
            renderError={this.renderError}
            renderLoading={() => {}}
            startInLoadingState={true}
            automaticallyAdjustContentInsets={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            decelerationRate="normal"
            useWebKit={true}
            onMessage={this.onBridgeMessage}
            injectedJavaScriptBeforeLoad={inject}
            injectedJavaScript={inject}
            onLoadProgress={this.onProgress}
            onError={this.onError}
            renderError={this.renderError}
            onNavigationStateChange={this.onNavigationStateChange}
            allowsBackForwardNavigationGestures
            allowsLinkPreview
            originWhitelist={['https://*', 'http://*']}
          />
          <Animated.View style={{ width: '100%', height: 2, position: 'absolute', top: 0, left: 0, opacity: this.state.progressOpacity }}>
            <Animated.View style={{ height: '100%', width: this.state.progress, backgroundColor: isDarkMode ? 'black' : '#673AB7' }} />
          </Animated.View>
        </View>
        {this.props.loadingContract && <IndicatorModal isVisible={this.props.loadingContract} message={t(this,'contract_loading')} />}
        <Modal
          animationIn="slideInUp"
          animationOut="slideOutDown"
          isVisible={!!this.props.hasPendingMessage && !this.props.loadingContract && !!this.state.showPrompt}
          onModalHide={this.onModalHide}
          backdropOpacity={0.4}
          style={{ margin: 0 }}
        >
          <View style={{ backgroundColor: isDarkMode ? 'black' : '#F7F7F8', position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: tabHeight - 44 }}>
            <View style={{ height: 44, borderBottomWidth: 0.5, borderColor: '#E3E3E4', flex: 1, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 18 }}>
    {!this.state.showSideCard && <Text style={{ fontSize: 17, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>{t(this,'tx_detail')}</Text>}
      {!!this.state.showSideCard &&
       <TouchableNativeFeedback onPress={this.toPrev} background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.12)', true)} useForeground={true}>
         <View style={{ width: 30, height: 30, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
           <Image source={require('resources/images/arrow_back_android.png')} style={{ width: 24, height: 24 }} />
         </View>
      </TouchableNativeFeedback>}
      <TouchableOpacity onPress={!this.props.resolving ? this.closePrompt : () => {}} style={{ height: 44 }} disabled={this.props.resolving}>
      <Text style={{ fontSize: 17, color: '#673AB7', lineHeight: 44 }}>{t(this,'button_cancel')}</Text>
      </TouchableOpacity>
      </View>
      {!!this.props.pendingMessage && this.renderTransactionDetail(this.props.pendingMessage)}
      </View>
        </Modal>
      </SafeAreaView>
    )
  }
}
