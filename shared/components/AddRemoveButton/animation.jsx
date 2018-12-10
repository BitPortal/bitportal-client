import React, { Component } from 'react'
import { Animated, InteractionManager } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './styles'

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons)

export default class AddRemoveButtonAnimation extends Component {
  state = {
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0)
  }

  componentDidMount() {
    // setTimeout(() => this.animate(), 100)
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && prevProps.visible !== this.props.visible) this.animate()
  }

  animate = () => {
    const handle = InteractionManager.createInteractionHandle()
    this.state.scale.setValue(0)
    this.state.opacity.setValue(0)
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
        duration: 500
        // easing: Easing.ease
      }),
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 500
        // easing: Easing.ease
      })
    ]).start(() => {
      InteractionManager.clearInteractionHandle(handle)
    })
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
    return !this.props.visible ? null : (
      <Animated.View style={[styles.container, styles.center, styles.positionStyle, styles.backStyle]}>
        <Animated.View style={[styles.buttonWrapper, { transform: [{ scale }], opacity }]}>
          <AnimatedIcon
            style={{ fontSize: 70 }}
            name={value ? 'ios-close-circle-outline' : 'ios-add-circle-outline'}
            color="white"
          />
        </Animated.View>
      </Animated.View>
    )
  }
}
