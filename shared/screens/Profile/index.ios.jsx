import React, { Component } from 'react'
import { View, LayoutAnimation, TouchableOpacity, Text, ScrollView } from 'react-native'
import { Navigation } from 'components/Navigation'
import { connect } from 'react-redux'
import TableView from 'components/TableView'
import { injectIntl, FormattedMessage } from 'react-intl'
import { currencySymbolSelector } from 'selectors/currency'
import styles from './styles'
import ProfileView from './ProfileView'

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    currencySymbol: currencySymbolSelector(state),
    identity: state.identity
  })
)

export default class Profile extends Component {
  render() {
    const { identity, locale, currencySymbol, intl } = this.props
    const hasIdentity = !!identity.id

    return (
      <ProfileView
        style={{ flex: 1 }}
        data={[
          [
            {
              title: hasIdentity ? identity.name : intl.formatMessage({ id: 'identity_tableviewcell_identity' }),
              detail: hasIdentity ? identity.identifier : intl.formatMessage({ id: 'identity_tableviewcell_add_identity' }),
              cellReuseIdentifier: 'bitportal.ProfileTableViewCell'
            },
          ],
          [
            {
              title: '联系人',
              image: 'bookRound.png'
            },
            {
              title: '语言设置',
              image: 'earthRound.png',
              detail: locale === 'zh' ? '中文' : 'English'
            },
            {
              title: '货币单位',
              image: 'currencyRound.png',
              detail: currencySymbol
            }
          ],
          [
            {
              title: '帮助中心',
              image: 'infoRound.png',
              webLink: 'https://www.bitportal.io/help'
            },
            {
              title: '关于我们',
              image: 'homeRound.png',
              webLink: 'https://www.bitportal.io'
            }
          ]
        ]}
      />
    )
  }
}
