import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  FlatList,
  VirtualizedList,
  TouchableHighlight,
  Text,
  Image
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, {
  CommonTitle,
  CommonButton
} from 'components/NavigationBar'
import { bindActionCreators } from 'redux'
import * as newsActions from 'actions/news'
import * as dAppActions from 'actions/dApp'
import { IntlProvider } from 'react-intl'

import Colors from 'resources/colors'
import Images from 'resources/images'
import messages from './messages'
import styles from './styles'

class DappListItem extends React.PureComponent {
  onPress = (item, locale) => {
    if (item.get('type') === 'link' && item.get('url').match(/http/g)) {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.BPWebView',
          passProps: {
            uri: item.get('url'),
            title: item.get('display_name').get(locale)
          }
        }
      })
    } else {
      Navigation.push(this.props.componentId, {
        component: {
          name: item.get('url'),
          passProps: {
            // markdown: item.content,
            title: item.get('display_name').get(locale)
          }
        }
      })
    }
  }

  render() {
    // const { display_name, description, icon_url } = this.props.item
    const { item, locale } = this.props
    console.log('item', this.props.item)
    return (
      <TouchableHighlight
        underlayColor={Colors.hoverColor}
        onPress={() => {
          this.onPress(item, locale)
        }}
      >
        <View style={styles.rowContainer}>
          <Image
            style={styles.image}
            source={
              item.get('icon_url')
                ? { uri: `${item.get('icon_url')}` }
                : Images.coin_logo_default
            }
          />
          <View style={styles.right}>
            <Text style={styles.title}>
              {item.get('display_name').get(locale)}
            </Text>
            {/* <Text numberOfLines={1} style={styles.subTitle}>{subTitle}</Text> */}
            <View style={styles.infoArea}>
              <Text numberOfLines={1} style={styles.subTitle}>
                {item.get('description').get(locale)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    dAppList: state.dApp.get('data'),
    loading: state.dApp.get('loading')
  }),
  null,
  null,
  { withRef: true }
)
export default class DappList extends Component {
  renderItem = ({ item }) => {
    const { locale } = this.props
    console.log('renderItem', item, locale)
    return (
      <DappListItem
        item={item}
        locale={locale}
        componentId={this.props.componentId}
      />
    )
  }

  keyExtractor = (item, index) => item.id

  render() {
    const { locale, dAppList, loading } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={
              <CommonButton
                iconName="md-arrow-back"
                onPress={() => Navigation.pop(this.props.componentId)}
              />
            }
            title={<CommonTitle title={messages[locale].dApp_list} />}
          />
          <VirtualizedList
            style={styles.listContainer}
            data={dAppList}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={this.renderSeparator}
            showsVerticalScrollIndicator={false}
            getItemCount={dAppList => dAppList.size || 0}
            renderItem={this.renderItem}
            getItem={(items, index) => (items.get ? items.get(index) : items[index])
            }
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFoot}
            onRefresh={this.props.onRefresh}
            onEndReached={this.props.onEndReached}
            onEndReachedThreshold={-0.1}
            refreshing={loading}
          />
        </View>
      </IntlProvider>
    )
  }
}
