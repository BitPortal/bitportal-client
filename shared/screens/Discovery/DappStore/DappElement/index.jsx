import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as dAppActions from 'actions/dApp'
import { View, Text, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Alert from 'components/Alert'
import { injectIntl, IntlProvider } from 'react-intl'
import BPImage from 'components/BPNativeComponents/BPImage'
import { loadInjectSync } from 'utils/inject'
import Images from 'resources/images'
import messages from 'resources/messages'
import { onEventWithMap } from 'utils/analytics'
import { DAPP_STORE } from 'constants/analytics'
import styles from './styles'

@connect(
  null,
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
@injectIntl
export default class DappElement extends Component {
  state = { message: undefined, subMessage: undefined, alertAction: undefined }

  getAlertMessage = (message, params) => {
    const { intl } = this.props
    if (message === 'third_party') {
      const newMessage = intl.formatMessage({ id: 'discovery_dapp_popup_label_redirect' }, { ...params })
      const newMessageSub = intl.formatMessage({ id: 'discovery_dapp_popup_text_redirect' }, { ...params })
      this.setState({ message: newMessage, subMessage: newMessageSub })
    } else {
      this.setState({ message })
    }
  }

  clearMessage = () => {
    this.setState({ message: undefined, subMessage: undefined })
  }

  setAlertAction = alertAction => {
    this.setState({ alertAction })
  }

  getAlertAction = item => {
    const { alertAction } = this.state
    if (alertAction === 'toPage') {
      this.toPage(item)
    } else if (alertAction === 'toUrl') {
      this.toUrl(item)
    }
    this.clearMessage()
  }

  toPage = item => {
    Navigation.push(this.props.componentId, {
      component: {
        name: item.get('url'),
        passProps: {
          // markdown: item.content,
          title: item.get('display_name').get(this.props.locale) || item.get('display_name').get('en')
        }
      }
    })
  }

  toUrl = item => {
    const inject = loadInjectSync()

    const { eosAccountName, selected } = this.props
    // Umeng analitics
    onEventWithMap(DAPP_STORE, {
      dappName: item.get('display_name').get(this.props.locale) || item.get('display_name').get('en'),
      walletId: eosAccountName
    })
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappWebView',
        passProps: {
          uri: item.get('url'),
          iconUrl: item.get('icon_url'),
          title: item.get('display_name').get(this.props.locale) || item.get('display_name').get('en'),
          inject,
          item,
          name: item.get('name')
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
        app: item.get('display_name').get(locale) || item.get('display_name').get('en')
      })
      this.setAlertAction('toUrl')
    } else {
      this.toPage(item)
    }
  }

  render() {
    const { item, locale } = this.props
    // return
    // item.get('type') === 'more' ? (
    //   <View style={styles.dAppWrapper}>
    //     <TouchableOpacity
    //       style={[styles.dAppButton, { backgroundColor: 'transparent' }]}
    //       onPress={() => {
    //         Navigation.push(this.props.componentId, {
    //           component: { name: 'BitPortal.DappList' }
    //         })
    //       }}
    //     >
    //       <View style={styles.moreIcon}>
    //         <BPImage style={styles.icon} source={Images.discovery_more} />
    //       </View>
    //     </TouchableOpacity>
    //     <Text style={[styles.title]}>{messages[locale].discovery_label_dapp_more}</Text>
    //   </View>
    // ) :
    return (
      <IntlProvider locale={locale}>
        {this.props.rowItem ? (
          <View>
            <TouchableOpacity
              style={styles.dAppWrapperRowItem}
              onPress={() => {
                this.onPress(item, locale)
              }}
            >
              <View style={styles.iconWrapper}>
                <BPImage
                  style={styles.icon}
                  source={item.get('icon_url') ? { uri: `${item.get('icon_url')}` } : Images.dapp_logo_default}
                />
                {item.get('selected') ? (
                  <View style={styles.rowFavoriteWrapper}>
                    <BPImage style={styles.favoriteStar} source={Images.list_favorite} />
                  </View>
                ) : null}
              </View>
              <View style={styles.rowTextWrapper}>
                <View style={styles.titleTextWrapper}>
                  <Text numberOfLines={1} style={[styles.rowTitle]}>
                    {item.get('display_name').get(locale) || item.get('display_name').get('en')}
                  </Text>
                  {item.get('is_highrisk') && <BPImage style={styles.titleSideLabel} source={Images.dapp_high_risk} />}
                </View>
                <Text numberOfLines={1} style={styles.categoryText}>
                  {messages[locale][item.get('category')]}
                </Text>
                <Text numberOfLines={1} style={styles.rowDescription}>
                  {item.get('description').get(locale)}
                </Text>
              </View>
              <Alert
                message={this.state.message}
                subMessage={this.state.subMessage}
                negativeText={messages[locale].discovery_dapp_popup_button_cancel}
                positiveText={messages[locale].discovery_dapp_popup_button_understand}
                dismiss={() => {
                  this.getAlertAction(this.props.item)
                }}
                twoButton={item.get('type') === 'link'}
                onCancel={() => {
                  this.clearMessage()
                }}
              />
            </TouchableOpacity>
            <View style={styles.hairLine} />
          </View>
        ) : (
          <View style={styles.dAppWrapper}>
            <TouchableOpacity
              style={styles.center}
              onPress={() => {
                this.onPress(item, locale)
              }}
            >
              <View style={styles.dAppButton}>
                <BPImage
                  style={styles.icon}
                  source={item.get('icon_url') ? { uri: `${item.get('icon_url')}` } : Images.dapp_logo_default}
                />
                {item.get('selected') ? (
                  <View style={styles.favoriteWrapper}>
                    <BPImage style={styles.favoriteStar} source={Images.list_favorite} />
                  </View>
                ) : null}
                {item.get('is_hot') ? (
                  <View style={styles.hotNewWrapper}>
                    {/* <BPImage style={styles.favoriteStar} source={Images.list_favorite} /> */}
                    <BPImage style={styles.hotNewTag} source={Images.list_hot} />
                  </View>
                ) : null}
                {item.get('is_new') ? (
                  <View style={styles.hotNewWrapper}>
                    {/* <BPImage style={styles.favoriteStar} source={Images.list_favorite} /> */}
                    <BPImage style={styles.hotNewTag} source={Images.list_new} />
                  </View>
                ) : null}
              </View>
              <Text numberOfLines={1} style={[styles.title]}>
                {item.get('display_name').get(locale) || item.get('display_name').get('en')}
              </Text>
              <Text numberOfLines={1} style={styles.categoryText}>
                {messages[locale][item.get('category')]}
              </Text>
            </TouchableOpacity>
            <Alert
              message={this.state.message}
              subMessage={this.state.subMessage}
              negativeText={messages[locale].discovery_dapp_popup_button_cancel}
              positiveText={messages[locale].discovery_dapp_popup_button_understand}
              dismiss={() => {
                this.getAlertAction(this.props.item)
              }}
              twoButton={item.get('type') === 'link'}
              onCancel={() => {
                this.clearMessage()
              }}
            />
          </View>
        )}
      </IntlProvider>
    )
  }
}
