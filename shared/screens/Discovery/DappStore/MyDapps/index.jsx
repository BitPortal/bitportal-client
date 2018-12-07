import React, { PureComponent } from 'react'
import { View, Animated } from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils/dimens'
import { TabView, TabBar } from 'react-native-tab-view'
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

  _renderIndicator = props => {
    // const { width, position } = props
    const { position } = props
    const inputRange = [0, 0.48, 0.49, 0.51, 0.52, 1, 1.48, 1.49, 1.51, 1.52, 2]
    // const inputRange = [0, 1, 2]

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
            return <View style={styles.activeIndicator} />
          } else {
            return <View style={styles.indicator} />
          }
        })}
      </Animated.View>
    )
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
          // renderTabBar={() => {}}
          tabBarPosition="bottom"
          renderTabBar={this._renderTabBar}
        />
      </View>
    )
  }
}
