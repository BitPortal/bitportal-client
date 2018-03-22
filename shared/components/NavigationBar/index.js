import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image
} from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT, FontScale, NAV_BAR_HEIGHT} from 'utils/dimens'
import NavBar from 'react-native-navbar'
import styles from './styles'

export default class NavigationBar extends Component {

  render() {
    const { type, title, titleButton, leftButton, rightButton } = this.props;
    const titleElement = titleButton || { title: title, style: styles.textTitle }
    return (
      <NavBar
        leftButton={leftButton}
        rightButton={rightButton}
        statusBar={{ style: 'light-content' }}
        title={titleElement}
        containerStyle={styles.containerStyle}
      />
    )
  }
}

