import React from 'react'
import moment from 'moment'
import DataLine from '../DataLine'

const MyCartData = ({ item }) => (
  <>
    <DataLine text={moment(item.DateTime).format('MMM DD, YYYY')} icon={{ library: 'fontAwesome', name: 'calendar' }} />
    <DataLine text={item.VenueName} icon={{ library: 'fontAwesome5', name: 'map-marker-alt' }} />
    <DataLine text={`row ${item.Row} seat ${item.Seat}`} icon={{ library: 'fontAwesome5', name: 'chair' }} />
  </>
)

export default MyCartData
