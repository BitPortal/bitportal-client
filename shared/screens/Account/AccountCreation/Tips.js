/* @jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'
import { Text, View } from 'react-native'
import Colors from 'resources/colors'

export default Tips = ({ }) => (
  <View style={[styles.tips, { alignItems: 'flex-start', justifyContent: 'center'  }]}>

    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
      <View style={styles.dot}/>
      <Text numberOfLines={1} style={styles.text12}>
        Password strength is critical to guard your assets 
      </Text>
    </View>

    <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.dot}/>
      <Text numberOfLines={1} style={styles.text12}>
        We won't store or retrieve your password, please bear it in mind
      </Text>
    </View>
    
  </View>
)
