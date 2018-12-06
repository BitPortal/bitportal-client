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
import FastImage from 'react-native-fast-image'
import { SCREEN_WIDTH, FLOATING_CARD_BORDER_RADIUS } from 'utils/dimens'
import { DAPP_SECTION_ICONS } from 'constants/dApp'
import AddRemoveButtonAnimation from 'components/AddRemoveButton/animation'
import messages from 'resources/messages'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import Images from 'resources/images'

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

  state = { visible: false, filteredSections: [] }

  showModal = () => {
    this.setState({ visible: true })
  }

  hideModal = () => {
    this.setState({ visible: false })
  }

  UNSAFE_componentWillMount() {
    // if (this.props.section === 'all') this.setState({ filteredSections: this.props.dAppSections })
    // else if (this.props.section)
    //   this.setState({ filteredSections: this.props.dAppSections.filter(e => e.title === this.props.section) })
    // setTimeout(() => {
    //   this.sectionListRef.scrollToLocation({
    //     itemIndex: 0,
    //     sectionIndex: this.props.jumpToIndex,
    //     viewPostition: 0,
    //     animated: true
    //   })
    // }, 500)
  }

  handleFloatingRadius = ({ index, section }) => {
    if (index === 0)
      return { borderTopLeftRadius: FLOATING_CARD_BORDER_RADIUS, borderTopRightRadius: FLOATING_CARD_BORDER_RADIUS }
    if (index === section.data.length - 1)
      return {
        borderBottomLeftRadius: FLOATING_CARD_BORDER_RADIUS,
        borderBottomRightRadius: FLOATING_CARD_BORDER_RADIUS
      }
  }

  renderItem = ({ item, index, section }) => {
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
        extraStyleProps={this.handleFloatingRadius({ index, section })}
      />
    )
  }

  renderSeparator = () => <View style={styles.itemSeperator} />

  renderSectionHeader = ({ section: { title } }) => (
    <View style={[styles.sectionHeader]}>
      <View style={styles.row}>
        <FastImage style={styles.categoryIcon} source={DAPP_SECTION_ICONS[title].icon} />
        <Text style={styles.title}>{messages[this.props.locale][DAPP_SECTION_ICONS[title].stringId]}</Text>
      </View>
    </View>
  )

  onChangeText = text => {
    this.props.actions.setSearchTerm(text)
  }

  keyExtractor = item => item.get('id')

  goBack = () => {
    Navigation.pop(this.props.componentId)
  }

  componentWillUnmount() {
    this.props.actions.setSearchTerm('')
  }

  render() {
    let filteredSections
    if (this.props.section === 'all') filteredSections = this.props.dAppSections
    else if (this.props.section) filteredSections = this.props.dAppSections.filter(e => e.title === this.props.section)
    const { locale, loading, searchTerm, dAppSections } = this.props
    console.log('filteredSectionss', filteredSections, this.props.extraCloseProps)
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            leftButton={<CommonButton iconName="md-arrow-back" onPress={this.goBack} />}
            title={messages[locale].discovery_dapp_title_dapp_list}
            rightButton={
              <SearchBar
                expandedSearch={this.props.expandedSearch}
                searchTerm={searchTerm}
                onChangeText={text => this.onChangeText(text)}
                clearSearch={() => {
                  this.props.actions.setSearchTerm('')
                }}
                extraCloseProps={this.props.extraCloseProps ? () => Navigation.pop(this.props.componentId) : null}
              />
            }
          />
          <View>
            {filteredSections.length === 0 && (
              <View style={styles.noResults}>
                <FastImage style={styles.noResultIcon} source={Images.dapp_no_result} />
                <Text style={[styles.text14, { textAlign: 'center' }]}>
                  {messages[locale].dapp_list_text_search_no_result}
                </Text>
              </View>
            )}
            <SectionList
              ref={node => {
                this.sectionListRef = node
              }}
              style={styles.listContainer}
              // contentContainerStyle={styles.listContainer}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              renderSectionHeader={this.renderSectionHeader}
              sections={filteredSections || dAppSections}
              ItemSeparatorComponent={this.renderSeparator}
              // onEndReachedThreshold={-0.1}
              showsVerticalScrollIndicator={false}
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
              />
              <AddRemoveButtonAnimation value={this.props.selected} />
            </Modal>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
