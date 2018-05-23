/* @jsx */
import React, { Component } from 'react'
import NavigationBar, { CommonButton, CommonRightButton } from 'components/NavigationBar'
import BaseScreen from 'components/BaseScreen'
import styles from './styles'
import { Text, View, ListView } from 'react-native'
import DeleteButton from './DeleteButton'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Colors from 'resources/colors'
import { connect } from 'react-redux'
import { FormattedMessage, IntlProvider } from 'react-intl'
import messages from './messages'

@connect(
  (state) => ({
    locale: state.intl.get('locale')
  })
)

export default class Contacts extends BaseScreen {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }
  
  state = {
    contacts: [
      { accountName: 'EOS-1', memo: 'memo......' },
      { accountName: 'EOS-2', memo: 'memo......' },
      { accountName: 'EOS-3', memo: 'memo......' },
      { accountName: 'EOS-4', memo: 'memo......' },
      { accountName: 'EOS-5', memo: 'memo......' }
    ]
  }

  constructor(props, context) {
    super(props, context)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  }

  addContacts = () => {
    this.push({ screen: 'BitPortal.CreateContact' })
  }

  deleteContact = (data, secId, rowId, rowMap) => {
    rowMap[`${secId}${rowId}`].closeRow()
    const newData = [...this.state.contacts]
    newData.splice(rowId, 1)
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
          <Text style={styles.text14}> Account Name </Text>
          <Text style={styles.text12}> memo </Text>
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
            title={messages[locale]['ctct_title_name_contacts']}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
            rightButton={ <CommonRightButton iconName="md-add" onPress={() => this.addContacts()} /> }
          />
          <View style={styles.scrollContainer}>
            <SwipeListView
              contentContainerStyle={{ paddingTop: 10  }}
              enableEmptySections={true}
              showsVerticalScrollIndicator={false}
              dataSource={this.ds.cloneWithRows(this.state.contacts)}
              renderRow={this.renderRow.bind(this)}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
