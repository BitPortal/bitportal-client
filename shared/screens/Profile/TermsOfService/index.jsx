import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, WebView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class TermsOfService extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  render() {
    const { title, uri } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          title={title}
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
        />
        <View style={styles.webViewContainer}>
          <WebView source={{ uri }} />
        </View>
      </View>
    )
  }
}
