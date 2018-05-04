
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native'
import Colors from 'resources/colors'

export default EnableAssets = ({ Title, enableAssets }) => (
  <TouchableHighlight style={styles.addAssetsContainer} onPress={() => enableAssets()}>
    <View style={[styles.addAssetsContainer, styles.between, { paddingHorizontal: 32, backgroundColor: Colors.minorThemeColor }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.text14}> { Title } </Text>
      </View>
      <Ionicons name="ios-add-circle-outline" size={25} color={Colors.textColor_89_185_226} />
    </View>
  </TouchableHighlight>
)




