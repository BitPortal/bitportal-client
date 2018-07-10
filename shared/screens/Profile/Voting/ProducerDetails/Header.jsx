/* @jsx */
import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider, FormattedNumber } from 'react-intl'
import Colors from 'resources/colors'
import Images from 'resources/images'
import LinearGradientContainer from 'components/LinearGradientContainer'
import messages from './messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class Header extends Component {

  render() {
    const { locale, info } = this.props
    const weight = +info.get('weight')
    const teamLocation = info.getIn(['org', 'location'])
    const teamName = info.getIn(['org', 'name'])
    const bpLocation = info.getIn(['nodes', '0', 'location', 'name'])
    const website = info.getIn(['org', 'website'])
    const logo = info.getIn(['org', 'branding', 'logo'])
    const graColor = weight === 0 ? Colors.recommandColor : Colors.cooperateColor

    return (
      <IntlProvider messages={messages[locale]}>
        <View>
          <View style={[styles.header, styles.between]}>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              {!!logo && <Image source={{ uri: `https://storage.googleapis.com/bitportal-cms/bp/${logo}` }} style={styles.icon} />}
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.text16, { marginLeft: 4, fontWeight: 'bold' }]}>
                  {teamName}
                  <Text style={[styles.text12, { color: Colors.textColor_white_4 }]}>{'  '}@{info.get('account_name')}</Text>
                </Text>
                <Text style={[styles.text16, { color: Colors.textColor_89_185_226 }]}>{website}</Text>
              </View>
            </View>
            {(weight === 0 || weight === 1) &&
              <LinearGradientContainer type="right" colors={graColor} style={[styles.center, styles.flag]} >
                <Text style={[styles.text12, { color: Colors.textColor_255_255_238 }]}>
                  {weight === 0 && '推广'}
                  {weight === 1 && '合作'}
                </Text>
              </LinearGradientContainer>
            }
          </View>
          <View style={[styles.info, { marginVertical: 10}]}>
            <View style={[styles.between]}>
              <Text style={styles.text14}>Team location:</Text>
              <Text style={styles.text14}>{teamLocation}</Text>
            </View>
            <View style={[styles.between, { marginVertical: 10 }]}>
              <Text style={styles.text14}>BP location:</Text>
              <Text style={styles.text14}>{bpLocation}</Text>
            </View>
            <View style={[styles.between]}>
              <Text style={styles.text14}>Score:</Text>
              <Text style={styles.text14}>
                <FormattedNumber
                  value={this.props.votes}
                  maximumFractionDigits={0}
                  minimumFractionDigits={0}
                />%
              </Text>
            </View>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
