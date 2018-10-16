import React, { Component } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import LinearGradientContainer from 'components/LinearGradientContainer'
import Colors from 'resources/colors'
import styles from './styles'

export default class BPGradientButton extends Component{
  render() {
    const { onPress, disabled, children, extraStyle } = this.props
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={onPress} disabled={disabled}>
        <LinearGradientContainer
          type="right"
          colors={disabled ? Colors.disabled : null}
          style={[styles.container, extraStyle]}
        >
          {children}
        </LinearGradientContainer>
      </TouchableWithoutFeedback>
    )
  }
}
