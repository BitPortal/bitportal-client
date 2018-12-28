import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Text, Share, Linking, Platform, ActivityIndicator, InteractionManager, Clipboard } from 'react-native'
import WebViewBridge from 'react-native-webview-bridge'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { WebViewLeftButton } from 'components/NavigationBar'
import { FormattedMessage, IntlProvider } from 'react-intl'
import ActionSheet from 'react-native-actionsheet'
import Url from 'url-parse'
import * as dappBrwoserActions from 'actions/dappBrowser'
import ActionModal from 'components/ActionModal'
import Prompt from 'components/Prompt'
import Toast from 'components/Toast'

import Loading from 'components/Loading'
import Alert from 'components/Alert'
import BrowserMenu from 'components/DappWebView/BrowserMenu'
import SearchWebsiteForm from 'components/Form/SearchWebsiteForm'
import globalMessages from 'resources/messages'
import { loadInjectSync } from 'utils/inject'
import Images from 'resources/images'
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
    hasPendingMessage: state.dappBrowser.get('hasPendingMessage'),
    resolvingMessage: state.dappBrowser.get('resolving'),
    sendingMessage: state.dappBrowser.get('sendingMessage'),
    loadingContract: state.dappBrowser.get('loadingContract'),
    error: state.dappBrowser.get('error')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...dappBrwoserActions
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

  inject = loadInjectSync()

  componentDidUpdate(prevProps) {
    if (this.props.sendingMessage && prevProps.sendingMessage !== this.props.sendingMessage && this.webviewbridge) {
      // console.log('###--yy sendingMessage: --', this.props.sendingMessage)
      this.webviewbridge.sendToBridge(this.props.sendingMessage)
    }
  }

  state = {
    canGoBack: false,
    showPrompt: false,
    uri: 'https://www.myeoskit.com/tools/',
    visibleMenu: false
  }

  share = () => {
    try {
      Share.share({ url: this.props.uri, title: this.props.title })
    } catch (e) {
      console.warn('share error --', e)
    }
  }

  showActionSheet = () => {
    this.actionSheet.show()
  }

  selectActionSheet = index => {
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
    const url = this.state.uri
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          // console.log(`Can't handle url: ${url}`);
        } else {
          // console.log('open', url)
          Linking.openURL(url)
        }
      })
      .catch(err => console.error('An error occurred', err))
  }

  goBack = () => (this.state.canGoBack ? this.webviewbridge.goBack() : Navigation.pop(this.props.componentId))

  goHome = () => Navigation.pop(this.props.componentId)

  renderError = e => {
    if (e === 'WebKitErrorDomain') {
      return null
    }
    return (
      <View style={[styles.center, styles.content]}>
        <Text style={styles.text18}>
          <FormattedMessage id="webview_error_text_load_failed" />
        </Text>
      </View>
    )
  }

  renderLoading = () => <WebViewLoading />

  onNavigationStateChange = navState => {
    // const url = new Url(navState.url)
    // let url
    // if (this.state.uri.includes('http://') === false) {
    //   url = new Url(`http://${this.state.uri}`)
    // } else {
    //   url = new Url(this.state.uri)
    // }
    const url = new Url(this.state.uri)

    const hostname = url.hostname
    const host = hostname.indexOf('www.') === 0 ? hostname.replace('www.', '') : hostname
    this.props.actions.setHost(host)

    this.setState({
      canGoBack: navState.canGoBack
    })
  }

  onBridgeMessage = message => {
    this.props.actions.receiveMessage(message)
  }

  rejectMessage = () => {
    this.props.actions.rejectMessage()
  }

  resolveMessage = password => {
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.resolveMessage({ password })
    })
  }

  showPrompt = () => {
    this.setState({ showPrompt: true })
  }

  closePrompt = () => {
    this.setState({ showPrompt: false })
  }

  onSubmitEditing = event => {
    let searchText = event.nativeEvent.text
    if (!searchText.match(/^[a-zA-Z]+:\/\//)) {
      searchText = `http://${searchText}`
    }
    if (searchText === this.state.uri) {
      this.webviewbridge.reload()
    } else {
      this.setState({ uri: searchText })
    }
  }

  showBrowserMenu = () => this.setState({ visibleMenu: true })

  hideBrowserMenu = () => this.setState({ visibleMenu: false })

  handleBrowserMenuList = () => {
    let item = ''
    if (this.props.name)
      item = this.props.mergedFavoritesDappList.filter(element => element.get('name') === this.props.name).get(0)
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
    if (this.props.name)
      menuList.push({
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

  render() {
    const { title, locale, hasPendingMessage, resolvingMessage, loadingContract, error, inject } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={title}
            leftButton={<WebViewLeftButton goBack={this.goBack} goHome={this.goHome} />}
            rightButton={
              <SearchWebsiteForm onSubmitEditing={this.onSubmitEditing} showBrowserMenu={this.showBrowserMenu} />
            }
          />
          <View style={styles.content}>
            <WebViewBridge
              source={{ uri: this.state.uri }}
              ref={e => {
                this.webviewbridge = e
              }}
              renderError={this.renderError}
              renderLoading={this.renderLoading}
              startInLoadingState={true}
              useWebKit={true}
              originWhitelist={["http://.*", "https://.*"]}
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
              injectedJavaScript={this.inject}
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
            <ActionSheet
              ref={o => {
                this.actionSheet = o
              }}
              title=""
              options={[
                messages[locale].webview_button_share,
                Platform.OS === 'ios'
                  ? messages[locale].webview_button_open_in_safari
                  : messages[locale].webview_button_open_in_browser,
                messages[locale].webview_button_cancel
              ]}
              cancelButtonIndex={2}
              destructiveButtonIndex={1}
              onPress={this.selectActionSheet}
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
        </View>
      </IntlProvider>
    )
  }
}
