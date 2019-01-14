import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider, FormattedNumber, FormattedMessage } from 'react-intl'
import BPImage from 'components/BPNativeComponents/BPImage'
import Colors from 'resources/colors'
import Images from 'resources/images'
import LinearGradientContainer from 'components/LinearGradientContainer'
import messages from 'resources/messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.locale
  }),
  null,
  null,
  { withRef: true }
)

export default class Header extends Component {
  render() {
    const { locale, producer, votes, pressLink } = this.props
    const weight = +producer.getIn(['info', 'weight'])
    const teamLocation = producer.getIn(['info', 'org', 'location'])
    const teamName = producer.getIn(['info', 'org', 'name'])
    const bpLocation = producer.getIn(['info', 'nodes', '0', 'location', 'name'])
    const website = producer.getIn(['info', 'org', 'website'])
    const logo = producer.getIn(['info', 'org', 'branding', 'logo'])
    const graColor = weight === 1 ? Colors.cooperateColor : Colors.recommandColor
    const owner = producer.get('owner')
    const url = producer.get('url')
    const totalVotes = producer.get('total_votes')

    return (
      <IntlProvider messages={messages[locale]}>
        <View>
          <View style={[styles.header, styles.between]}>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              {
                logo
                  ? <BPImage source={{ uri: `https://storage.googleapis.com/bitportal-cms/bp/${logo}` }} style={styles.icon} />
                  : <BPImage source={Images.default_icon} style={styles.icon} />
              }
              <View style={{ marginLeft: 10 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={[styles.text16, { fontWeight: 'bold', marginRight: 10 }]}>
                    {teamName || owner}
                  </Text>
                  {!!weight
                    && <LinearGradientContainer type="right" colors={graColor} style={[styles.center, styles.flag]}>
                      <Text style={[styles.text12, { marginHorizontal: 5, color: Colors.textColor_255_255_238 }]}>
                        {weight === 1 && <FormattedMessage id="voting_label_cooperation" />}
                        {weight >= 2 && <FormattedMessage id="voting_label_promotion" />}
                      </Text>
                    </LinearGradientContainer>
                  }
                </View>
                {!!teamName && <Text style={[styles.text12, { color: Colors.textColor_white_4, marginLeft: -7 }]}>{'  '}@{owner}</Text>}
                <Text onPress={() => { pressLink(website || url) }} style={[styles.text16, { textDecorationLine: 'underline', color: Colors.textColor_89_185_226 }]}>
                  {website || url}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.info, { marginVertical: 10 }]}>
            {!!teamLocation && <View style={[styles.between]}>
              <Text style={styles.text14}><FormattedMessage id="bp_info_label_team_location" />:</Text>
              <Text style={styles.text14}>{teamLocation}</Text>
            </View>}
            {!!bpLocation && <View style={[styles.between, { marginVertical: 10 }]}>
              <Text style={styles.text14}><FormattedMessage id="bp_info_label_bp_location" />:</Text>
              <Text style={styles.text14}>{bpLocation}</Text>
            </View>}
            <View style={[styles.between]}>
              <Text style={styles.text14}><FormattedMessage id="voting_label_score" />:</Text>
              <Text style={styles.text14}>
                <FormattedNumber
                  value={totalVotes}
                  maximumFractionDigits={0}
                  minimumFractionDigits={0}
                />
                (<FormattedNumber
                   value={votes}
                   maximumFractionDigits={2}
                   minimumFractionDigits={2}
                />%)
              </Text>
            </View>
          </View>
        </View>
      </IntlProvider>
    )
  }
}
