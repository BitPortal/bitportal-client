import React, { PureComponent } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import Images from 'resources/images'
import styles from './styles'

export default class AddRemoveButton extends PureComponent {
  render() {
    if (!this.props.value) {
      return (
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={this.props.onValueChange}
        >
          <Image style={styles.image} source={Images.list_add} />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={this.props.onValueChange}
        >
          <Image style={styles.image} source={Images.list_remove} />
        </TouchableOpacity>
      )
    }
  }
}
