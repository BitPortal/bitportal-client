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
import WebViewBridge from 'react-native-webview-bridge-updated'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, {
  LinkingRightButton,
  WebViewLeftButton
} from 'components/NavigationBar'
import { FormattedMessage, IntlProvider } from 'react-intl'
import ActionSheet from 'react-native-actionsheet'
import * as dappBrwoserActions from 'actions/dappBrowser'
import messageHandler from 'utils/bridgeMessageHandler'
import ActionModal from 'components/ActionModal'
import Prompt from 'components/Prompt'
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
    messageInfoAmount: state.dappBrowser.getIn(['pendingMessage', 'info', 'amount']),
    messageInfoSymbol: state.dappBrowser.getIn(['pendingMessage', 'info', 'symbol']),
    messageInfoContract: state.dappBrowser.getIn(['pendingMessage', 'info', 'contract']),
    messageInfoFromAccount: state.dappBrowser.getIn(['pendingMessage', 'info', 'fromAccount']),
    messageInfoToAccount: state.dappBrowser.getIn(['pendingMessage', 'info', 'toAccount']),
    messageInfoMemo: state.dappBrowser.getIn(['pendingMessage', 'info', 'memo']),
    messageInfoVoter: state.dappBrowser.getIn(['pendingMessage', 'info', 'voter']),
    messageInfoProducers: state.dappBrowser.getIn(['pendingMessage', 'info', 'producers']),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...dappBrwoserActions
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class DappBrowser extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    canGoBack: false,
    showPrompt: false
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

  // goForward = () => this.webview.goForward()

  renderError = (e) => {
    if (e === 'WebKitErrorDomain') {
      return null
    }
    return (
      <View style={[styles.center, styles.content]}>
        <Text style={styles.text18}>
          <FormattedMessage id="web_title_name_err" />
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

  componentDidMount() {
    this.props.actions.initDappBrowser(this.webviewbridge)
  }

  componentWillUnmount() {
    this.props.actions.closeDappBrowser()
  }

  render() {
    const {
      needLinking,
      uri,
      title,
      locale,
      hasPendingMessage,
      resolvingMessage,
      messageInfoAmount,
      messageInfoSymbol,
      messageInfoContract,
      messageInfoFromAccount,
      messageInfoToAccount,
      messageInfoMemo,
      messageInfoVoter,
      messageInfoProducers
    } = this.props
    const injectScript = `(function () { ${messageHandler} }())`

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={title}
            leftButton={<WebViewLeftButton goBack={this.goBack} goHome={this.goHome} />}
            rightButton={needLinking && <LinkingRightButton iconName="ios-more" onPress={this.showActionSheet} />}
          />
          <View style={styles.content}>
            <WebViewBridge
              source={{ uri }}
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
              injectedJavaScript={injectScript}
            />
            <ActionModal
              isVisible={hasPendingMessage && !resolvingMessage}
              dismiss={this.rejectMessage}
              amount={messageInfoAmount}
              fromAccount={messageInfoFromAccount}
              toAccount={messageInfoToAccount}
              memo={messageInfoMemo}
              symbol={messageInfoSymbol}
              contract={messageInfoContract}
              voter={messageInfoVoter}
              producers={messageInfoProducers}
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
                messages[locale].web_button_name_share,
                Platform.OS === 'ios' ? messages[locale].web_button_name_linkios : messages[locale].web_button_name_linkandroid,
                messages[locale].web_button_name_cancel
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