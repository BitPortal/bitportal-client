import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, InteractionManager } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonTitle } from 'components/NavigationBar'
import { bindActionCreators } from 'redux'
import * as newsActions from 'actions/news'
import * as dAppActions from 'actions/dApp'
import { IntlProvider } from 'react-intl'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { loadInject } from 'utils/inject'
import Colors from 'resources/colors'
import messages from 'resources/messages'
import NewsBanner from './NewsBanner'
import DappStore from './DappStore'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    searchTerm: state.dApp.get('searchTerm')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...newsActions,
        ...dAppActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class Discovery extends Component {
  static get options() {
    return {
      bottomTabs: {
        backgroundColor: Colors.minorThemeColor
      }
    }
  }

  async componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.getDappListRequested()
    })
    await loadInject()
  }

  componentDidAppear() {
    this.props.actions.getNewsBannerRequested()
    this.props.actions.getDappListRequested()
  }

  checkDappList = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappList',
        passProps: {
          section: 'all',
          expandedSearch: true,
          extraCloseProps: true
        }
      }
    })
  }

  render() {
    const { locale, componentId, searchTerm } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonTitle title={messages[locale].discovery_title_discovery} />}
            rightButton={
              <Ionicons
                name="ios-search"
                size={24}
                color={Colors.textColor_181_181_181}
                onPress={this.checkDappList}
                style={styles.icons}
              />
            }
          />
          <ScrollView>
            {!searchTerm.trim() && <NewsBanner componentId={componentId} />}
            {!searchTerm.trim() && <DappStore componentId={componentId} />}
          </ScrollView>
        </View>
      </IntlProvider>
    )
  }
}
