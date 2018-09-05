import React, { PureComponent } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { bindActionCreators } from 'redux'
import * as dAppActions from 'actions/dApp'
import { connect } from 'react-redux'
import { parsedDappListSelector } from 'selectors/dApp'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { IntlProvider } from 'react-intl'
import Colors from 'resources/colors'
import DappElement from './DappElement'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    loading: state.dApp.get('loading'),
    dAppList: parsedDappListSelector(state),
    eosAccountName: eosAccountNameSelector(state)
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
  render() {
    const { locale, componentId, loading, eosAccountName } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <View style={styles.listTitle}>
            <Text
              style={[styles.text14, { color: Colors.textColor_255_255_238 }]}
            >
              Dapp Store
            </Text>
          </View>
          <View style={styles.hairLine} />
          <ScrollView
            horizontal={true}
            scrollEnabled={false}
            contentContainerStyle={styles.dAppScrollViewContainer}
          >
            {loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1
                }}
              >
                <ActivityIndicator size="large" />
              </View>
            ) : (
              this.props.dAppList.map((item, index) => (
                <DappElement
                  item={item}
                  key={index}
                  locale={locale}
                  componentId={componentId}
                  eosAccountName={eosAccountName}
                />
              ))
            )}
          </ScrollView>
          <View style={[styles.hairLine, { height: 10 }]} />
        </View>
      </IntlProvider>
    )
  }
}
