
import React, { Component } from 'react'
import styles from './styles'
import Colors from 'resources/colors'
import { FontScale } from 'utils/dimens'
import { Text, View, TextInput } from 'react-native'

export default AlertInput = ({ value, title, unit, onChangeText }) => (
  <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
    <Text style={[styles.text14, { marginBottom: 10, color: Colors.textColor_149_149_149 }]}> {title} </Text>
    <View style={styles.textInputContainer}>
      <TextInput
        autoCorrect={false}
        underlineColorAndroid="transparent"
        style={styles.textInputStyle}
        selectionColor={Colors.textColor_FFFFEE}
        keyboardAppearance={Colors.keyboardTheme}
        placeholder={''}
        keyboardType="numeric"
        onChangeText={(text) => { onChangeText(text) }}
        value={value}
      />
      <Text style={[styles.text16, { marginLeft: 10 }]}>
        {unit}
      </Text>
    </View>
  </View>
)
