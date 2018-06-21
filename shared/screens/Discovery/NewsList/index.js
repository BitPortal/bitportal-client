import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FlatList, View, ActivityIndicator, Text } from 'react-native'
import Colors from 'resources/colors'
import NewsRow, { NewsRowTypes } from '../NewsRow'
import styles from '../styles'

class NewsList extends PureComponent {
  keyExtractor = item => item.id

  renderItem = ({ item }) =>
    <NewsRow
      previewImage={item.previewImage}
      title={item.title}
      subTitle={item.subTitle}
      author={item.author}
      date={item.date}
      id={item.id}
      onRowPress={() => this.props.onRowPress(item)}
      key={item.id}
    />

  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: Colors.bgColor_000000 }} />
  )

  renderFoot = () => {
    const { loadingMore, nomore } = this.props
    if (loadingMore) return (<ActivityIndicator style={{ marginVertical: 10 }} size="small" color="white" />)
    if (nomore) return (<Text style={[styles.text14, { marginVertical: 10, alignSelf: 'center' }]}>没有更多数据了</Text>)
    return null
  }

  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={this.renderSeparator}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFoot}
        onRefresh={this.props.onRefresh}
        onEndReached={this.props.onEndReached}
        onEndReachedThreshold={-0.1}
        refreshing={this.props.refreshing}
      />
    )
  }
}

NewsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(NewsRowTypes)),
  onRefresh: PropTypes.func,
  onEndReached: PropTypes.func,
  onRowPress: PropTypes.func,
  refreshing: PropTypes.bool,
}

NewsList.defaultProps = {
  data: [],
  onRefresh: null,
  onEndReached: null,
  onRowPress: null,
  refreshing: false,
}

export default NewsList
