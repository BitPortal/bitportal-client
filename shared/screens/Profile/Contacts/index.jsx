import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { Text, View, TouchableWithoutFeedback } from 'react-native'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { eosAccountSelector } from 'selectors/eosAccount'
import * as contactActions from 'actions/contact'
import DeleteButton from './DeleteButton'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state),
    contact: state.contact
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...contactActions,
    }, dispatch)
  }),
  null,
  { withRef: true }
)

export default class Contacts extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  addContact = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CreateContact'
      }
    })
  }

  goBack = () => {
    Navigation.pop(this.props.componentId)
  }

  deleteContact = (rowData, rowMap) => {
    rowMap[rowData.item.id].closeRow()
    this.props.actions.deleteContact(rowData.item.id)
  }

  renderItem = (rowData, rowMap) => (
    <SwipeRow
        disableRightSwipe={true}
        rightOpenValue={-100}
        style={{ backgroundColor: Colors.bgColor_30_31_37 }}
    >
      <DeleteButton onPress={this.deleteContact.bind(this, rowData, rowMap)} />
      <TouchableWithoutFeedback disabled={!this.props.onRowPress} style={styles.listItem} onPress={this.onRowPress.bind(this, rowData)}>
        <View style={[styles.listItem, styles.extraListItem]}>
          <Text style={styles.text14}>{rowData.item.eosAccountName}</Text>
          <Text style={styles.text12}>{rowData.item.note}</Text>
        </View>
      </TouchableWithoutFeedback>
    </SwipeRow>
  )

  onRowPress = (rowData) => {
    const { onRowPress } = this.props

    if (onRowPress) {
      onRowPress(rowData.item.eosAccountName)
      Navigation.pop(this.props.componentId)
    }
  }

  render() {
    const { locale, contact } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].ctct_title_name_contacts}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={this.goBack} />}
            rightButton={<CommonRightButton iconName="md-add" onPress={this.addContact} />}
          />
          <View style={styles.scrollContainer}>
            <SwipeListView
              useFlatList
              contentContainerStyle={{ paddingTop: 10 }}
              enableEmptySections={true}
              showsVerticalScrollIndicator={false}
              data={contact.get('data').toJS()}
              renderItem={this.renderItem}
              keyExtractor={item => String(item.id)}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
