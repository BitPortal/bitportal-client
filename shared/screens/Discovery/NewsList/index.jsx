import React, { PureComponent } from 'react'
import { FlatList, View, ActivityIndicator, Text } from 'react-native'
import Colors from 'resources/colors'
import NewsBanner from '../NewsBanner'
import NewsRow from './NewsRow'
import styles from './styles'

export default class NewsList extends PureComponent {
  keyExtractor = item => item.id

  renderHeader = () => (
    <View>
      <NewsBanner componentId={this.props.componentId} />
      <View style={styles.listTitle}>
        <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}> 资讯 </Text>
      </View>
    </View>
  )

  renderItem = ({ item }) => (
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
  )

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
        showsVerticalScrollIndicator={false}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFoot}
        onRefresh={this.props.onRefresh}
        onEndReached={this.props.onEndReached}
        onEndReachedThreshold={-0.1}
        refreshing={this.props.refreshing}
      />
    )
  }
}
