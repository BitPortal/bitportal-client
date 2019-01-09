import React, { PureComponent } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { bindActionCreators } from 'redux'
import { Navigation } from 'react-native-navigation'
import * as dAppActions from 'actions/dApp'
import { connect } from 'react-redux'
import { parsedDappListSelector, hotDappsSelector, newDappsSelector, dAppSectionsSelector } from 'selectors/dApp'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { IntlProvider } from 'react-intl'
import { loadInjectSync } from 'utils/inject'
import messages from 'resources/messages'
import FastImage from 'react-native-fast-image'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Images from 'resources/images'
import DappElement from './DappElement'
import MyDapps from './MyDapps'
import DappGrouping from './DappGrouping'
import DappCategories from './DappCategories'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    loading: state.dApp.get('loading'),
    loaded: state.dApp.get('loaded'),
    dAppList: parsedDappListSelector(state),
    hotDapps: hotDappsSelector(state),
    newDapps: newDappsSelector(state),
    dAppSections: dAppSectionsSelector(state),
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

  handleMore = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappList',
        passProps: { section: 'all' }
      }
    })
  }

  render() {
    const {
      locale,
      componentId,
      loading,
      loaded,
      eosAccountName,
      dAppList,
      hotDapps,
      newDapps,
      dAppSections
    } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          {/* {loading || !loaded ? 
            <View style={styles.center}>
              <View style={styles.sectionHeader} />
              <View style={styles.dAppScrollViewContainer}>
                <ActivityIndicator size="large" />
              </View>
              <View style={[styles.sectionHeader, {}]} />
              <View style={[styles.dAppScrollViewContainer, { height: 200 }]}>
                <ActivityIndicator size="large" />
              </View>
              <View style={[styles.sectionHeader, {}]} />
              <View style={[styles.dAppScrollViewContainer, { height: 200 }]}>
                <ActivityIndicator size="large" />
              </View>
            </View>
           :  */}
            <View>
              <View style={styles.sectionHeader}>
                <View style={styles.row}>
                  <FastImage style={styles.categoryIcon} source={Images.dapp_mydapp} />
                  <Text style={styles.title}>{`  ${messages[locale].discovery_label_dapp_store}`}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton} onPress={this.handleMore}>
                  <View style={styles.row}>
                    <Text style={styles.moreText}>{messages[locale].dapp_button_my_dapp_all}</Text>
                    {/* <FastImage style={styles.categoryIcon} /> */}
                    <Ionicons name="ios-arrow-forward" size={24} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
              <MyDapps dAppList={dAppList} componentId={componentId} />
              <View style={styles.sectionHeader}>
                <View style={styles.row}>
                  <FastImage style={styles.categoryIcon} source={Images.dapp_hot} />
                  <Text style={styles.title}>{`  ${messages[locale].dapp_label_hot_dapp}`}</Text>
                </View>
              </View>
              <DappGrouping title="hot" items={hotDapps} icon={null} componentId={componentId} />
              <View style={styles.sectionHeader}>
                <View style={styles.row}>
                  <FastImage style={styles.categoryIcon} source={Images.dapp_new} />
                  <Text style={styles.title}>{`  ${messages[locale].dapp_label_new_dapp}`}</Text>
                </View>
              </View>
              <DappGrouping title="new" items={newDapps} icon={null} componentId={componentId} />
              <View style={styles.sectionHeader}>
                <View style={styles.row}>
                  <FastImage style={styles.categoryIcon} source={Images.dapp_category} />
                  <Text style={styles.title}>{`  ${messages[locale].dapp_label_category}`}</Text>
                </View>
              </View>
              <DappCategories items={dAppSections} componentId={componentId} />
            </View>
          {/* } */}
        </View>
      </IntlProvider>
    )
  }
}
