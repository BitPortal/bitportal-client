/* @jsx */
import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider, FormattedNumber, FormattedMessage } from 'react-intl'
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
    const { locale, producer } = this.props
    const weight = +producer.getIn(['info', 'weight'])
    const teamLocation = producer.getIn(['info', 'org', 'location'])
    const teamName = producer.getIn(['info', 'org', 'name'])
    const bpLocation = producer.getIn(['info', 'nodes', '0', 'location', 'name'])
    const website = producer.getIn(['info', 'org', 'website'])
    const logo = producer.getIn(['info', 'org', 'branding', 'logo'])
    const graColor = weight === 1 ? Colors.recommandColor : Colors.cooperateColor
    const owner = producer.get('owner')
    const url = producer.get('url')
    const totalVotes = producer.get('total_votes')

    return (
      <IntlProvider messages={messages[locale]}>
        <View>
          <View style={[styles.header, styles.between]}>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              {!!logo && <Image source={{ uri: `https://storage.googleapis.com/bitportal-cms/bp/${logo}` }} style={styles.icon} />}
              <View style={{ marginLeft: 10 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text16, { fontWeight: 'bold', marginRight: 10 }]}>
                    {teamName || owner}
                  </Text>
                  {!!weight &&
                    <LinearGradientContainer type="right" colors={graColor} style={[styles.center, styles.flag]} >
                      <Text style={[styles.text12, { marginHorizontal: 5, color: Colors.textColor_255_255_238 }]}>
                        {weight === 1 && <FormattedMessage id="prod_name_tag_prmt" />}
                        {weight === 2 && <FormattedMessage id="prod_name_tag_cprt" />}
                      </Text>
                    </LinearGradientContainer>
                  }
                </View>
                {!!teamName && <Text style={[styles.text12, { color: Colors.textColor_white_4, marginLeft: -7 }]}>{'  '}@{owner}</Text>}
                <Text style={[styles.text16, { color: Colors.textColor_89_185_226 }]}>{website || url}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.info, { marginVertical: 10}]}>
            {!!teamLocation && <View style={[styles.between]}>
              <Text style={styles.text14}><FormattedMessage id="prod_sec_info_teamloc" />:</Text>
              <Text style={styles.text14}>{teamLocation}</Text>
            </View>}
            {!!bpLocation && <View style={[styles.between, { marginVertical: 10 }]}>
              <Text style={styles.text14}><FormattedMessage id="prod_sec_info_bploc" />:</Text>
              <Text style={styles.text14}>{bpLocation}</Text>
            </View>}
            <View style={[styles.between]}>
              <Text style={styles.text14}><FormattedMessage id="prod_sec_info_score" />:</Text>
              <Text style={styles.text14}>
                <FormattedNumber
                  value={totalVotes}
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
