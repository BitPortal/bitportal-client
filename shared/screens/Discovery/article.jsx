import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, WebView, Share } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

class Article extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  share = () => {
    try {
      Share.share({ url: this.props.url, title: this.props.title })
    } catch (e) {
      console.warn('share error')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={this.props.title || 'Details'}
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          rightButton={<CommonRightButton iconName="md-share" onPress={() => this.share()} />}
        />
        <WebView source={{ uri: this.props.url }} />
      </View>
    )
  }
}

export default Article
