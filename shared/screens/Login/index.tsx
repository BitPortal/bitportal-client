/* @tsx */

import React, { Component } from 'react'
import { View, Button, ScrollView, Text, FlatList } from 'react-native'
import { NavigationActions } from 'react-navigation'
import styles from './styles'

interface Props {
  navigation: any
}

export default class Login extends Component<Props, object> {
  static navigationOptions = ({ navigation }: { navigation: any }) => ({
    title: 'Login',
    gesturesEnabled: false,
    headerLeft: (
      <Button
        title="Cancel"
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
    headerRight: (
      (navigation.state.params && !navigation.state.params.disabled) ? <Button title="Submit" onPress={() => {}} /> : <Text style={{ fontSize: 18, paddingRight: 8, color: '#C8C7CC' }}>Submit</Text>
    )
  })

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
