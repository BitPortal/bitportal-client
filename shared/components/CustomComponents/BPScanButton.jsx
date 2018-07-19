import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Permissions from 'react-native-permissions'

const styles = StyleSheet.create({
  container: {
    minWidth: 100,
    height: 40,
    paddingTop: 6,
    marginLeft: 10,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default class BPScanButton extends Component{

  checkPermissions = () => {
    Permissions.check('camera').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      console.log('###', response)
    })
  }

  render() {
    const { onPress } = this.props
    return (
      <TouchableOpacity
        style={[styles.container, styles.center]}
        onPress={this.checkPermissions}
      >
        <View style={{ alignSelf: 'flex-end', marginRight: 32 }}>
          <Ionicons name={"md-qr-scanner"} size={24} color={Colors.bgColor_FFFFFF} />
        </View>
      </TouchableOpacity>
    )
  }
}
