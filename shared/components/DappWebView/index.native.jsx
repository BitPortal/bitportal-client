import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Text, Share, Linking, Platform, ActivityIndicator, InteractionManager, Clipboard } from 'react-native'
import WebViewBridge from 'react-native-webview-bridge'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { LinkingRightButton, WebViewLeftButton } from 'components/NavigationBar'
import { FormattedMessage, IntlProvider } from 'react-intl'
import Modal from 'react-native-modal'
import Url from 'url-parse'
import { mergeFavoritesDataSelector } from 'selectors/dApp'
import * as dappBrwoserActions from 'actions/dappBrowser'
import * as whiteListActions from 'actions/whiteList'
import * as dAppActions from 'actions/dApp'
import ActionModal from 'components/ActionModal'
import Prompt from 'components/Prompt'
import Loading from 'components/Loading'
import Alert from 'components/Alert'
import AddRemoveButtonAnimation from 'components/AddRemoveButton/animation'
import Toast from 'components/Toast'
import globalMessages from 'resources/messages'
import Images from 'resources/images'
import BrowserMenu from './BrowserMenu'
import localMessages from './messages'
import styles from './styles'

const messages = { ...globalMessages, ...localMessages }

const WebViewLoading = ({ text }) => (
  <View style={[styles.loadContainer, styles.center]}>
    <View style={[styles.borderStyle, styles.center]}>
      <ActivityIndicator size="small" color="white" />
      {text && <Text style={{ color: 'white', marginTop: 10 }}>{text}</Text>}
    </View>
  </View>
)

