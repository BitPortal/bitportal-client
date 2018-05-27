import React from 'react'
import { View, WebView, Share } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import styles from './styles'
import { BITPORTAL_API_TERMS_URL } from 'constants/env'

export default class TermsOfService extends BaseScreen {

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={'Terms Of Service'}
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
        />
        <View style={styles.webViewContainer}>
          <WebView source={{ uri: BITPORTAL_API_TERMS_URL }} />
        </View>
      </View>
    )
  }
}


