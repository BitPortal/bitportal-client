import React, { Component } from 'react'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Text, View, SectionList } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import ListItem from './ListItem'
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

export default class TransationHistory extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    sections: [
      { timeStamp: '04/28/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '05/03/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '06/21/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '04/28/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '05/03/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '06/21/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '04/28/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '05/03/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '06/21/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '04/28/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '05/03/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] },
      { timeStamp: '06/21/2018 14:20:17', data: [{ amount: 14213.3242 }, { amount: -41232.422 }] }
    ]
  }

  render() {
    const { locale } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={messages[locale].txhis_title_name_txhistory}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <SectionList
              renderItem={({ item, index }) => <ListItem key={index} item={item} onPress={() => {}} />}
              renderSectionHeader={({ section: { timeStamp } }) => (
                <View style={styles.sectionHeader}>
                  <Text style={[styles.text12, { marginLeft: 30 }]}>
                    { timeStamp }
                  </Text>
                </View>
              )}
              sections={this.state.sections}
              keyExtractor={(item, index) => item + index}
            />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
