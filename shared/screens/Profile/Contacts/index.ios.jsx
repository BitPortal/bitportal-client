import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ActionSheetIOS, Text } from 'react-native'
import { injectIntl } from 'react-intl'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import { contactSelector } from 'selectors/contact'
// import FastImage from 'react-native-fast-image'
import * as contactActions from 'actions/contact'
import styles from './styles'

const { Section, Item } = TableView
@injectIntl
@connect(
  state => ({
    contact: contactSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...contactActions
    }, dispatch)
  })
)

export default class Contacts extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: gt('联系人')
        },
        rightButtons: [
          {
            id: 'add',
            icon: require('resources/images/Add.png')
          }
        ],
        largeTitle: {
          displayMode: 'never'
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = { editting: false }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'add') {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.EditContact'
            }
          }]
        }
      })
    }
  }

  componentDidAppear() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        largeTitle: {
          visible: false
        }
      }
    })
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'toManageWallet') {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.ManageWallet'
        }
      })
    }
  }

  onChange = (data) => {
    console.log(data)
  }

  onPress = async (id) => {
    const constants = await Navigation.constants()
    this.props.actions.setActiveContact(id)

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.Contact',
        passProps: {
          statusBarHeight: constants.statusBarHeight
        }
      }
    })
  }

  render() {
    const { contact } = this.props

    if (!contact || !contact.length) {
      return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#666666', fontSize: 17 }}>{t(this,'暂无联系人')}</Text>
        </View>
      )
    }

    return (
      <TableView
        style={{ flex: 1, backgroundColor: 'white' }}
        tableViewCellStyle={TableView.Consts.CellStyle.Default}
        detailTextColor="#666666"
        showsVerticalScrollIndicator={false}
        cellSeparatorInset={{ left: 16 }}
        onItemNotification={this.onItemNotification}
        onChange={this.onChange}
        moveWithinSectionOnly
        sectionIndexTitlesEnabled
      >
        {contact.map(section =>
          <Section label={section.key} key={section.key}>
            {section.items.map(item =>
              <Item
                key={item.id}
                height={60}
                accessoryType={TableView.Consts.AccessoryType.DisclosureIndicator}
                reactModuleForCell="ContactTableViewCell"
                name={item.name}
                description={item.description}
                hasBTC={!!item.btc && !!item.btc.length}
                hasETH={!!item.eth && !!item.eth.length}
                hasEOS={!!item.eos && !!item.eos.length}
                onPress={this.onPress.bind(this, item.id)}
              />
             )}
          </Section>
         )}
      </TableView>
    )
  }
}
