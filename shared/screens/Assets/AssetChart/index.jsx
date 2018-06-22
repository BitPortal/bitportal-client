/* @jsx */
import React from 'react'
// import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'
import { Text, View, ScrollView } from 'react-native'
import BaseScreen from 'components/BaseScreen'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import ChartWrapper from './ChartWrapper'
import RecordItem from './RecordItem'
import styles from './styles'

export default class AssetChart extends BaseScreen {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true
  }

  state = {
    data: [
      { amount: 234.532 },
      { amount: -4212.42 }
    ]
  }

  checkTransactionRecord = () => {
    this.props.navigator.push({
      screen: 'BitPortal.TransactionRecord'
    })
  }

  render() {
    const { assetInfo } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={<CommonButton iconName="md-arrow-back" onPress={() => this.pop()} />}
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