export const errorMessages = (error, messages) => {
  if (!error) {
    return null
  }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'Key derivation failed - possibly wrong passphrase':
      return messages.webview_invalid_password
    default:
      return messages.webview_signing_failed
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    whiteList: state.whiteList,
    hasPendingMessage: state.dappBrowser.get('hasPendingMessage'),
    resolvingMessage: state.dappBrowser.get('resolving'),
    sendingMessage: state.dappBrowser.get('sendingMessage'),
    loadingContract: state.dappBrowser.get('loadingContract'),
    error: state.dappBrowser.get('error'),
    selectedDapp: state.dApp.get('selected'),
    favoriteDapps: state.dApp.get('favoriteDapps'),
    mergedFavoritesDappList: mergeFavoritesDataSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...dappBrwoserActions,
        ...whiteListActions,
        ...dAppActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class DappWebView extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.sendingMessage !== prevState.sendingMessage) {
      return { sendingMessage: nextProps.sendingMessage }
    } else {
      return null
    }
  }

  state = {
    canGoBack: false,
    showPrompt: false,
    browserHistory: [this.props.uri],
    visibleMenu: false,
    visibleAnimation: false
  }

  handleBrowserMenuList = () => {

    let item = ''
    if (this.props.name) item = this.props.mergedFavoritesDappList.filter(element => element.get('name') === this.props.name).get(0)
    const menuList = [

      {
        name: globalMessages[this.props.locale].webview_button_refresh,
        onPress: () => {
          this.hideBrowserMenu()
          this.webviewbridge.reload()
        },
        icon: Images.dapp_browser_refresh
      },
      {
        name: globalMessages[this.props.locale].webview_button_copy_url,
        onPress: () => {
          this.hideBrowserMenu()
          Clipboard.setString(this.props.uri)
          Toast(globalMessages[this.props.locale].webview_copied_to_clipboard, 1000, 0)
        },
        icon: Images.dapp_browser_copy_url
      },
      {
        name: globalMessages[this.props.locale].webview_button_open_in_browser,
        onPress: () => {
          this.hideBrowserMenu()
          this.linking()
        },
        icon: Images.dapp_browser_open_in_browser
      }
       
    ]
    if (this.props.name) menuList.push({
      name: item.get('selected')
        ? globalMessages[this.props.locale].webview_button_remove_from_favorites
        : globalMessages[this.props.locale].webview_button_add_to_favorites,
      onPress: () => {
        this.toggleFavorite(item)
        setTimeout(() => this.hideBrowserMenu(), 500)
      },
      icon: item.get('selected') ? Images.dapp_browser_favorite_unsave : Images.dapp_browser_favorite_save
    })
    return menuList
  }

  componentDidUpdate(prevProps) {
    // console.log('###--xx sendingMessage: ', this.props.sendingMessage)
    if (this.props.sendingMessage && prevProps.sendingMessage !== this.props.sendingMessage && this.webviewbridge) {
      this.webviewbridge.sendToBridge(this.props.sendingMessage)
    }
  }

  share = () => {
    try {
      Share.share({ url: this.props.uri, title: this.props.title })
    } catch (e) {
      console.warn('share error --', e)
    }
  }

  linking = () => {
    const url = this.props.uri
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          // console.log(`Can't handle url: ${url}`);
        } else {
          console.log('open', url)
          Linking.openURL(url)
        }
      })
      .catch(err => console.error('An error occurred', err))
  }

  goBack = () => {
    if (this.state.browserHistory.length === 1) {
      Navigation.pop(this.props.componentId)
    } else {
      this.webviewbridge.goBack()
      this.setState(prevState => ({
        browserHistory: prevState.browserHistory.splice(0, prevState.browserHistory.length - 1)
      }))
    }
  }

  goHome = () => Navigation.pop(this.props.componentId)

  renderError = e => {
    if (e === 'WebKitErrorDomain') {
      return null
    }
    return (
      <View style={[styles.center, styles.content]}>
        <Text style={styles.text18}>{messages[this.props.locale].webview_error_text_load_failed}</Text>
      </View>
    )
  }

  onNavigationStateChange = navState => {
    const url = new Url(navState.url)
    const hostname = url.hostname
    const host = hostname.indexOf('www.') === 0 ? hostname.replace('www.', '') : hostname
    this.props.actions.setHost(host)

    this.setState({
      canGoBack: navState.canGoBack
    })
  }

  onBridgeMessage = message => {
    // console.log('###--xx receiveMessage: ', message)
    if (message.includes('clickedURL')) this.handleHistory(message)
    this.props.actions.receiveMessage(message)
  }

  handleHistory = history => {
    const url = history.match(/http.*/gi)[0]
    if (this.state.browserHistory[this.state.browserHistory.length - 1] !== url) {
      this.setState(prevState => ({ browserHistory: prevState.browserHistory.concat(url) }))
    }
  }

  rejectMessage = () => {
    this.props.actions.rejectMessage()
  }

  resolveMessage = password => {
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.recordPassword({ password })
      this.props.actions.resolveMessage({ password })
    })
  }

  showPrompt = () => {
    const { whiteList } = this.props
    const dappName = whiteList.getIn(['selectedDapp', 'dappName'])
    const dappList = whiteList.get('dappList')
    let authorized = false
    dappList.forEach(v => {
      if (v.get('dappName') === dappName) {
        authorized = v.get('authorized')
      }
    })
    if (authorized) {
      const password = whiteList.get('password')
      this.props.actions.resolveMessage({ password })
    } else {
      this.setState({ showPrompt: true })
    }
  }

  closePrompt = () => {
    this.setState({ showPrompt: false })
  }

  onSubmitEditing = event => {
    const searchText = event.nativeEvent.text

    if (searchText === this.state.uri) {
      this.webviewbridge.reload()
    } else {
      this.setState({ uri: searchText })
    }
  }

  componentWillUnmount() {
    this.props.actions.resetSelectedDapp()
  }

  onLoadEnd = () => {
    const { componentId } = this.props
    this.props.actions.noticeWhiteList({
      componentId,
      dappName: this.props.title,
      dappUrl: this.props.uri,
      iconUrl: this.props.iconUrl
    })
    this.props.actions.getWhiteListStoreInfo({ dappName: this.props.title })
  }

  renderLoading = () => <WebViewLoading />

  showBrowserMenu = () => this.setState({ visibleMenu: true })

  hideBrowserMenu = () => this.setState({ visibleMenu: false })

  toggleFavAnimation = () => {
    this.setState({ visibleAnimation: true }, () => {
      setTimeout(() => this.setState({ visibleAnimation: false }), 500)
    })
  }

  showAnimationModal = () => {
    this.setState({ visibleAnimation: true })
  }

  hideAnimationModal = () => {
    this.setState({ visibleAnimation: false })
  }

  toggleFavorite = item => {
    const { favoriteDapps, locale } = this.props
    if (favoriteDapps.toJS().length >= 8 && !item.get('selected')) {
      return Toast(globalMessages[locale].discovery_dapp_text_favourite_limit, 2000, 0)
    } else {
      this.toggleFavAnimation()
      this.props.actions.toggleFavoriteDapp({
        item,
        selected: item.get('selected')
      })
    }
  }

  render() {
    const {
      title,
      locale,
      hasPendingMessage,
      resolvingMessage,
      loadingContract,
      error,
      needLinking,
      uri,
      inject,
      item
    } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={title}
            leftButton={<WebViewLeftButton goBack={this.goBack} goHome={this.goHome} />}
            // rightButton={needLinking && <LinkingRightButton iconName="ios-more" onPress={this.showActionSheet} />}
            rightButton={<LinkingRightButton iconName="ios-more" onPress={this.showBrowserMenu} />}
          />
          <View style={styles.content}>
            <WebViewBridge
              source={{ uri }}
              onLoadEnd={this.onLoadEnd}
              ref={e => {
                this.webviewbridge = e
              }}
              renderError={this.renderError}
              renderLoading={this.renderLoading}
              startInLoadingState={true}
              useWebKit={true}
              originWhitelist={['http://', 'https://']}
              mixedContentMode="always"
              thirdPartyCookiesEnabled={true}
              automaticallyAdjustContentInsets={false}
              onNavigationStateChange={this.onNavigationStateChange}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              decelerationRate="normal"
              scalesPageToFit={true}
              nativeConfig={{ props: { backgroundColor: Colors.minorThemeColor, flex: 1 } }}
              onBridgeMessage={this.onBridgeMessage}
              injectedJavaScript={inject}
            />
            <ActionModal
              isVisible={hasPendingMessage && !resolvingMessage}
              dismiss={this.rejectMessage}
              confirm={this.showPrompt}
            />
            <Alert
              message={errorMessages(error, messages[locale])}
              dismiss={this.props.actions.clearPasswordError}
              delay={500}
            />
            <Prompt
              isVisible={this.state.showPrompt}
              type="secure-text"
              callback={this.resolveMessage}
              dismiss={this.closePrompt}
            />
          </View>
          <Loading
            isVisible={resolvingMessage || loadingContract}
            text={
              (resolvingMessage && <FormattedMessage id="webview_signing" />) ||
              (loadingContract && <FormattedMessage id="webview_fetching_contract" />)
            }
          />
          <Modal
            style={{ margin: 0 }}
            isVisible={this.state.visibleMenu}
            useNativeDriver
            hideModalContentWhileAnimating
            backdropOpacity={0.3}
          >
            <BrowserMenu
              dismissModal={this.hideBrowserMenu}
              menuList={this.handleBrowserMenuList()}
              linking={this.linking}
            />
          </Modal>
          <AddRemoveButtonAnimation visible={this.state.visibleAnimation} value={this.props.selectedDapp} />
        </View>
      </IntlProvider>
    )
  }
}
