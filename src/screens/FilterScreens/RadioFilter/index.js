import React, { Component } from 'react'
import { FlatList } from 'react-native'
import Radio from '../../../components/SortAndFilter/FilterRadio'
import FilterLayout from '../../../components/SortAndFilter/SortAndFilterLayout'

class RadioFilter extends Component {
  constructor(props) {
    super(props)
    const { navigation } = this.props

    const selectedItems = navigation.getParam('selectedItems', [])

    this.state = {
      selectedItems
    }
  }

  handleSelection = id => {
    let updatedList = []

    updatedList.push(id)

    this.setState({
      selectedItems: updatedList
    })
  }

  handleReset = () => {
    const {
      defaultValue,
      isContactUs,
      isHomeScreen,
      isBookingScreen,
      isVenuesScreen,
      isEventsScreen,
      isBookingsListScreen
    } = this.props.navigation.state.params || {}

    this.setState({
      selectedItems: isBookingScreen
        ? []
        : isContactUs
        ? [defaultValue]
        : Boolean(isHomeScreen) || Boolean(isVenuesScreen) || Boolean(isEventsScreen) || Boolean(isBookingsListScreen)
        ? ['']
        : ['All']
    })
  }

  render() {
    const { navigation } = this.props
    const { selectedItems } = this.state

    const { onApply, isBookingScreen, screenTitle } = navigation.state.params || {}
    const items = navigation.getParam('items', [])

    // console.log('selectedItems', selectedItems)
    // console.log('navigation', navigation)

    return (
      <FilterLayout title={screenTitle} onApply={() => onApply(selectedItems)} onCancel={() => this.handleReset()}>
        <FlatList
          data={items}
          extraData={this.state}
          renderItem={({ item }) => {
            return (
              <Radio item={item} selectedItems={selectedItems} handleSelection={() => this.handleSelection(item.id)} />
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </FilterLayout>
    )
  }
}

export default RadioFilter
