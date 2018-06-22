import React from 'react'
import { View, WebView, Share } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import styles from './styles'

class Article extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
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
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
          rightButton={<CommonRightButton iconName="md-share" onPress={() => this.share()} />}
        />
        <WebView source={{ uri: this.props.url }} />
      </View>
    )
  }
}

export default Article
