import * as React from 'react'
import { View, Text, Dimensions, Animated, I18nManager } from 'react-native'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import LinearGradientContainer from 'components/LinearGradientContainer'
import { FLOATING_CARD_WIDTH } from 'utils/dimens'
import Cpu from './Cpu'
import Ram from './Ram'
import Net from './Net'
// import Net from './Net'
import styles from './styles'

// const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradientContainer);

export default class SystemResources extends React.Component {
  state = {
    /*eslint-disable*/
    index: 0,
    routes: [{ key: 'first', title: 'CPU' }, { key: 'second', title: 'RAM' }, { key: 'third', title: 'NET' }]
  }

  /*eslint-enable*/
  renderLabel = label => <Text style={{ color: 'white' }}>{label.route.title}</Text>

  renderIndicator = props => {
    const { position, navigationState } = props
    const width = FLOATING_CARD_WIDTH / 3
    const translateX = Animated.multiply(
      Animated.multiply(
        position.interpolate({
          inputRange: [0, navigationState.routes.length - 1],
          outputRange: [0, navigationState.routes.length - 1],
          extrapolate: 'clamp'
        }),
        width
      ),
      I18nManager.isRTL ? -1 : 1
    )
    return (
      <Animated.View style={[styles.singleTab, { width, transform: [{ translateX }] }]}>
        <LinearGradientContainer style={styles.singleTab} />
      </Animated.View>
    )
  }

  _renderTabBar = props => (
    <View style={styles.container}>
      <TabBar
        {...props}
        style={styles.tabBar}
        renderIndicator={this.renderIndicator}
        renderLabel={this.renderLabel}
        indicatorStyle={styles.selectedTab}
      />
    </View>
  )

  render() {
    const { componentId } = this.props
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: Cpu,
          second: () => <Ram componentId={componentId} />,
          third: Net
        })}
        onIndexChange={index => {
          /*eslint-disable*/
          this.setState({ index })
        }}
        initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
        renderTabBar={this._renderTabBar}
      />
    )
  }
}
