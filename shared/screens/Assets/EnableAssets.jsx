import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from 'resources/colors'
import styles from './styles'

export default class EnableAssets extends Component {
  render() {
    const { Title, onPress } = this.props

    return (
      <View
        style={[
          styles.addAssetsContainer,
          styles.between,
          { paddingHorizontal: 32, backgroundColor: Colors.minorThemeColor }
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Text style={styles.text14}> {Title} </Text>
        </View>
        <TouchableOpacity onPress={onPress}>
          <Ionicons
            name="ios-add-circle-outline"
            size={25}
            color={Colors.textColor_89_185_226}
          />
        </TouchableOpacity>
      </View>
    )
  }
}
