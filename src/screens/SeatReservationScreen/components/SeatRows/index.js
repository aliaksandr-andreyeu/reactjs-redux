import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import propTypes from 'prop-types';
import styles from './styles';
import Seat from '../Seat';

class SeatRows extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderRow = ([row, seats]) => {
    const { checkSeat, tags } = this.props;

    const sortedSeats = seats.sort((a, b) => a.Seat - b.Seat);

    return (
      <View style={styles.rowContainer}>
        <Text style={styles.rowNumber}>{row}</Text>
        <FlatList
          extraData={tags}
          data={sortedSeats}
          renderItem={seat => {
            let isExist = Boolean(
              tags.find(item => {
                return item.OriginalId == seat.item.TicketCode;
              })
            );
            return <Seat seat={seat.item} checkSeat={() => checkSeat()} isExist={isExist} />;
          }}
          keyExtractor={seat => seat.TicketCode.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  render() {
    const { selectedSector, tags } = this.props;
    return (
      <ScrollView>
        <FlatList
          extraData={tags}
          data={selectedSector.Seats}
          renderItem={({ item }) => this.renderRow(item)}
          keyExtractor={(item, index) =>
            item[0] !== undefined ? item[0].toString() : index.toString()
          }
        />
      </ScrollView>
    );
  }
}

SeatRows.propTypes = {
  // selectedSector: propTypes.arrayOf(propTypes.array).isRequired,
};

export default SeatRows;
