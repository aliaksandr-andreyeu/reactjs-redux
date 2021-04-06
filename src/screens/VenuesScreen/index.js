import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  TextInput,
  ImageBackground,
  PermissionsAndroid
} from 'react-native'

import PropTypes from 'prop-types'
import isEqual from 'lodash.isequal'
import { axiosInstance, apiUrls } from '../../constants/api'
import VenueItem, { VENUE_ITEM_HEIGHT, VENUE_ITEM_MARGIN_BOTTOM } from './components/VenueItem'
import Loading from '../../components/Loading'
import FilterAndSearchBar from '../../components/FilterAndSearchBar'

import * as actions from './actions'

import colors from '../../constants/colors'
import styles from './styles'

import Geolocation from '@react-native-community/geolocation'

// import { getAuthenticatedUser } from '../../helpers/miscHelpers';
import { NavHeaderUser } from '../../components/NavHeaderUser'
import { getSortAndFilterModel } from '../../helpers/filters'
import i18n from '../../../i18n'

import { fontFamily } from '../../constants/fonts'

import MapView from 'react-native-map-clustering'
import { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps' // remove PROVIDER_GOOGLE import if not using Google Maps

export class Venues extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('venues.title')
    }
  }

  defaultMapMarkerImage = require('../../assets/images/markers/map-walking.png')
  locationMarker = require('../../assets/images/location_marker.png')

  markerImages = [
    null,
    null,
    require('../../assets/images/markers/map-2.png'),
    require('../../assets/images/markers/map-3.png'),
    require('../../assets/images/markers/map-4.png'),
    null,
    require('../../assets/images/markers/map-6.png'),
    null,
    require('../../assets/images/markers/map-8.png'),
    require('../../assets/images/markers/map-9.png'),
    require('../../assets/images/markers/map-10.png'),
    require('../../assets/images/markers/map-11.png'),
    require('../../assets/images/markers/map-12.png'),
    require('../../assets/images/markers/map-13.png'),
    require('../../assets/images/markers/map-14.png'),
    require('../../assets/images/markers/map-15.png'),
    null,
    require('../../assets/images/markers/map-17.png'),
    require('../../assets/images/markers/map-18.png'),
    require('../../assets/images/markers/map-19.png'),
    require('../../assets/images/markers/map-20.png'),
    require('../../assets/images/markers/map-21.png'),
    null,
    require('../../assets/images/markers/map-23.png'),
    require('../../assets/images/markers/map-24.png'),
    null,
    require('../../assets/images/markers/map-26.png'),
    require('../../assets/images/markers/map-27.png'),
    null,
    require('../../assets/images/markers/map-29.png'),
    require('../../assets/images/markers/map-30.png'),
    require('../../assets/images/markers/map-31.png'),
    require('../../assets/images/markers/map-32.png'),
    null,
    require('../../assets/images/markers/map-34.png'),
    require('../../assets/images/markers/map-35.png'),
    require('../../assets/images/markers/map-36.png'),
    require('../../assets/images/markers/map-37.png'),
    require('../../assets/images/markers/map-38.png'),
    require('../../assets/images/markers/map-39.png'),
    require('../../assets/images/markers/map-40.png'),
    require('../../assets/images/markers/map-41.png'),
    require('../../assets/images/markers/map-42.png'),
    require('../../assets/images/markers/map-43.png'),
    require('../../assets/images/markers/map-44.png'),
    require('../../assets/images/markers/map-45.png'),
    require('../../assets/images/markers/map-46.png'),
    null,
    null,
    require('../../assets/images/markers/map-49.png'),
    require('../../assets/images/markers/map-50.png'),
    require('../../assets/images/markers/map-51.png'),
    require('../../assets/images/markers/map-52.png'),
    require('../../assets/images/markers/map-53.png'),
    require('../../assets/images/markers/map-54.png'),
    require('../../assets/images/markers/map-55.png'),
    require('../../assets/images/markers/map-56.png'),
    null,
    null,
    null,
    require('../../assets/images/markers/map-60.png'),
    require('../../assets/images/markers/map-61.png'),
    require('../../assets/images/markers/map-62.png'),
    null,
    null,
    require('../../assets/images/markers/map-65.png'),
    require('../../assets/images/markers/map-66.png'),
    require('../../assets/images/markers/map-67.png'),
    require('../../assets/images/markers/map-68.png'),
    require('../../assets/images/markers/map-69.png'),
    require('../../assets/images/markers/map-70.png'),
    require('../../assets/images/markers/map-71.png'),
    null,
    require('../../assets/images/markers/map-73.png'),
    require('../../assets/images/markers/map-74.png'),
    null
  ]

  flatListRef = React.createRef()

  state = {
    isListView: true,

    markers: [],
    filteredMarkers: [],

    isVisiblePopupMarkerDetail: false,

    activeMarker: {},

    venues: [],
    filteredVenues: [],

    checkList: '',

    isLoading: true,

    location: {
      longitude: 0,
      latitude: 0
    }
    // isAuthenticatedUser: false,
  }

  determineLocation() {
    setTimeout(() => {
      Geolocation.getCurrentPosition(
        position => {
          //console.warn(position.coords);
          if (position.coords && position.coords.latitude && position.coords.longitude) {
            this.setState({
              location: position.coords
            })
          }
        },
        error => {},
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 10000
        }
      )
    }, 500)
  }

  async componentDidMount() {
    const { sortOptions, filterOptions, clearFiltersAndSorting } = this.props

    this.determineLocation()
    clearFiltersAndSorting()

    // const user = await getAuthenticatedUser();

    let model = getSortAndFilterModel(sortOptions, filterOptions)
    model.languageCode = i18n.locale.toUpperCase()
    model.langCode = i18n.locale.toUpperCase()

    if (this.props.filterOptions.distance) {
      model.distance = +this.props.filterOptions.distance
    }

    if (this.state.location.longitude && this.state.location.latitude) {
      model = {
        ...model,
        ...this.state.location
      }
    }

    console.log('model DidMount', model)

    axiosInstance
      .post(apiUrls.postVenues, model)
      .then(({ data }) => {
        let markers = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].Lat > 0 && data[i].Lon > 0) {
            markers.push(data[i])
          }
        }

        this.setState(
          {
            venues: data,
            isLoading: false,
            markers: markers
            // isAuthenticatedUser: user,
          },
          () => {
            this.filterData()
          }
        )
      })
      .catch(err => console.log(err))
  }

  componentDidUpdate(prevProps) {
    const { sortOptions, filterOptions } = this.props

    if (!isEqual(sortOptions, prevProps.sortOptions) || !isEqual(filterOptions, prevProps.filterOptions)) {
      this.fetchItemsWithParams(sortOptions, filterOptions)
    }
  }

  fetchItemsWithParams = (sortParams, filterParams) => {
    let model = getSortAndFilterModel(sortParams, filterParams)

    model.languageCode = i18n.locale.toUpperCase()
    model.langCode = i18n.locale.toUpperCase()

    if (this.props.filterOptions.distance) {
      model.distance = +this.props.filterOptions.distance
    }

    if (this.state.location.longitude && this.state.location.latitude) {
      model = {
        ...model,
        ...this.state.location
      }
    }

    console.log('model DidUpdate', model)

    axiosInstance
      .post(apiUrls.postVenues, model)
      .then(({ data }) => {
        let markers = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].Lat > 0 && data[i].Lon > 0) {
            markers.push(data[i])
          }
        }

        this.setState(
          {
            venues: data,
            markers: markers
          },
          () => {
            this.filterData()
          }
        )
      })
      .catch(err => console.log(err))
  }

  navigateToDetails = item => {
    const { navigation } = this.props

    navigation.navigate('VenueDetails', { item })
  }

  handleMarkerPress(marker) {
    this.navigateToDetails(marker)
  }

  renderVenueItem = (item, i) => {
    return (
      <TouchableHighlight key={i.toString()} onPress={() => this.navigateToDetails(item)} underlayColor="#ffffff00">
        <VenueItem key={i.toString()} venue={item} borderRadius={5} />
      </TouchableHighlight>
    )
  }

  changeState = () => {
    this.setState({
      isListView: !this.state.isListView
    })
  }

  getMarkerSource(marker) {
    if (marker.Category > -1 && this.markerImages[marker.Category]) {
      return this.markerImages[marker.Category]
    }

    return this.defaultMapMarkerImage
  }

  renderMarker(marker, index) {
    return (
      <Marker
        key={index}
        onPress={() => this.handleMarkerPress(marker)}
        title={marker.Title}
        tracksViewChanges={false}
        coordinate={{
          latitude: marker.Lat,
          longitude: marker.Lon
        }}
        // centerOffset={{ x: -42, y: -60 }}
      >
        <View style={{ width: 36, height: 49 }}>
          <ImageBackground
            source={this.getMarkerSource(marker)}
            style={{ width: 36, height: 49 }}
            resizeMethod="scale"
          />
        </View>
      </Marker>
    )
  }

  filterData() {
    const { markers, venues, checkList } = this.state

    let filteredMarkers = markers.filter(marker => {
      let str = checkList ? checkList.toLowerCase() : ''
      let title = marker.Title ? marker.Title.toLowerCase() : ''
      let address = marker.FullAddress ? marker.FullAddress.toLowerCase() : ''

      return title.indexOf(str) >= 0 || address.indexOf(str) >= 0
    })

    let filteredVenues = venues.filter(venue => {
      let str = checkList ? checkList.toLowerCase() : ''
      let title = venue.Title ? venue.Title.toLowerCase() : ''
      let address = venue.FullAddress ? venue.FullAddress.toLowerCase() : ''

      return title.indexOf(str) >= 0 || address.indexOf(str) >= 0
    })

    this.setState({
      filteredMarkers,
      filteredVenues
    })
  }

  render() {
    const { checkList, filteredVenues, isLoading, isListView, filteredMarkers, location } = this.state

    if (isLoading) {
      return <Loading />
    }

    return (
      <View
        style={{
          flex: 1,
          paddingBottom: !isListView ? 0 : 20,
          backgroundColor: colors.primaryBgColor
        }}
      >
        <FilterAndSearchBar
          filterTargetScreen="VenuesFilterScreen"
          sortTargetScreen="VenuesSortScreen"
          isVenuesScreen={true}
          venuesScreenState={isListView}
          venuesScreenChangeState={this.changeState}
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: !isListView ? 0 : 15
          }}
        >
          {!isListView && (
            <MapView
              provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{ ...StyleSheet.absoluteFillObject }}
              showsUserLocation={true}
              showsMyLocationButton={true}
              showCompass={false}
              maxZoom={30}
              clusterColor="#202873"
              initialRegion={{
                latitude: 25.061401,
                longitude: 55.237319,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5 * (Dimensions.get('window').width / Dimensions.get('window').height)
              }}
            >
              {/*location.longitude !== 0 && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  // centerOffset={{ x: -42, y: -60 }}
                >
                  <View style={{ width: 36, height: 49 }}>
                    <ImageBackground
                      source={this.locationMarker}
                      style={{ width: 36, height: 49 }}
                      resizeMethod="scale"
                    />
                  </View>
                </Marker>
              )*/}
              {filteredMarkers.map((marker, index) => this.renderMarker(marker, index))}
            </MapView>
          )}
          <TextInput
            placeholder={i18n.t('venues.searchField')}
            placeholderTextColor="#8C9091"
            returnKeyType="go"
            style={
              isListView
                ? {
                    ...styles.searchFieldList,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                  }
                : {
                    ...styles.searchField,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                  }
            }
            onChange={e => {
              let checkList = e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : ''
              this.setState(
                {
                  checkList
                },
                () => {
                  this.filterData()
                }
              )
            }}
            value={checkList}
          />
          {isListView && filteredVenues && filteredVenues.length > 0 && (
            <FlatList
              ref={ref => {
                this.flatListRef = ref
              }}
              extraData={this.state}
              // getItemLayout={(data, index) => ({
              // length: VENUE_ITEM_HEIGHT + VENUE_ITEM_MARGIN_BOTTOM,
              // offset: (VENUE_ITEM_HEIGHT + VENUE_ITEM_MARGIN_BOTTOM) * index,
              // index,
              // })}
              // removeClippedSubviews
              data={filteredVenues}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => this.renderVenueItem(item, index)}
              initialNumToRender={15}
            />
          )}
        </View>
      </View>
    )
  }
}

Venues.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}

const mapStateToProps = state => ({
  filterOptions: state.venues.filters,
  sortOptions: state.venues.sortOptions
})

const mapDispatchToProps = {
  clearFiltersAndSorting: actions.clearVenuesData
}

export default connect(mapStateToProps, mapDispatchToProps)(Venues)
