import React, { Component, Fragment } from 'react'
import { View } from 'react-native'
import Tabs from '../../components/UI/Tabs'
import i18n from '../../../i18n'
import MyCart from './components/MyCart'
import MyBookingTab from './components/MyBookingTab'
import { axiosInstance, apiUrls } from '../../constants/api'
import { bookingOrderEnum } from '../../constants/socialSportsActivity'

import Loading from '../../components/Loading'

import { tabs } from './constants'
import { NavHeaderUser } from '../../components/NavHeaderUser'

export default class MyBookings extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('more.my_bookings')
    }
  }

  constructor(props) {
    super(props)
    const {
      navigation: { getParam }
    } = props
    const currentTab = getParam('currentTab', 0)

    this.state = {
      currentTab,
      cart: [],
      tickets: [],
      ssa: [],
      packages: [],
      isLoading: true
    }
  }

  componentDidMount() {
    const requests = [axiosInstance(apiUrls.getFullCart), axiosInstance(apiUrls.getBookings)]

    Promise.all(requests).then(([cart, bookings]) => {
      const tickets = []
      const ssa = []
      const packages = []

      bookings.data.forEach(item => {
        switch (item.Type) {
          case bookingOrderEnum.TicketSeat: {
            tickets.push(item)
            break
          }
          case bookingOrderEnum.SsaParticipation: {
            ssa.push(item)
            break
          }
          case bookingOrderEnum.Package: {
            packages.push(item)
            break
          }
          default:
            console.log('Undefined booking type')
        }
      })

      this.setState({
        isLoading: false,
        cart: cart.data,
        tickets,
        ssa,
        packages
      })
    })
  }

  changeTab = tabIndex => {
    this.setState({
      currentTab: tabIndex
    })
  }

  render() {
    const { currentTab, tickets, ssa, packages, cart, isLoading } = this.state

    if (isLoading) {
      return <Loading />
    }

    return (
      <Fragment>
        <Tabs currentTab={currentTab} onPress={this.changeTab} tabs={tabs.map(tab => tab.tabName())} />
        <View style={{ paddingHorizontal: 10, flex: 1, backgroundColor: '#d3d3d3', paddingTop: 5 }}>
          {tabs[currentTab].tabName() === i18n.t('bookings.my_cart') && <MyCart data={cart} />}
          {tabs[currentTab].tabName() === 'My Packages' && (
            <MyBookingTab type="packages" data={packages} message={i18n.t('messages.no_activities_bought')} />
          )}
          {tabs[currentTab].tabName() === 'My Matches' && (
            <MyBookingTab type="ssa" data={ssa} message={i18n.t('messages.no_matches_participated')} />
          )}
          {tabs[currentTab].tabName() === i18n.t('bookings.my_tickets') && (
            <MyBookingTab type="tickets" data={tickets} message={i18n.t('messages.no_tickets_bought')} />
          )}
        </View>
      </Fragment>
    )
  }
}
