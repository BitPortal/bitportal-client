import React, { Component } from 'react'
import { WebView, View, Text, Share, Clipboard, TouchableHighlight } from 'react-native'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import Loading from 'components/Loading'
import { FormattedMessage, IntlProvider } from 'react-intl'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class BPWebView extends Component {

  state = {
    isVisible: false,
    isCopied: false
  }

  share = () => {
    try {
      Share.share({ url: this.props.url, title: this.props.title })
    } catch (e) {
      console.warn('share error --', e)
    }
  }

  onLoadStart = () => {
    this.setState({ isVisible: true })
  }

  onLoadEnd = () => {
    this.setState({ isVisible: false })
  }

  copyName = () => {
    Clipboard.setString(this.props.name)
    this.setState({ isCopied: true })
    this.startTimer()
  }

  // 定时刷新复制按钮
  startTimer = () => {
    this.timer = setTimeout(() => {
      this.setState({ isCopied: false })
    }, 2000)
  }

  renderError = () => (
    <View style={[styles.center, styles.content]}>
      <Text style={styles.text18}>
        <FormattedMessage id="web_title_name_err" />
      </Text>
    </View>
  )

  renderLoading = () => (
    <Loading isVisible={this.state.isVisible} />
  )

  render() {
    const { needShare, uri, title, name, locale } = this.props
    const { isCopied } = this.state
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={title}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            rightButton={needShare && <CommonRightButton iconName="md-share" onPress={() => this.share()} />}
          />
          <View style={styles.content}>
            {
              uri && 
              <WebView 
                source={{ uri }} 
                renderError={this.renderError}
                renderLoading={this.renderLoading}
                onLoadStart={this.onLoadStart}
                onLoadEnd={this.onLoadEnd}
                startInLoadingState={true}
                automaticallyAdjustContentInsets={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                decelerationRate="normal"
                scalesPageToFit={true}
              />
            }
            {
              name && 
              <View style={[styles.content, styles.center]}>
                <Text style={styles.text18}>
                  {title}{': '}{name}
                </Text>
                <TouchableHighlight
                  underlayColor={Colors.textColor_89_185_226}
                  onPress={() => this.copyName()}
                  disabled={isCopied}
                  style={[styles.btn, styles.center, { backgroundColor: isCopied ? Colors.textColor_216_216_216 : Colors.textColor_89_185_226 }]}
                >
                  <Text style={[styles.text14, { color: isCopied ? Colors.textColor_181_181_181 : Colors.textColor_255_255_238 }]}>
                    {
                      isCopied ? 
                      <FormattedMessage id="web_button_name_copied" /> 
                      : 
                      <FormattedMessage id="web_button_name_copy" />
                    }
                  </Text>
                </TouchableHighlight>
              </View>
            }
          </View>
        </View>
      </IntlProvider>
    )
  }

}

