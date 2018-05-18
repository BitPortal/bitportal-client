/* @jsx */
/* eslint-disable */

import React from 'react'
import { View } from 'react-native'
import styles from './styles'

const getLevel = (strength) => {
  if (strength === 1) return 'weak'
  if (strength === 2) return 'middle'
  if (strength >= 3) return 'strong'
}

const PasswordStrength = ({ strength }) => {
  if (!strength) return null

  const level = getLevel(strength)

  return (
    <View style={styles.passwordStrength}>
      <View style={[styles.block, styles[level]]} />
      <View style={[styles.block, styles[level]]} />
      <View style={[styles.block, styles[level]]} />
    </View>
  )
}

export default PasswordStrength
