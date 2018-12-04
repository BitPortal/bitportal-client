import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { bindActionCreators } from 'redux'
import { Navigation } from 'react-native-navigation'
import * as dAppActions from 'actions/dApp'
import { connect } from 'react-redux'
import { parsedDappListSelector } from 'selectors/dApp'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { IntlProvider } from 'react-intl'
import { loadInjectSync } from 'utils/inject'
import messages from 'resources/messages'
import DappElement from '../DappElement'
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
export default class MyDappScene extends Component {
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

  handleMore = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappList'
      }
    })
  }

  render() {
    const { locale, componentId, eosAccountName, items } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.wrapper}>
          <ScrollView horizontal={true} scrollEnabled={false} contentContainerStyle={styles.dAppScrollViewContainer}>
            {this.props.items.map((item, index) => (
              <DappElement
                myDappStyle
                item={item}
                selected={item.get('selected')}
                key={index}
                locale={locale}
                componentId={componentId}
                eosAccountName={eosAccountName}
              />
            ))}
          </ScrollView>
        </View>
      </IntlProvider>
    )
  }
}
