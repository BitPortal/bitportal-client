import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tokenActions from 'actions/token'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { View, ScrollView, InteractionManager } from 'react-native'
import Details from './Details'
import CoinInfoCard from './CoinInfoCard'
import Description from './Description'
import ListedExchange from './ListedExchange'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    listedExchange: state.ticker.get('listedExchange'),
    loading: state.ticker.get('loading'),
    baseAsset: state.ticker.get('baseAsset')
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...tokenActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class TokenDetails extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.actions.getTokenDetailRequested({
        symbol: this.props.baseAsset
      })
    })
  }

  render() {
    const { listedExchange, loading } = this.props

    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={
            <CommonButton
              iconName="md-arrow-back"
              onPress={() => Navigation.pop(this.props.componentId)}
            />
          }
          title="Token Details"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CoinInfoCard />
            <ListedExchange data={listedExchange} loading={loading} />
            <Description />
            <Details />
          </ScrollView>
        </View>
      </View>
    )
  }
}
