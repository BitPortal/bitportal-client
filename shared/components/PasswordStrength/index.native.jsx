import React, { Component } from 'react'
import { View, Text } from 'react-native'
import messages from 'resources/messages'
import { connect } from 'react-redux'
import styles from './styles'

const getLevel = (strength, locale) => {
  if (strength === 1) {
    return messages[locale].add_eos_label_password_strength_weak
  } else if (strength === 2) {
    return messages[locale].add_eos_label_password_strength_medium
  } else {
    return messages[locale].add_eos_label_password_strength_strong
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class PasswordStrength extends Component {
  render() {
    const { strength, locale } = this.props
    if (!strength) return null
    return (
      <View style={styles.passwordStrength}>
        <Text style={[styles.text14, styles[strength]]}>
          { getLevel(strength, locale) }
        </Text>
      </View>
    )
  }
}
