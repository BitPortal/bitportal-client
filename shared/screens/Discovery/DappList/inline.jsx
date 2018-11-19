import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, SectionList, Modal, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { bindActionCreators } from 'redux'
import * as dAppActions from 'actions/dApp'
import { searchDappListSelector, sectionedDappListSelector } from 'selectors/dApp'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { IntlProvider } from 'react-intl'
import SearchBar from 'components/SearchBar'
import { SCREEN_WIDTH } from 'utils/dimens'
import AddRemoveButtonAnimation from 'components/AddRemoveButton/animation'
import messages from 'resources/messages'
import DappListItem from './DappListItem'
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
export default class DappListInline extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = { visible: false }

  showModal = () => {
    this.setState({ visible: true })
  }

  hideModal = () => {
    this.setState({ visible: false })
  }

  handleMore = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.DappList'
      }
    })
  }

  renderItem = ({ item, index }) => {
    const { locale, eosAccountName } = this.props

    return index < 5 ? (
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
    ) : null
  }

  renderSeparator = () => <View style={styles.itemSeperator} />

  renderSectionHeader = ({ section: { title, data } }) => {
    return data.length < 5 ? (
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>{messages[this.props.locale][title]}</Text>
      </View>
    ) : (
      <View style={styles.moreSectionHeader}>
        <Text style={styles.title}>{messages[this.props.locale][title]}</Text>
        <TouchableOpacity style={styles.moreButton} onPress={this.handleMore}>
          <Text style={styles.moreText}>{messages[this.props.locale].discovery_dapp_list_title_more}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  onChangeText = text => {
    this.props.actions.setSearchTerm(text)
  }

  keyExtractor = item => item.get('id')

  goBack = () => {
    Navigation.pop(this.props.componentId)
  }

  render() {
    const { locale, loading, dAppSections } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
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
              style={styles.inlineListContainer}
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
