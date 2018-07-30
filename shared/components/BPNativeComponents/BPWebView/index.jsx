import React, { Component } from 'react'
import { WebView, View, Text, Share, Linking, Clipboard, TouchableHighlight, Platform, ActivityIndicator } from 'react-native'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton, LinkingRightButton } from 'components/NavigationBar'
import { FormattedMessage, IntlProvider } from 'react-intl'
import ActionSheet from 'react-native-actionsheet'
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

export default class BPWebView extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    isCopied: false
  }

  share = () => {
    try {
      Share.share({ url: this.props.uri, title: this.props.title })
    } catch (e) {
      console.warn('share error --', e)
    }
  }

  showActionSheet = () => {
    // console.log('###', this.actionSheet)
    this.actionSheet.show()
  }

  selectActionSheet = (index) => {
    switch (index) {
      case 0:
        this.share()
        break;
      case 1:
        this.linking()
        break;

      default:
        break;
    }
  }

  linking = () => {
    const url = this.props.uri
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        // console.log(`Can't handle url: ${url}`);
      } else {
        console.log('open', url);
        Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
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

  renderLoading = () => (
    <Loading />
  )

  render() {
    const { needLinking, uri, title, name, locale } = this.props
    const { isCopied } = this.state
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={title}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            rightButton={needLinking && <LinkingRightButton iconName="ios-more" onPress={this.showActionSheet} />}
          />
          <View style={styles.content}>
            {
              uri
              && <WebView
                source={{ uri }}
                renderError={this.renderError}
                renderLoading={this.renderLoading}
                startInLoadingState={true}
                automaticallyAdjustContentInsets={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                decelerationRate="normal"
                scalesPageToFit={true}
                nativeConfig={{ props: { backgroundColor: Colors.minorThemeColor, flex: 1 } }}
              />
            }
            {
              name
              && <View style={[styles.content, styles.center]}>
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
                      isCopied
                        ? <FormattedMessage id="web_button_name_copied" />
                        : <FormattedMessage id="web_button_name_copy" />
                    }
                  </Text>
                </TouchableHighlight>
              </View>
            }
            <ActionSheet
              ref={(o) => { this.actionSheet = o }}
              title=""
              options={[
                messages[locale].web_button_name_share,
                Platform.OS === 'ios' ? messages[locale].web_button_name_linkios : messages[locale].web_button_name_linkandroid,
                messages[locale].web_button_name_cancel,
              ]}
              cancelButtonIndex={2}
              destructiveButtonIndex={1}
              onPress={index => this.selectActionSheet(index)}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
