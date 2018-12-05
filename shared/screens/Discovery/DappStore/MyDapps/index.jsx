import React, { PureComponent } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { bindActionCreators } from 'redux'
import { Navigation } from 'react-native-navigation'
import * as dAppActions from 'actions/dApp'
import { connect } from 'react-redux'
import { parsedDappListSelector } from 'selectors/dApp'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { IntlProvider } from 'react-intl'
import { loadInjectSync } from 'utils/inject'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils/dimens'
import { TabView, TabBar } from 'react-native-tab-view'
import messages from 'resources/messages'
import FastImage from 'react-native-fast-image'
import DappElement from '../DappElement'
import MyDappScene from './MyDappScene'
import styles from './styles'

export default class DappStore extends PureComponent {
  state = {
    /*eslint-disable*/
    index: 0,
    routes: [{ key: 'first', title: '' }, { key: 'second', title: '' }]
  }

  renderScene = ({ route, items }) => {
    const { dAppList, componentId } = this.props
    const firstHalf = dAppList.slice(0, 5)
    const secondHalf = dAppList.slice(5, 10)
    switch (route.key) {
      case 'first':
        return <MyDappScene items={firstHalf} componentId={componentId} />
      case 'second':
        return <MyDappScene items={secondHalf} componentId={componentId} />
      default:
        return null
    }
  }

  _renderTabBar = props => (
    <View style={styles.container}>
      <TabBar
        {...props}
        style={styles.tabBar}
        // renderIndicator={this.renderIndicator}
        // renderLabel={this.renderLabel}
        // indicatorStyle={styles.selectedTab}
      />
    </View>
  )

  render() {
    return (
      <View style={styles.sceneContainer}>
        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={index => {
            /*eslint-disable*/
            this.setState({ index })
          }}
          initialLayout={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          renderTabBar={() => {}}
        />
      </View>
    )
  }
}
