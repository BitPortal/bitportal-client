import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, SectionList, Modal } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { bindActionCreators } from 'redux'
import * as dAppActions from 'actions/dApp'
import {
  searchDappListSelector,
  sectionedDappListSelector
} from 'selectors/dApp'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { IntlProvider } from 'react-intl'
import SearchBar from 'components/SearchBar'
import { SCREEN_WIDTH } from 'utils/dimens'
import AddRemoveButtonAnimation from 'components/AddRemoveButton/animation'

import DappListItem from './DappListItem'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    dAppList: searchDappListSelector(state),
    loading: state.dApp.get('loading'),
    searchTerm: state.dApp.get('searchTerm'),
    dAppSections: sectionedDappListSelector(state),
    selected: state.dApp.get('selected'),
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
export default class DappList extends Component {
  state = { visible: false }

  showModal = () => {
    this.setState({ visible: true })
  }

  hideModal = () => {
    this.setState({ visible: false })
  }

  renderItem = ({ item }) => {
    const { locale, eosAccountName } = this.props
    return (
      <DappListItem
        item={item}
        selected={item.get('selected')}
        locale={locale}
        componentId={this.props.componentId}
        showModal={() => {
          this.showModal()
        }}
        hideModal={() => {
          this.hideModal()
        }}
        eosAccountName={eosAccountName}
      />
    )
  }

  renderSeparator = () => <View style={styles.itemSeperator} />

  renderSectionHeader = ({ section: { title } }) => (
    <View style={[styles.sectionHeader]}>
      <Text style={styles.title}>{messages[this.props.locale][title]}</Text>
    </View>
  )

  onChangeText = (text) => {
    this.props.actions.setSearchTerm(text)
  }

  keyExtractor = item => item.get('id')

  goBack = () => {
    Navigation.pop(this.props.componentId)
  }

  render() {
    const { locale, loading, searchTerm, dAppSections } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={
              <CommonButton iconName="md-arrow-back" onPress={this.goBack} />
            }
            title={messages[locale].dApp_list}
            rightButton={
              <SearchBar
                searchTerm={searchTerm}
                onChangeText={text => this.onChangeText(text)}
                clearSearch={() => {
                  this.props.actions.setSearchTerm('')
                }}
              />
            }
          />
          {/* <VirtualizedList
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
          /> */}
          <View styles={{ backgroundColor: 'red' }}>
            <SectionList
              style={styles.listContainer}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              renderSectionHeader={this.renderSectionHeader}
              sections={dAppSections}
              ItemSeparatorComponent={this.renderSeparator}
              // onEndReachedThreshold={-0.1}
              stickySectionHeadersEnabled={false}
              refreshing={loading}
            />
          </View>

          <View>
            <Modal transparent={true} visible={this.state.visible}>
              <View
                style={{
                  // backgroundColor: 'yellow',
                  width: SCREEN_WIDTH,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <AddRemoveButtonAnimation value={this.props.selected} />
              </View>
            </Modal>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
