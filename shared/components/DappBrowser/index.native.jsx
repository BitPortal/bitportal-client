import React, { Component } from 'react'
import {
  View,
  Text,
  Share,
  Linking,
  Platform,
  ActivityIndicator
} from 'react-native'
import WebViewBridge from 'react-native-webview-bridge-updated'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, {
  LinkingRightButton,
  WebViewLeftButton
} from 'components/NavigationBar'
import { escapeJSONString, parseMessageId } from 'utils'
import { FormattedMessage, IntlProvider } from 'react-intl'
import ActionSheet from 'react-native-actionsheet'
import messageHandler from 'utils/bridgeMessageHandler'
import { initEOS } from 'core/eos'
// import ActionModal from 'components/ActionModal'
import styles from './styles'
import messages from './messages'

const Loading = ({ text }) => (
  <View style={[styles.loadContainer, styles.center]}>
    <View style={[styles.borderStyle, styles.center]}>
      <ActivityIndicator size="small" color="white" />
      {text && <Text style={{ color: 'white', marginTop: 10 }}>{text}</Text>}
    </View>
  </View>
)

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
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
    canGoBack: false
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

  renderLoading = () => <Loading />

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack
    })
  }

  onBridgeMessage = async (message) => {
    let action

    try {
      action = JSON.parse(message)
    } catch (error) {
      const messageId = parseMessageId(message)
      if (messageId) {
        this.webviewbridge.sendToBridge(escapeJSONString(JSON.stringify({ messageId, type: 'parseMessageError', payload: { error: { message: 'parseMessageError: error.message' } } })))
        return
      }
    }

    const messageId = action.messageId
    switch (action.type) {
      case 'getEOSAccountInfo':
        try {
          const account = action.payload.account
          const eos = await initEOS({})
          const data = await eos.getAccount(account)
          this.webviewbridge.sendToBridge(escapeJSONString(JSON.stringify({ messageId, type: 'getEOSAccountInfoSucceeded', payload: { data } })))
        } catch (error) {
          this.webviewbridge.sendToBridge(escapeJSONString(JSON.stringify({ messageId, type: 'getEOSAccountInfoFailed', payload: { error } })))
        }
        break
      default:
        break
    }
  }

  render() {
    const { needLinking, uri, title, locale } = this.props
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
