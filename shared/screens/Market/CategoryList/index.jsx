import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import Colors from 'resources/colors';
import { MARKET_CATEGORY_NAMES } from 'constants/market';
import styles from './styles';

const ListItem = ({ category, onPress, active }) => (
  <TouchableHighlight
    underlayColor={Colors.hoverColor}
    style={styles.listContainer}
    onPress={() => onPress(category)}
  >
    <View
      style={[styles.listContainer, styles.between, { paddingHorizontal: 32 }]}
    >
      <Text style={styles.text16}>{MARKET_CATEGORY_NAMES[category]}</Text>
      {active && (
        <Ionicons
          name="ios-checkmark"
          size={36}
          color={Colors.bgColor_0_122_255}
        />
      )}
    </View>
  </TouchableHighlight>
);

const CategoryList = ({
  dismissModal,
  activeCategory,
  categoryList,
  changeCategory
}) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
      onPress={() => dismissModal()}
    />
    <View style={styles.bgContainer}>
      <ScrollView
        style={{ maxHeight: 400, backgroundColor: Colors.bgColor_30_31_37 }}
        showsVerticalScrollIndicator={false}
      >
        {categoryList.map(category => (
          <ListItem
            key={category}
            category={category}
            active={activeCategory === category}
            onPress={() => changeCategory(category)}
          />
        ))}
      </ScrollView>
    </View>
  </View>
);

export default CategoryList;
