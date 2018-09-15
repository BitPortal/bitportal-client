import React from 'react'
import { connect } from 'react-redux'
import { View, TouchableHighlight, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import * as dAppActions from 'actions/dApp'
import { IntlProvider, injectIntl } from 'react-intl'
import AddRemoveButton from 'components/AddRemoveButton'
import Alert from 'components/Alert'
import Toast from 'components/Toast'

import Colors from 'resources/colors'
import Images from 'resources/images'
import messages from 'resources/messages'
import styles from './styles'

@injectIntl
@connect(
  state => ({
    favoriteDapps: state.dApp.get('favoriteDapps')
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
export default class DappListItem extends React.PureComponent {
  state = { message: undefined, subMessage: undefined, alertAction: undefined }

  toggleFavorite = (item) => {
    const { favoriteDapps, locale } = this.props
    if (favoriteDapps.toJS().length >= 8 && !item.get('selected')) {
      return Toast(messages[locale].discovery_dapp_text_favourite_limit, 2000, 0)
    } else {
      this.props.showModal()
      this.props.actions.toggleFavoriteDapp({
        item,
        selected: item.get('selected')
      })
      setTimeout(() => this.props.hideModal(), 500)
    }
  }

  getAlertMessage = (message, params) => {
    const { intl } = this.props
    if (message === 'third_party') {
      const newMessage = intl.formatMessage(
        { id: 'discovery_dapp_popup_label_redirect' },
        { ...params }
      )
      const newMessageSub = intl.formatMessage(
        { id: 'discovery_dapp_popup_text_redirect' },
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
    return (
      <IntlProvider locale={locale}>
        <TouchableHighlight
          underlayColor={Colors.hoverColor}
          onPress={() => {
            this.onPress(item, locale)
          }}
        >
          <View style={styles.rowContainer}>
            <FastImage
              style={styles.image}
              source={
                item.get('icon_url')
                  ? { uri: `${item.get('icon_url')}` }
                  : Images.coin_logo_default
              }
            />
            <View style={styles.right}>
              <Text style={styles.title}>
                {item.get('display_name').get(locale)}
              </Text>
              <View style={styles.infoArea}>
                <Text numberOfLines={1} style={styles.subTitle}>
                  {item.get('description').get(locale)}
                </Text>
              </View>
            </View>
            <AddRemoveButton
              value={this.props.selected}
              onValueChange={() => {
                this.toggleFavorite(item)
              }}
            />
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
        </TouchableHighlight>
      </IntlProvider>
    )
  }
}
