
import React, { Component } from 'react'
import Colors from 'resources/colors'
import { FormattedNumber } from 'react-intl'
import styles from './styles'
import PropTypes from 'prop-types'
import { 
  FontScale, 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT, 
  TAB_BAR_HEIGHT 
} from 'utils/dimens'
import { Text, View, TouchableHighlight, FlatList } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ListItem = ({ item, rank, onRowPress }) => {
  return (
    <TouchableHighlight  
      style={styles.listItem}
      underlayColor={Colors.bgColor_000000}
      onPress={() => onRowPress(item)} 
    >
      <View style={[styles.listItem, styles.between, { paddingRight: 32 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.text14, { width: 30, textAlign: 'right', paddingRight: 7, color: Colors.textColor_181_181_181 }]}> 
            {1+rank}  
          </Text>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.text18}> {item.name} </Text>
              <View style={[styles.location, styles.center]}> 
                <Text style={styles.text14}> {item.location} </Text> 
              </View>
            </View>
            <Text style={[styles.text14, { marginTop: 3, color: Colors.textColor_181_181_181 }]}> {item.producer} </Text>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.text14}> {item.totalVotes} </Text>
          <View style={{ marginTop: 3 }}>
            {(rank+1)%2 == 0 && <Ionicons name="ios-thumbs-up-outline" size={20} color={Colors.textColor_255_76_118} />}
          </View>
        </View>
      </View>
    </TouchableHighlight>
  )
}

export default class VoteList extends React.PureComponent {
  
  keyExtractor = (item) => item.id

  renderItem = ({ item, index }) => (
    <ListItem key={item.id} item={item} rank={index} onRowPress={() => this.props.onRowPress(item)} />
  )
 
  renderSeparator = () => (
    <View style={styles.separator} />
  )

  render() {
    return (
      <FlatList
        data={this.props.data} 
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={this.renderSeparator}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing}
      />
    )
  }
}

VoteList.propTypes = {
  data: PropTypes.array,
  onRefresh: PropTypes.func,
  onRowPress: PropTypes.func,
  refreshing: PropTypes.bool
}





