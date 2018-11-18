import React, { PureComponent } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { bindActionCreators } from 'redux'
import { Navigation } from 'react-native-navigation'
import * as dAppActions from 'actions/dApp'
import { connect } from 'react-redux'
import { parsedDappListSelector } from 'selectors/dApp'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { IntlProvider } from 'react-intl'
import { loadInjectSync } from 'utils/inject'
import Colors from 'resources/colors'
import messages from 'resources/messages'
import DappElement from './DappElement'
import styles from './styles'

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
  showDappBrowser = () => {
    const inject = loadInjectSync()

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappBrowser',
        passProps: {
          uri: 'https://build-hsehfjdqjt.now.sh/',
          inject
        }
      }
    })
  }

  render() {
    const { locale, componentId, loading, eosAccountName } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onLongPress={this.showDappBrowser}>
            <View style={styles.listTitle}>
              <Text style={[styles.text14, { fontWeight: 'bold', color: Colors.textColor_255_255_238 }]}>
                {messages[this.props.locale].discovery_label_dapp_store}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.hairLine} />
          <ScrollView horizontal={true} scrollEnabled={false} contentContainerStyle={styles.dAppScrollViewContainer}>
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
        </View>
      </IntlProvider>
    )
  }
}
