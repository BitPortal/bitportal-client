import React, { Component } from 'react'
import { View, LayoutAnimation, TouchableOpacity, Text } from 'react-native'
import { Navigation } from 'components/Navigation'
import { connect } from 'react-redux'
import TableView from 'components/TableView'
import { injectIntl, FormattedMessage } from 'react-intl'
import { currencySymbolSelector } from 'selectors/currency'
import { DarkModeContext } from 'utils/darkMode'
import styles from './styles'

const { Section, Item } = TableView

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    currencySymbol: currencySymbolSelector(state),
    identity: state.identity
  })
)

export default class Profile extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '我的'
        },
        largeTitle: {
          displayMode: 'always'
        },
        noBorder: true
      }
    }
  }
  static contextType = DarkModeContext

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
        name: 'BitPortal.AboutUs'
      }
    })
  }

  toHelpCenter = () => {
    /* Navigation.showModal({
     *   stack: {
     *     children: [{
     *       component: {
     *         name: 'BitPortal.AddIdentity'
     *       }
     *     }]
     *   }
     * }) */
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
          largeTitle: {
            visible: false
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
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        largeTitle: {
          displayMode: 'always'
        }
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    LayoutAnimation.easeInEaseOut()
  }

  render() {
    const { identity, locale, currencySymbol, intl } = this.props
    const hasIdentity = !!identity.id
    const isDarkMode = this.context === 'dark'
    console.log('isDarkMode', isDarkMode)

    return (
      <TableView
        style={{ flex: 1 }}
        tableViewStyle={TableView.Consts.Style.Grouped}
        tableViewCellStyle={TableView.Consts.CellStyle.Value1}
        cellSeparatorInset={{ left: 61 }}
        onSwitchAccessoryChanged={() => {}}
      >
        <Section>
          <Item
            height={78}
            reactModuleForCell="IdentityTableViewCell"
            hasIdentity={hasIdentity}
            name={hasIdentity ? identity.name : intl.formatMessage({ id: 'identity_tableviewcell_identity' })}
            identifier={hasIdentity ? identity.identifier : intl.formatMessage({ id: 'identity_tableviewcell_add_identity' })}
            onPress={hasIdentity ? this.toMyIdentity : this.toAddIdentity}
            image="Userpic.png"
            isDarkMode={isDarkMode}
            arrow
          />
        </Section>
        <Section>
          <Item
            height={44}
            key="addressBook"
            type="addressBook"
            arrow
            onPress={this.toContacts}
            label={intl.formatMessage({ id: 'identity_tableviewcell_contacts' })}
            isSetting
            image="addressBookSetting.png"
          />
          <Item
            key="language"
            type="language"
            detail={locale === 'zh' ? '中文' : 'English'}
            arrow
            onPress={this.toLanguageSetting}
            isSetting
            label={intl.formatMessage({ id: 'identity_tableviewcell_language_setting' })}
            image="languageSetting.png"
          />
          <Item
            key="currency"
            type="currency"
            detail={currencySymbol}
            arrow
            onPress={this.toCurrencySetting}
            isSetting
            label={intl.formatMessage({ id: 'identity_tableviewcell_currency_setting' })}
            image="currencySetting.png"
          />
        </Section>
        <Section arrow>
          <Item
            key="helpCenter"
            type="helpCenter"
            arrow
            onPress={this.toHelpCenter}
            isSetting
            label={intl.formatMessage({ id: 'identity_tableviewcell_help_center' })}
            image="helpCenterSetting.png"
          />
          <Item
            key="aboutUs"
            type="aboutUs"
            arrow
            onPress={this.toAboutUs}
            isSetting
            label={intl.formatMessage({ id: 'identity_tableviewcell_about_us' })}
            image="abountUsSetting.png"
          />
        </Section>
      </TableView>
    )
  }
}
