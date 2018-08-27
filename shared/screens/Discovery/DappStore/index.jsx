import React, { PureComponent, Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import * as dAppActions from 'actions/dApp'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { parsedDappListSelector } from 'selectors/dApp'
import Colors from 'resources/colors'
import Images from 'resources/images'
import styles from './styles'
import messages from './messages'

class DappElement extends Component {
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
    const { item, locale } = this.props
    return item.type === 'more' ? (
      <View style={styles.dAppWrapper}>
        <TouchableOpacity
          onPress={() => {
            Navigation.push(this.props.componentId, {
              component: { name: 'BitPortal.DappList' }
            })
          }}
        >
          <View style={styles.icon}>
            <Ionicons name="md-apps" size={60} />
          </View>
        </TouchableOpacity>
        <Text style={[styles.title]}>{messages[locale].more_apps}</Text>
      </View>
    ) : (
      <View style={styles.dAppWrapper}>
        <TouchableOpacity
          style={styles.dAppButton}
          onPress={() => {
            this.onPress(item, locale)
          }}
        >
          <Image
            style={styles.icon}
            source={
              item.get('icon_url')
                ? { uri: `${item.get('icon_url')}` }
                : Images.coin_logo_default
            }
          />
        </TouchableOpacity>
        <Text numberOfLines={1} style={[styles.title]}>
          {item.get('display_name').get(locale)}
        </Text>
      </View>
    )
  }
}

@connect(
  state => ({
    locale: state.intl.get('locale'),
    loading: state.dApp.get('loading'),
    dAppList: parsedDappListSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...dAppActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class DappStore extends PureComponent {
  UNSAFE_componentWillMount() {
    this.props.actions.getDappListRequested({})
  }

  componentDidMount() {}

  //TODO add scrollview

  render() {
    const { locale, componentId, loading } = this.props
    console.log('componentId', componentId)
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.listTitle}>
            <Text
              style={[styles.text14, { color: Colors.textColor_255_255_238 }]}
            >
              Dapp Store
            </Text>
          </View>
          <View style={styles.hairLine} />
          {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10
          }}
        > */}
          <ScrollView
            horizontal={true}
            scrollEnabled={false}
            contentContainerStyle={styles.dAppScrollViewContainer}
          >
            {loading ? (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
              </View>
            ) : (
              this.props.dAppList.map((item, index) => (
                <DappElement
                  item={item}
                  key={index}
                  locale={locale}
                  componentId={componentId}
                />
              ))
            )}
          </ScrollView>
          <View style={[styles.hairLine, { height: 10 }]} />
        </View>
      </View>
    )
  }
}
