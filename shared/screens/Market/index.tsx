/* @tsx */

import React, { Component } from 'react'
import { ScrollView, Text, View, StatusBar, TextInput, FlatList, TouchableHighlight } from 'react-native'
import BTCIcon from 'resources/icons/BTCIcon'
import styles from './styles'

interface Props {
  navigation: any
}

interface State {
  text: any
}

const ListItem = ({ navigation }: any) => (
  <TouchableHighlight
    onPress={() => navigation.navigate('Profile')}
  >
    <View style={styles.listItem}>
      <View style={styles.listItemSide}>
        <BTCIcon />
      </View>
      <View style={styles.listItemMain}>
        <View style={styles.listItemMainLeft}>
          <Text style={styles.listItemMainCoin}>Bitcoin</Text>
          <Text style={styles.listItemMainMarketSize}>量/额 100.08万/469.31亿</Text>
        </View>
        <View style={styles.listItemRight}>
          <Text style={styles.listItemMainPrice}>$8889.00</Text>
          <Text style={styles.listItemMainChange}>(+23.09%)</Text>
        </View>
      </View>
    </View>
  </TouchableHighlight>
)

export default class Market extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)
    this.state = { text: null }
  }

  render() {
    const { navigation } = this.props

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.header}>
          Bitporta
        </Text>
        <View style={styles.options}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
              placeholder="Search"
              placeholderTextColor="#959499"
            />
          </View>
          <Text style={styles.filter}>Price</Text>
        </View>
        <ScrollView>
          <FlatList
            style={styles.list}
            data={[{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }, { key: 'f' }]}
            renderItem={() => <ListItem navigation={navigation} />}
          />
        </ScrollView>
      </View>
    )
  }
}
