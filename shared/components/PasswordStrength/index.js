/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import propTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    width: 18,
    height: 20,
    padding: 2
  },
  itemContainer: {
    width: 14,
    height: 2
  }
})

const strengthColors = {
  weak:   ['rgb(255, 202, 200)', 'rgb(255, 202, 200)', 'rgb(255, 71, 64)'],
  middle: ['rgb(255, 228, 150)', 'rgb(255, 190, 0)',   'rgb(255, 190, 0)'],
  strong: ['rgb(89, 185, 226)',  'rgb(89, 185, 226)',  'rgb(89, 185, 226)']
}

class PasswordStrength extends Component {

  passwordFilter = (password) => {
    if (password.length > 12) {
      return 'strong'
    } else if (password.length > 8) {
      return 'middle'
    } else {
      return 'weak'
    }
  }

  render() {
    const { password } = this.props
    if (password) {
      const strengthType = this.passwordFilter(password)
      return (
        <View style={styles.container}>
          <View style={[styles.itemContainer, { backgroundColor: strengthColors[strengthType][0] }]} />
          <View style={[styles.itemContainer, { backgroundColor: strengthColors[strengthType][1], marginTop: 2 }]} />
          <View style={[styles.itemContainer, { backgroundColor: strengthColors[strengthType][2], marginTop: 2 }]} />
        </View>
      )
    } else {
      return null
    }
  }

}

PasswordStrength.propTypes = {
  password: propTypes.string
}

export default PasswordStrength

