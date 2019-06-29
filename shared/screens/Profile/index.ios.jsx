import React, { Component } from 'react'
import { View, LayoutAnimation } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import TableView from 'react-native-tableview'
import { injectIntl, FormattedMessage } from 'react-intl'
import styles from './styles'

const { Section, Item } = TableView

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    currencySymbol: state.currency.symbol,
    identity: state.identity
  })
)

export default class Profile extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '我的'
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  toLanguageSetting = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.LanguageSetting',
        options: {
          topBar: {
            title: {
              text: this.props.intl.formatMessage({ id: 'top_bar_title_language_setting' })
            }
          }
        }
      }
    })
  }

  toCurrencySetting = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CurrencySetting',
        options: {
          topBar: {
            title: {
              text: this.props.intl.formatMessage({ id: 'top_bar_title_currency_setting' })
            }
          }
        }
      }
    })
  }

  /* toNodeSetting = () => {
   *   Navigation.push(this.props.componentId, {
   *     component: {
   *       name: 'BitPortal.NodeSetting'
   *     }
   *   })
   * }*/

  toContacts = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.Contacts',
        options: {
          topBar: {
            title: {
              text: this.props.intl.formatMessage({ id: 'top_bar_title_contacts' })
            }
          }
        }
      }
    })
  }

  toMyIdentity = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.MyIdentity',
        options: {
          topBar: {
            title: {
              text: this.props.intl.formatMessage({ id: 'top_bar_title_my_identity' })
            }
          }
        }
      }
    })
  }

  toAddIdentity = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.AddIdentity'
          }
        }]
      }
    })
  }

  toAboutUs = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WebView',
        passProps: {
          url: 'https://www.bitportal.io/',
          id: 99999
        }
      },
      options: {
        topBar: {
          title: {
            text: 'BitPortal 官网'
          },
          leftButtons: [
            {
              id: 'cancel',
              text: '返回'
            }
          ]
        }
      }
    })
  }

  toHelpCenter = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.WebView',
        passProps: {
          url: 'https://www.bitportal.io/help/',
          id: 99999
        }
      },
      options: {
        topBar: {
          title: {
            text: 'BitPortal 帮助中心'
          },
          leftButtons: [
            {
              id: 'cancel',
              text: '返回'
            }
          ]
        }
      }
    })
  }

  componentDidMount() {

  }

  componentDidAppear() {

  }

  componentDidUpdate(prevProps, prevState) {
    LayoutAnimation.easeInEaseOut()
  }

  render() {
    const { identity, locale, currencySymbol, intl } = this.props
    const hasIdentity = !!identity.id

    return (
      <TableView
        style={{ flex: 1 }}
        tableViewStyle={TableView.Consts.Style.Grouped}
        tableViewCellStyle={TableView.Consts.CellStyle.Value1}
        cellSeparatorInset={{ left: 61 }}
        onSwitchAccessoryChanged={() => {}}
      >
        <Section />
        <Section>
          <Item
            height={78}
            reactModuleForCell="IdentityTableViewCell"
            hasIdentity={hasIdentity}
            name={hasIdentity ? identity.name : intl.formatMessage({ id: 'identity_tableviewcell_identity' })}
            identifier={hasIdentity ? identity.identifier : intl.formatMessage({ id: 'identity_tableviewcell_add_identity' })}
            onPress={hasIdentity ? this.toMyIdentity : this.toAddIdentity}
            arrow
          />
        </Section>
        <Section>
          <Item
            height={44}
            key="addressBook"
            type="addressBook"
            reactModuleForCell="IdentityTableViewCell"
            arrow
            onPress={this.toContacts}
            text={intl.formatMessage({ id: 'identity_tableviewcell_contacts' })}
            isSetting
          />
          <Item
            key="language"
            type="language"
            detail={locale === 'zh' ? '中文' : 'English'}
            reactModuleForCell="IdentityTableViewCell"
            arrow
            onPress={this.toLanguageSetting}
            isSetting
            text={intl.formatMessage({ id: 'identity_tableviewcell_language_setting' })}
          />
          <Item
            key="currency"
            type="currency"
            detail={currencySymbol}
            reactModuleForCell="IdentityTableViewCell"
            arrow
            onPress={this.toCurrencySetting}
            isSetting
            text={intl.formatMessage({ id: 'identity_tableviewcell_currency_setting' })}
          />
          {/* <Item
              key="node"
              type="node"
              reactModuleForCell="IdentityTableViewCell"
              arrow
              onPress={this.toNodeSetting}
              isSetting
              text="节点设置"
              /> */}
        </Section>
        {/*<Section>*/}
          {/*<Item*/}
            {/*key="privacyMode"*/}
            {/*type="privacyMode"*/}
            {/*reactModuleForCell="IdentityTableViewCell"*/}
            {/*selectionStyle={TableView.Consts.CellSelectionStyle.None}*/}
            {/*accessoryType={5}*/}
            {/*switchOn={false}*/}
            {/*isSetting*/}
            {/*text="隐私模式"*/}
          {/*/>*/}
          {/*<Item*/}
            {/*key="darkMode"*/}
            {/*type="darkMode"*/}
            {/*reactModuleForCell="IdentityTableViewCell"*/}
            {/*selectionStyle={TableView.Consts.CellSelectionStyle.None}*/}
            {/*accessoryType={5}*/}
            {/*switchOn={false}*/}
            {/*isSetting*/}
            {/*text="夜间模式"*/}
          {/*/>*/}
        {/*</Section>*/}
        <Section arrow>
          {/*<Item*/}
            {/*key="inviteFrends"*/}
            {/*type="inviteFrends"*/}
            {/*reactModuleForCell="IdentityTableViewCell"*/}
            {/*arrow*/}
            {/*isSetting*/}
            {/*text="邀请好友"*/}
          {/*/>*/}
          <Item
            key="helpCenter"
            type="helpCenter"
            reactModuleForCell="IdentityTableViewCell"
            arrow
            onPress={this.toHelpCenter}
            isSetting
            text={intl.formatMessage({ id: 'identity_tableviewcell_help_center' })}
          />
          <Item
            key="aboutUs"
            type="aboutUs"
            reactModuleForCell="IdentityTableViewCell"
            arrow
            onPress={this.toAboutUs}
            isSetting
            text={intl.formatMessage({ id: 'identity_tableviewcell_about_us' })}
          />
        </Section>
      </TableView>
    )
  }
}
