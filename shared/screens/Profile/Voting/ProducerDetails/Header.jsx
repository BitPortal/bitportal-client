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
    const graColor = true ? Colors.recommandColor : Colors.cooperateColor
    const weight = +info.get('weight')
    const teamLocation = info.getIn(['org', 'location'])
    const bpLocation = info.getIn(['nodes', '0', 'location', 'name'])
    const website = info.getIn(['org', 'website'])

    return (
      <IntlProvider messages={messages[locale]}>
        <View>
          <View style={[styles.header, styles.between]}>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <Image source={Images.about_logo} style={styles.icon} />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.text16, { marginLeft: 4, fontWeight: 'bold' }]}>
                  {info.get('account_name')}
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
          <View style={[styles.info, styles.center, { marginVertical: 10}]}>
            <View style={[styles.center, { flex: 1 }]}>
              <Text style={styles.text12}>Team location</Text>
              <Text style={styles.text12}>{teamLocation}</Text>
            </View>
            <View style={styles.line} />
            <View style={[styles.center, { flex: 1 }]}>
              <Text style={styles.text12}>BP location</Text>
              <Text style={styles.text12}>{bpLocation}</Text>
            </View>
            <View style={styles.line} />
            <View style={[styles.center, { flex: 1 }]}>
              <Text style={styles.text12}>Votes</Text>
              <Text style={styles.text12}>
                <FormattedNumber
                  value={this.props.votes}
                  maximumFractionDigits={0}
                  minimumFractionDigits={0}
                />
              </Text>
            </View>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
