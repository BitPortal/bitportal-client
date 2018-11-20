import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, SectionList, Modal } from 'react-native'
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
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import DappListItem from './DappListItem'
import styles from './styles'
import ItemStyles from './DappListItem/styles'

const ITEM_HEIGHT = ItemStyles.rowContainer.height
const SEPERATOR_HEIGHT = 1
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
  constructor(props) {
    super(props)

    this.getItemLayout = sectionListGetItemLayout({
      getItemHeight: () => ITEM_HEIGHT,
      getSeparatorHeight: () => SEPERATOR_HEIGHT,
      getSectionHeaderHeight: () => 40,
      getSectionFooterHeight: () => 10,
      listHeaderHeight: -25
    })
  }

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

  componentDidMount() {
    if (this.props.jumpToIndex)
      setTimeout(() => {
        this.sectionListRef.scrollToLocation({
          itemIndex: 0,
          sectionIndex: this.props.jumpToIndex,
          viewPostition: 0,
          animated: true
        })
      }, 500)
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

  onChangeText = text => {
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
            leftButton={<CommonButton iconName="md-arrow-back" onPress={this.goBack} />}
            title={messages[locale].discovery_dapp_title_dapp_list}
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
              ref={node => {
                this.sectionListRef = node
              }}
              style={styles.listContainer}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              renderSectionHeader={this.renderSectionHeader}
              sections={dAppSections}
              ItemSeparatorComponent={this.renderSeparator}
              // onEndReachedThreshold={-0.1}
              stickySectionHeadersEnabled={false}
              refreshing={loading}
              getItemLayout={this.getItemLayout}
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
