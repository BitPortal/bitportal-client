import React, { PureComponent } from 'react'
import { View, Animated, Easing, InteractionManager } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Colors from 'resources/colors'
import { SCREEN_WIDTH, FontScale } from 'utils/dimens'
import styles from './styles'

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons)

export default class AddRemoveButtonAnimation extends PureComponent {
  state = {
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0)
  }

  componentDidMount() {
    setTimeout(() => this.animate(), 100)
  }

  animate = () => {
    const handle = InteractionManager.createInteractionHandle()
    // Animated.sequence([
    //   Animated.spring(this.state.scale, {
    //     toValue: -0.1,
    //     // friction: 7
    //     speed: 25
    //     // tension: 20,
    //     // easing: Easing.ease,
    //     // duration: 50
    //   }),
    Animated.parallel([
      Animated.spring(this.state.scale, {
        toValue: 1,
        friction: 7,
        tension: 5,
        duration: 250
        // easing: Easing.ease
      }),
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 250
        // easing: Easing.ease
      })
      // ])
    ]).start(() => InteractionManager.clearInteractionHandle(handle))
  }

  render() {
    const { value } = this.props
    const scale = this.state.scale.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2]
    })
    const opacity = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })
    return (
      <Animated.View
        style={[styles.buttonWrapper, { transform: [{ scale }], opacity }]}
      >
        <AnimatedIcon
          style={{ fontSize: 70 }}
          name={value ? 'ios-close-circle-outline' : 'ios-add-circle-outline'}
          color="white"
        />
      </Animated.View>
    )
  }
}
