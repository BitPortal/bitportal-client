/* eslint-disable no-use-before-define */
/* eslint-disable react/no-array-index-key */
import React from 'react'
import { View, ScrollView } from 'react-native'
import Markdown from 'react-native-simple-markdown'
import BaseScreen from 'components/BaseScreen'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import Colors from 'resources/colors'
import { FontScale } from 'utils/dimens'
import styles from './styles'

class MarkdownPage extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={this.props.title || 'Details'}
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
        />
        <ScrollView contentContainerStyle={styles.markdownContainer}>
          {this.props.markdown
            .replace(/\r/gi, '')
            .split('\n')
            .filter(item => item.length > 0)
            .map((item, index) =>
              <Markdown key={index} styles={markdownStyles}>
                {item}
              </Markdown>
          )}
        </ScrollView>
      </View>
    )
  }
}

const markdownStyles = {
  text: {
    fontSize: FontScale(15),
    color: Colors.textColor_255_255_238,
    lineHeight: 22,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    lineHeight: 28,
  },
  heading2: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    lineHeight: 26,
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    lineHeight: 24,
  },
  strong: {
    fontWeight: 'bold',
  }
}

export default MarkdownPage
