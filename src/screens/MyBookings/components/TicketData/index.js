import React from 'react';
import moment from 'moment';
import DataLine from '../DataLine';
import { bookingOrderDict } from '../../../../constants/socialSportsActivity';

const TicketData = ({ item }) => (
  <>
    <DataLine
      text={bookingOrderDict[item.Type]}
      icon={{ library: 'fontAwesome5', name: 'ticket-alt' }}
    />
    <DataLine
      text={moment(item.EventDateTime).format('MMM DD, YYYY')}
      icon={{ library: 'fontAwesome', name: 'calendar' }}
    />
    <DataLine text={item.VenueTitle} icon={{ library: 'fontAwesome5', name: 'map-marker-alt' }} />
    <DataLine
      text={`row ${item.Description.Row} seat ${item.Description.Seat}`}
      icon={{ library: 'fontAwesome5', name: 'chair' }}
    />
  </>
);
export default TicketData;
