import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import { Text, View, ListView } from 'react-native'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { eosAccountSelector } from 'selectors/eosAccount'
import storage from 'utils/storage'
import DeleteButton from './DeleteButton'
import styles from './styles'
import messages from './messages'

@connect(
  state => ({
    locale: state.intl.get('locale'),
    eosAccount: eosAccountSelector(state)
  }),
  null,
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

  state = {
    contacts: []
  }

  constructor(props, context) {
    super(props, context)
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
  }

  async componentDidAppear() {
    const accountName = this.props.eosAccount.get('data').get('account_name')
    const objInfo = await storage.getItem(`bitportal.${accountName}-contacts`, true)
    const contacts = objInfo && objInfo.contacts
    if (contacts && contacts.length > 0) {
      this.setState({ contacts })
    }
  }

  addContacts = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CreateContact'
      }
    })
  }

  deleteContact = async (data, secId, rowId, rowMap) => {
    rowMap[`${secId}${rowId}`].closeRow()
    const newData = [...this.state.contacts] // eslint-disable-line react/no-access-state-in-setstate
    newData.splice(rowId, 1)
    const accountName = this.props.eosAccount.get('data').get('account_name')
    await storage.mergeItem(`bitportal.${accountName}-contacts`, { contacts: newData }, true)
    this.setState({ contacts: newData })
  }

  renderRow (data, secId, rowId, rowMap) {
    return (
      <SwipeRow
        disableRightSwipe={true}
        rightOpenValue={-100}
        style={{ backgroundColor: Colors.bgColor_48_49_59 }}
      >
        <DeleteButton onPress={() => this.deleteContact(data, secId, rowId, rowMap)} />
        <View style={styles.listItem}>
          <Text style={styles.text14}> {data.accountName} </Text>
          <Text style={styles.text12}> {data.memo} </Text>
        </View>
      </SwipeRow>
    )
  }

  render() {
    const { contacts } = this.state
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].ctct_title_name_contacts}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
            rightButton={<CommonRightButton iconName="md-add" onPress={() => this.addContacts()} />}
          />
          <View style={styles.scrollContainer}>
            {
              contacts.length > 0
              && <SwipeListView
                contentContainerStyle={{ paddingTop: 10 }}
                enableEmptySections={true}
                showsVerticalScrollIndicator={false}
                dataSource={this.ds.cloneWithRows(contacts)}
                renderRow={this.renderRow.bind(this)}
              />
            }
          </View>
        </View>
      </IntlProvider>
    )
  }
}
