/* @jsx */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import NavigationBar, { CommonButton } from 'components/NavigationBar';
import AccordionPanel from 'components/AccordionPanel';
import { View, ScrollView, Text } from 'react-native';
import { Logo, Description, Details, ListedExchange } from './TokenComponents';
import styles from './styles';

@connect(
  state => ({
    locale: state.intl.get('locale'),
    listedExchange: state.ticker.get('listedExchange'),
    loading: state.ticker.get('loading')
  }),
  null,
  null,
  { withRef: true }
)
export default class TokenDetails extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    };
  }

  render() {
    const { listedExchange, loading } = this.props;
    return (
      <View style={styles.container}>
        <NavigationBar
          leftButton={
            <CommonButton
              iconName="md-arrow-back"
              onPress={() => Navigation.pop(this.props.componentId)}
            />
          }
          title="Token Details"
        />
        <View style={styles.scrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Logo />
            <ListedExchange data={listedExchange} loading={loading} />
            <Description />
            <Details />
          </ScrollView>
        </View>
      </View>
    );
  }
}
