/* @tsx */

import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableHighlight, Dimensions, Button } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

interface Props {
  navigation: any
}

const { width } = Dimensions.get('window')

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4'
  },
  profile: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.16)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 140
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%'
  },
  username: {
    fontSize: 22
  },
  email: {
    fontSize: 16,
    color: '#8A8A8F'
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 15
  }
})

const Profile = ({ navigation }: { navigation: any }) => (
  <TouchableHighlight
    onPress={() => navigation.navigate('Profile')}
    style={{ marginTop: 35 }}
  >
    <View
      style={styles.profile}
    >
      <View style={styles.main}>
        <View style={styles.info}>
          <Text style={styles.username} numberOfLines={1}>Terence Ge</Text>
          <Text style={styles.email} numberOfLines={1}>
            Email: terencegehui@yncegehui@yncegehui@yahoo.com
          </Text>
        </View>
      </View>
    </View>
  </TouchableHighlight>
)

export default class Settings extends Component<Props, object> {
  render() {
    const { navigation } = this.props

    return (
      <View style={styles.container}>
        <ScrollView>
          <Profile navigation={navigation} />
          <Button onPress={() => navigation.navigate('Login')} title="Login" />
        </ScrollView>
      </View>
    )
  }
}
