import React from 'react';
import { View, Image, Text } from 'react-native';
import propTypes, { number, string } from 'prop-types';
import colors from '../../../../constants/colors';
import { fontFamily, fontSize } from '../../../../constants/fonts';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5';

const setColorByRank = rank => {
  switch (rank) {
    case 1:
      return 'rgb(225, 208, 9)';
    case 3:
      return 'rgb(208, 134, 83)';
    default:
      return colors.basicBorder;
  }
};

const LeaderItem = ({ leader }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <View
        style={{
          height: 32,
          width: 32,
          borderRadius: 16,
          borderColor: setColorByRank(leader.Rank),

          borderWidth: [1, 2, 3].indexOf(leader.Rank) === -1 ? 1.3 : 1.7,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: setColorByRank(leader.Rank) }}>{leader.Rank}</Text>
      </View>
      <Image
        style={{ width: 32, height: 32, marginHorizontal: 10 }}
        source={{ uri: leader.ImageUrl }}
      />
      <View>
        <Text style={{ fontFamily: fontFamily.gothamMedium }}>{leader.Name}</Text>
        <View style={{ flexDirection: 'row' }}>
          {/*<FontAwesomeIcons name="shoe-prints" size={12} style={{ marginRight: 5 }} />*/}
          <Text style={{ fontFamily: fontFamily.gothamLight, fontSize: fontSize.small }}>
            {leader.Achievements}
          </Text>
        </View>
      </View>
    </View>
  );
};

LeaderItem.propTypes = {
  leader: propTypes.shape({
    Rank: number.isRequired,
    Achievements: string.isRequired,
    ImageUrl: string.isRequired,
    Name: string.isRequired,
  }).isRequired,
};

export default LeaderItem;
