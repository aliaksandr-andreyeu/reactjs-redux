import React from 'react'
import moment from 'moment'
import DataLine from '../DataLine'
import { bookingOrderDict } from '../../../../constants/socialSportsActivity'

const SsaData = ({ item }) => (
  <>
    <DataLine text={bookingOrderDict[item.Type]} icon={{ library: 'fontAwesome5', name: 'ticket-alt' }} />
    <DataLine
      text={moment(item.EventDateTime).format('MMM DD, YYYY')}
      icon={{ library: 'fontAwesome', name: 'calendar' }}
    />
    <DataLine text={item.VenueTitle} icon={{ library: 'fontAwesome5', name: 'map-marker-alt' }} />
  </>
)
export default SsaData

// {
//   "OrderItemId": null,
//   "Title": "Badminton | Amateur",
//   "Description": {
//     "ParticipantLevel": "Amateur",
//     "SsaActivityId": 1098,
//     "SportsCategory": "Badminton",
//     "Summary": "Badminton | Amateur at Hamdan Sports Complex"
//   },
//   "ImageUrl": "https://res.cloudinary.com/sports-gate/image/upload/v1554139011/dxb/hnzhwohcrmwgtzald7bw.jpg",
//   "Type": 3,
//   "Price": 0,
//   "EventDateTime": "2019-10-30T11:00:00",
//   "PurchaseDateTime": "2019-10-27T11:51:57.38",
//   "ParticipantsCount": 3,
//   "VenueId": 17,
//   "VenueTitle": "Hamdan Sports Complex"
// },
