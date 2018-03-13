/* @tsx */

import React, { Component } from 'react'
import { ScrollView, View, Button, Text } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

interface Props {
  navigation: any
}

export default class Login extends Component<Props, object> {
  static navigationOptions = ({ navigation }: { navigation: any }) => ({
    title: 'Register',
    headerLeft: (
      <Button
        title="Cancel"
        onPress={() => navigation.goBack()}
      />
    )
  })

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>register</Text>
        </View>
      </ScrollView>
    )
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 15,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    width: 347
  },
})
