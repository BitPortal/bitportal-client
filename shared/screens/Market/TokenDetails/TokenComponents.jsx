import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, ActivityIndicator } from 'react-native';
import Colors from 'resources/colors';
import { filterBgColor } from 'utils';
import { FormattedNumber } from 'react-intl';
import AccordionPanel from 'components/AccordionPanel';
import { EXCHANGE_NAMES } from 'constants/market';
import styles from './styles';

const Tag = props => (
  <View style={styles.tag}>
    <Text style={{ textAlign: 'center', color: Colors.textColor_89_185_226 }}>
      {props.tag || 'Tag'}
    </Text>
  </View>
);

export const Logo = () => (
  <View style={styles.cardContainer}>
    <View style={styles.titleWrapper}>
      <View style={styles.iconPlacerholder}>
        <Text>LOGO</Text>
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={[styles.text18, { fontWeight: 'bold' }]}>Bytom</Text>
        <Text style={[styles.text16, {}]}>BTM</Text>
      </View>
    </View>
    <View style={[styles.spaceBetween, { paddingVertical: 5 }]}>
      <Text style={styles.text18}>11,949.00 USD</Text>
      <View
        style={[
          styles.center,
          {
            minWidth: 70,
            borderRadius: 4,
            padding: 2,
            backgroundColor: filterBgColor('-7.09')
          }
        ]}
      >
        <Text style={[styles.text14, { color: Colors.textColor_255_255_238 }]}>
          <FormattedNumber
            value="-7.09"
            maximumFractionDigits={2}
            minimumFractionDigits={2}
          />
          %
        </Text>
      </View>
    </View>

    <View style={[styles.spaceBetween, { marginTop: 4 }]}>
      <Text style={[styles.text14, { color: Colors.textColor_142_142_147 }]}>
        Total Cap: 14,930,243,300 USD
      </Text>
    </View>
    <View style={[styles.row, { paddingVertical: 10 }]}>
      <Tag />
      <Tag />
    </View>
  </View>
);

export const Description = () => (
  <AccordionPanel title="Description">
    <View
      style={{
        paddingHorizontal: 25,
        paddingBottom: 30,
        marginLeft: 4,
        flex: 1
      }}
    >
      <Text
        // numberOfLines={2}
        ellipseMode="clip"
        style={[
          styles.text14,
          {
            // flex: 1
            // paddingVertical: 20,
            // paddingHorizontal: 25,
            // paddingBottom: 30,
            // marginLeft: 4
          }
        ]}
      >
        Bytom is an interactive protocol of multiple byte assets. Heterogeneous
        byte-assets (indigenous digital currency, digital assets) that operate
        in different formats Bytom is an interactive protocol of multiple byte
        assets. Heterogeneous byte-assets (indigenous digital currency, digital
        assets) that operate in different fo Bytom is an interactive protocol of
        multiple byte assets. Heterogeneous byte-assets (indigenous digital
        currency, digital assets) that operate in different formats Bytom is an
        interactive protocol of multiple byte assets. Heterogeneous byte-assets
        (indigenous digital currency, digital assets) that operate in different
        fo Bytom is an interactive protocol of multiple byte assets.
        Heterogeneous byte-assets (indigenous digital currency, digital assets)
        that operate in different formats Bytom is an interactive protocol of
        multiple byte assets. Heterogeneous byte-assets (indigenous digital
        currency, digital assets) that operate in different fo
      </Text>
    </View>
  </AccordionPanel>
);

export const Details = () => (
  <AccordionPanel title="Details">
    <View
      style={{
        paddingHorizontal: 25,
        // paddingBottom: 30,
        marginLeft: 4
      }}
    >
      <View style={[styles.spaceBetween, { marginTop: 10 }]}>
        <Text style={styles.text14}> Locations </Text>
        <Text style={styles.text14}> Hangzhou </Text>
      </View>
      <View style={[styles.spaceBetween, { marginTop: 10 }]}>
        <Text style={styles.text14}> Total Supply </Text>
        <Text style={styles.text14}> 1,706,000.000 </Text>
      </View>
      <View style={[styles.spaceBetween, { marginTop: 10 }]}>
        <Text style={styles.text14}> Funds Raised </Text>
        <Text style={styles.text14}> 8,900 BTC </Text>
      </View>
      <View style={[styles.spaceBetween, { marginTop: 10 }]}>
        <Text style={styles.text14}> Token Cost </Text>
        <Text style={styles.text14}> 0.4 USD </Text>
      </View>
      <View style={[styles.spaceBetween, { marginTop: 10 }]}>
        <Text style={styles.text14}> KYC Info </Text>
        <Text style={styles.text14}> None </Text>
      </View>
      <View style={[styles.spaceBetween, { marginTop: 10 }]}>
        <Text style={styles.text14}> ICO Date </Text>
        <Text style={styles.text14}> 2017.06.20 </Text>
      </View>
    </View>
  </AccordionPanel>
);

export const ListedExchange = (props) => {
  const { data, loading } = props;
  console.log('listedexchange page', data);
  return (
    <AccordionPanel title="Listed Exchange">
      <View
        style={{
          paddingHorizontal: 25,
          // paddingBottom: 30,
          marginLeft: 4
        }}
      >
        {loading ? (
          <View style={styles.loadingSymbol}>
            <ActivityIndicator />
          </View>
        ) : (
          data.map(item => (
            <View style={[styles.spaceBetween, { marginTop: 10 }]}>
              <Text style={styles.text14}>
                {' '}
                {EXCHANGE_NAMES[item.exchange]}{' '}
              </Text>
              <Text style={styles.text14}>
                {' '}
                {`${item.price_last} ${item.quote_asset}`}{' '}
              </Text>
            </View>
          ))
        )}
        {/* <View style={[styles.spaceBetween, { marginTop: 10 }]}>
          <Text style={styles.text14}> Huobi.pro </Text>
          <Text style={styles.text14}> 11,949.00 USD </Text>
        </View>
        <View style={[styles.spaceBetween, { marginTop: 10 }]}>
          <Text style={styles.text14}> Bibox </Text>
          <Text style={styles.text14}> 11,949.00 USD </Text>
        </View>
        <View style={[styles.spaceBetween, { marginTop: 10 }]}>
          <Text style={styles.text14}> Gate.io </Text>
          <Text style={styles.text14}> 11,949.00 USD </Text>
        </View> */}
      </View>
    </AccordionPanel>
  );
};
