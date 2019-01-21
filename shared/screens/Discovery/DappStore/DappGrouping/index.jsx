import React, { Component } from 'react'
import { View, Animated } from 'react-native'
import { bindActionCreators } from 'redux'
import * as dAppActions from 'actions/dApp'
import { connect } from 'react-redux'
import { parsedDappListSelector } from 'selectors/dApp'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils/dimens'
import { TabView, TabBar } from 'react-native-tab-view'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DappGroupScene from './DappGroupScene'
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
export default class DappGrouping extends Component {
  state = {
    /*eslint-disable*/
    index: 0,
    routes: [{ key: 'first', title: '' }, { key: 'second', title: '' }, { key: 'third', title: '' }]
  }

  componentWillReceiveProps() {
    const length = this.props.items.size
    if (length <= 3) this.setState({ routes: [{ key: 'first', title: '' }] })
    if (length > 3 && length <= 6)
      this.setState({ routes: [{ key: 'first', title: '' }, { key: 'second', title: '' }] })
    if (length > 6)
      this.setState({ routes: [{ key: 'first', title: '' }, { key: 'second', title: '' }, { key: 'third', title: '' }] })
  }

  renderScene = ({ route }) => {
    const { items, componentId } = this.props
    const pageOneContent = items.slice(0, 3)
    const pageTwoContent = items.slice(3, 6)
    const pageThreeContent = items.slice(6, 9)

    switch (route.key) {
      case 'first':
        return <DappGroupScene items={pageOneContent} componentId={componentId} pageStyle={'first'} />
      case 'second':
        return <DappGroupScene items={pageTwoContent} componentId={componentId} pageStyle={'middle'} />
      case 'third':
        return <DappGroupScene items={pageThreeContent} componentId={componentId} pageStyle={'end'} />
      default:
        return null
    }
  }

  _renderIndicator = props => {
    const { position } = props
    const inputRange = [0, 0.48, 0.49, 0.51, 0.52, 1, 1.48, 1.49, 1.51, 1.52, 2]

    const scale = position.interpolate({
      inputRange,
      outputRange: inputRange.map(x => (Math.trunc(x) === x ? 2 : 0.1))
    })
    const opacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(x => {
        const d = x - Math.trunc(x)
        return d === 0.49 || d === 0.51 ? 0 : 1
      })
    })
    const translateX = position.interpolate({
      inputRange: inputRange,
      outputRange: inputRange.map(x => Math.round(x - 1) * 20)
    })
    // const backgroundColor = position.interpolate({
    //   inputRange,
    //   outputRange: inputRange.map(x => props.navigationState.routes[Math.round(x)].color)
    // })

    return (
      <Animated.View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        {/* <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
          <Animated.View style={[styles.indicator, { opacity, transform: [{ scale }] }]} />
        </Animated.View> */}
        {props.navigationState.routes.map((e, i) => {
          if (i === props.navigationState.index) {
            return <View style={styles.activeIndicator} key={i} />
          } else {
            return <View style={styles.indicator} key={i} />
          }
        })}
      </Animated.View>
    )
  }

  _renderIcon = ({ route }) => <Ionicons name={route.icon} size={24} style={styles.icon} />

  _renderBadge = ({ route }) => {
    if (route.key === '2') {
      return (
        <View style={styles.badge}>
          <Text style={styles.count}>42</Text>
        </View>
      )
    }
    return null
  }

  _renderTabBar = props => {
    return (
      <TabBar
        {...props}
        // renderIcon={this._renderIcon}
        // renderBadge={this._renderBadge}
        renderIndicator={this._renderIndicator}
        style={styles.tabbar}
      />
    )
  }

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
          tabBarPosition="bottom"
          // renderTabBar={() => {}}
          renderTabBar={this.props.items.size <= 3 ? () => {} : this._renderTabBar}
        />
      </View>
    )
  }
}
