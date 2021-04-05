import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import SkewedContainer from '../../../../components/SkewedContainer';
import colors from '../../../../constants/colors';
import styles from './styles';
import getSportsIcon from '../../../../helpers/sportsIconMapper';

const categoryItem = (item, navigation) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('CategoryDetail', {
          id: item.NameInPrimaryLang,
          object: item,
        })
      }
      style={styles.item}
    >
      {getSportsIcon(item.Id)}
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.itemText}>
        {item.NameInPrimaryLang}
      </Text>
    </TouchableOpacity>
  );
};

const EventCategoriesList = ({ eventCategories, navigation }) => {
  return (
    <View>
      <FlatList
        ListHeaderComponent={<View style={{ width: 15 }} />}
        ListFooterComponent={<View style={{ width: 15 }} />}
        data={eventCategories}
        renderItem={({ item, index }) => categoryItem(item, navigation)}
        keyExtractor={item => `item-${item.Id}`}
        horizontal
        style={{ backgroundColor: '#ffffff' }}
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.buttonWrapper} onPress={() => false}>
        <SkewedContainer
          backgroundColor={colors.themeColor}
          leftSkewType="desc"
          rightSkewType="asc"
        >
          <Text style={styles.buttonText}>SHOW ALL</Text>
        </SkewedContainer>
      </TouchableOpacity>
    </View>
  );
};

export default withNavigation(EventCategoriesList);
