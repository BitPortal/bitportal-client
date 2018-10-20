import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'

const getLevel = (strength: number) => {
  if (strength === 1) {
    return 'weak'
  } else if (strength === 2) {
    return 'middle'
  } else {
    return 'strong'
  }
}

const PasswordStrength = ({ strength }: { strength: number }) => {
  if (!strength) return null

  const level: string = getLevel(strength)

  return (
    <View style={styles.passwordStrength}>
      <Text style={[styles.text14, styles[level]]}>
        { getLevel(strength) }
      </Text>
    </View>
  )
}

export default PasswordStrength
