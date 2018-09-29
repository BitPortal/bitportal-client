import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import {
  View,
  Text,
  Share,
  Linking,
  Platform,
  ActivityIndicator,
  InteractionManager
} from 'react-native'
import RNFS from 'react-native-fs'
import WebViewBridge from 'react-native-webview-bridge'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, {
  WebViewLeftButton
} from 'components/NavigationBar'
import { FormattedMessage, IntlProvider } from 'react-intl'
import ActionSheet from 'react-native-actionsheet'
import * as dappBrwoserActions from 'actions/dappBrowser'
import ActionModal from 'components/ActionModal'
import Prompt from 'components/Prompt'
import SearchWebsiteForm from 'components/Form/SearchWebsiteForm'
import messages from 'resources/messages'
import styles from './styles'

const WebViewLoading = ({ text }) => (
  <View style={[styles.loadContainer, styles.center]}>
    <View style={[styles.borderStyle, styles.center]}>
      <ActivityIndicator size="small" color="white" />
      {text && <Text style={{ color: 'white', marginTop: 10 }}>{text}</Text>}
    </View>
  </View>
)

@connect(
  state => ({
    locale: state.intl.get('locale'),
    hasPendingMessage: state.dappBrowser.get('hasPendingMessage'),
    resolvingMessage: state.dappBrowser.get('resolving'),
    sendingMessage: state.dappBrowser.get('sendingMessage')
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...dappBrwoserActions
    }, dispatch)
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

  componentDidUpdate(prevProps) {
    if (this.props.sendingMessage && prevProps.sendingMessage !== this.props.sendingMessage && this.webviewbridge) {
      this.webviewbridge.sendToBridge(this.props.sendingMessage)
    }
  }

  state = {
    canGoBack: false,
    showPrompt: false,
    uri: 'https://build-prguimiryr.now.sh/'
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

  goBack = () => (this.state.canGoBack ? this.webviewbridge.goBack() : Navigation.pop(this.props.componentId))

  goHome = () => Navigation.pop(this.props.componentId)

  renderError = (e) => {
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

  renderLoading = () => (<WebViewLoading />)

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack
    })
  }

  onBridgeMessage = (message) => {
    this.props.actions.receiveMessage(message)
  }

  rejectMessage = () => {
    this.props.actions.rejectMessage()
  }

  resolveMessage = (password) => {
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

  onSubmitEditing = (event) => {
    const searchText = event.nativeEvent.text

    if (searchText === this.state.uri) {
      this.webviewbridge.reload()
    } else {
      this.setState({ uri: searchText })
    }
  }

  componentDidMount() {
    RNFS.readFile(RNFS.MainBundlePath + '/inject.js', 'utf8')
      .then((contents) => {
        this.setState({ additionalScripts: contents })
      })
  }

  render() {
    const {
      title,
      locale,
      hasPendingMessage,
      resolvingMessage
    } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={title}
            leftButton={<WebViewLeftButton goBack={this.goBack} goHome={this.goHome} />}
            rightButton={<SearchWebsiteForm onSubmitEditing={this.onSubmitEditing} />}
          />
          <View style={styles.content}>
            {!!this.state.additionalScripts && <WebViewBridge
              source={{ uri: this.state.uri }}
              ref={(e) => { this.webviewbridge = e }}
              renderError={this.renderError}
              renderLoading={this.renderLoading}
              startInLoadingState={true}
              automaticallyAdjustContentInsets={false}
              onNavigationStateChange={this.onNavigationStateChange}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              decelerationRate="normal"
              scalesPageToFit={true}
              nativeConfig={{ props: { backgroundColor: Colors.minorThemeColor, flex: 1 } }}
              onBridgeMessage={this.onBridgeMessage}
              injectedJavaScript={this.state.additionalScripts}
            />}
            <ActionModal
              isVisible={hasPendingMessage && !resolvingMessage}
              dismiss={this.rejectMessage}
              confirm={this.showPrompt}
            />
            <Prompt
              isVisible={this.state.showPrompt}
              type="secure-text"
              callback={this.resolveMessage}
              dismiss={this.closePrompt}
            />
            <ActionSheet
              ref={(o) => { this.actionSheet = o }}
              title=""
              options={[
                messages[locale].webview_button_share,
                Platform.OS === 'ios' ? messages[locale].webview_button_open_in_safari : messages[locale].webview_button_open_in_browser,
                messages[locale].webview_button_cancel
              ]}
              cancelButtonIndex={2}
              destructiveButtonIndex={1}
              onPress={this.selectActionSheet}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
