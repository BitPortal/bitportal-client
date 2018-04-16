/* @tsx */

import React, { Component } from 'react'
import { View, ScrollView, Text, FlatList } from 'react-native'
import styles from './styles'

interface Props {
  navigation: any
}

export default class Login extends Component<Props, object> {

  state = { text: '' }

  handleTextChange = (text: string) => {
    this.props.navigation.setParams({ disabled: !text })
    this.setState({ text })
  }

  render() {
    return (
      <ScrollView style={styles.login}>
        <FlatList
          style={styles.list}
          data={[{ key: 'a' }, { key: 'b' }]}
          renderItem={({ item }) => <View style={styles.listItem}><Text>{item.key}</Text></View>}
        />
      </ScrollView>
    )
  }
}
