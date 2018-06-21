import React from 'react'
import { View, WebView, Share } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import styles from './styles'

export default class TermsOfService extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  render() {
    const { title, uri } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          title={title}
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
        />
        <View style={styles.webViewContainer}>
          <WebView source={{ uri }} />
        </View>
      </View>
    )
  }
}

