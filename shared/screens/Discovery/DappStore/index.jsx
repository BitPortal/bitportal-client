import React, { PureComponent, Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import * as dAppActions from 'actions/dApp'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { parsedDappListSelector } from 'selectors/dApp'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import Alert from 'components/Alert'
import { injectIntl, IntlProvider } from 'react-intl'
import Colors from 'resources/colors'
import Images from 'resources/images'
import messages from 'resources/messages'
import styles from './styles'

@injectIntl
class DappElement extends Component {
  state = { message: undefined, subMessage: undefined, alertAction: undefined }

  getAlertMessage = (message, params) => {
    const { intl } = this.props
    if (message === 'third_party') {
      const newMessage = intl.formatMessage(
        { id: 'third_party_title' },
        { ...params }
      )
      const newMessageSub = intl.formatMessage(
        { id: 'third_party_sub' },
        { ...params }
      )
      this.setState({ message: newMessage, subMessage: newMessageSub })
    } else {
      this.setState({ message })
    }
  }

  clearMessage = () => {
    this.setState({ message: undefined, subMessage: undefined })
  }

  setAlertAction = (alertAction) => {
    this.setState({ alertAction })
  }

  getAlertAction = (item) => {
    const { alertAction } = this.state
    if (alertAction === 'toPage') {
      this.toPage(item)
    } else if (alertAction === 'toUrl') {
      this.toUrl(item)
    }
    this.clearMessage()
  }

  toPage = (item) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: item.get('url'),
        passProps: {
          // markdown: item.content,
          title: item.get('display_name').get(this.props.locale)
        }
      }
    })
  }

  toUrl = (item) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.BPWebView',
        passProps: {
          uri: item.get('url'),
          title: item.get('display_name').get(this.props.locale)
        }
      }
    })
  }

  onPress = (item, locale) => {
    const { eosAccountName } = this.props
    if (item.get('login_required') && !eosAccountName) {
      this.getAlertMessage(messages[locale].no_login, false)
    } else if (item.get('type') === 'link' && item.get('url').match(/http/g)) {
      this.getAlertMessage('third_party', {
        app: item.get('display_name').get(locale)
      })
      this.setAlertAction('toUrl')
    } else {
      this.toPage(item)
    }
  }

  render() {
    const { item, locale } = this.props
    return item.get('type') === 'more' ? (
      <View style={styles.dAppWrapper}>
        <TouchableOpacity
          style={[styles.dAppButton, { backgroundColor: 'transparent' }]}
          onPress={() => {
            Navigation.push(this.props.componentId, {
              component: { name: 'BitPortal.DappList' }
            })
          }}
        >
          <View style={styles.moreIcon}>
            <Image style={styles.icon} source={Images.discovery_more} />
          </View>
        </TouchableOpacity>
        <Text style={[styles.title]}>{messages[locale].more_apps}</Text>
      </View>
    ) : (
      <IntlProvider locale={locale}>
        <View style={styles.dAppWrapper}>
          <TouchableOpacity
            style={styles.dAppButton}
            onPress={() => {
              this.onPress(item, locale)
            }}
          >
            <Image
              style={styles.icon}
              source={
                item.get('icon_url')
                  ? { uri: `${item.get('icon_url')}` }
                  : Images.coin_logo_default
              }
            />
            {item.get('selected') ? (
              <View style={styles.favoriteStar}>
                <Ionicons
                  name="md-star"
                  size={20}
                  style={{ opacity: 0.9, color: 'yellow' }}
                />
              </View>
            ) : null}
          </TouchableOpacity>
          <Text numberOfLines={1} style={[styles.title]}>
            {item.get('display_name').get(locale)}
          </Text>
          <Alert
            message={this.state.message}
            subMessage={this.state.subMessage}
            dismiss={() => {
              this.getAlertAction(this.props.item)
            }}
            twoButton={item.get('type') === 'link'}
            onCancel={() => {
              this.clearMessage()
            }}
          />
        </View>
      </IntlProvider>
    )
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    loading: state.dApp.get('loading'),
    dAppList: parsedDappListSelector(state),
    eosAccountName: eosAccountNameSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...dAppActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class DappStore extends PureComponent {
  render() {
    const { locale, componentId, loading, eosAccountName } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <View style={styles.listTitle}>
            <Text
              style={[styles.text14, { color: Colors.textColor_255_255_238 }]}
            >
              Dapp Store
            </Text>
          </View>
          <View style={styles.hairLine} />
          <ScrollView
            horizontal={true}
            scrollEnabled={false}
            contentContainerStyle={styles.dAppScrollViewContainer}
          >
            {loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1
                }}
              >
                <ActivityIndicator size="large" />
              </View>
            ) : (
              this.props.dAppList.map((item, index) => (
                <DappElement
                  item={item}
                  key={index}
                  locale={locale}
                  componentId={componentId}
                  eosAccountName={eosAccountName}
                />
              ))
            )}
          </ScrollView>
          <View style={[styles.hairLine, { height: 10 }]} />
        </View>
      </IntlProvider>
    )
  }
}
