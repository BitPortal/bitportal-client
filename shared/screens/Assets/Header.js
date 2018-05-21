
import React, { Component } from 'react'
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from 'resources/colors'

export default Header = ({ Title, displayAccount, scanQR }) => (
  <View style={[styles.headerContainer, styles.between]}>
    <TouchableOpacity onPress={() => displayAccount()} style={styles.navButton}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.text20}> { Title } </Text>
        <View style={{ transform: [{ rotateZ: '90deg' }], marginLeft: 5, marginTop: 3 }}>
          <Ionicons name="md-play" size={10} color={Colors.textColor_255_255_238} />
        </View>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => scanQR()} style={styles.navButton}>
      <View style={{ marginLeft: 40 }}>
        <Ionicons name="md-qr-scanner" size={20} color={Colors.textColor_255_255_238} />
      </View>
    </TouchableOpacity>
  </View>
)




