/* @jsx */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { FormattedNumber } from 'react-intl'
import { Text, View, ScrollView } from 'react-native'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import ChartWrapper from './ChartWrapper'
import RecordItem from './RecordItem'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class AssetChart extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    data: [
      { amount: 234.532 },
      { amount: -4212.42 }
    ]
  }

  checkTransactionRecord = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.TransactionRecord'
      }
    })
  }

  render() {
    const { assetInfo } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          title={assetInfo.get('assetName')}
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Text style={[styles.text24, { marginTop: 20 }]}>
                <FormattedNumber
                  value={assetInfo.get('amount')}
                  maximumFractionDigits={4}
                  minimumFractionDigits={4}
                />
              </Text>
              <Text style={[styles.text14, { marginBottom: 20 }]}>
                ≈ ¥
                <FormattedNumber
                  value={assetInfo.get('amount') * 6.5}
                  maximumFractionDigits={4}
                  minimumFractionDigits={4}
                />
              </Text>

              <ChartWrapper />

              {
                this.state.data.map((item, index) => (
                  <RecordItem key={index} item={item} onPress={() => this.checkTransactionRecord()} />
                ))
              }

            </View>
          </ScrollView>
        </View>

      </View>
    )
  }
}
