import React, { Component } from 'react'
import { Alert, Image, Dimensions, Modal, ScrollView, View, Text, TouchableOpacity } from 'react-native'
import propTypes from 'prop-types'
import styles from './styles'
import { axiosInstance, apiUrls } from '../../constants/api'
import Dropdown from '../../components/UI/Dropdown'
import SeatRows from './components/SeatRows'
import ConfirmButtons from '../../components/UI/ConfirmButtons'
import i18n from '../../../i18n'
import isEqual from 'lodash.isequal'

import { fontFamily, fontSize } from '../../constants/fonts'
import colors from '../../constants/colors'

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView'

class SeatReservationScreen extends Component {
  constructor(props) {
    super(props)
    const { navigation } = props

    this.state = {
      sectors: [],
      selectedSector: null,
      modalVisible: false,

      dimensions: {
        window: Dimensions.get('window'),
        screen: Dimensions.get('screen')
      },

      tags: []
    }

    this.event = navigation.getParam('event', {})
    this.dropdownRef = React.createRef()
  }

  closeModalSeatMap() {
    this.setState({
      modalVisible: false
    })
  }

  openModalSeatMap() {
    this.setState({
      modalVisible: true
    })
  }

  modalSeatMap() {
    const { modalVisible, dimensions } = this.state

    const { navigation } = this.props

    const eventItem = navigation.getParam('event', {})

    return eventItem.SeatMapImageUrl ? (
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => this.closeModalSeatMap()}
        onDismiss={() => this.closeModalSeatMap()}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)'
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.closeModalSeatMap()}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 16
            }}
          >
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 4,
                overflow: 'hidden',
                height: dimensions.window.height - 80,
                width: dimensions.window.width - 40
              }}
              onStartShouldSetResponder={event => true}
            >
              <ReactNativeZoomableView
                captureEvent={true}
                maxZoom={1.5}
                minZoom={0.5}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                movementSensibility={0.5}
                style={{
                  padding: 10
                }}
              >
                <Image
                  style={{
                    flex: 1,
                    width: null,
                    height: '100%'
                  }}
                  // source={require('../../assets/images/__seatMapTest.png')}
                  source={{
                    uri: eventItem.SeatMapImageUrl ? eventItem.SeatMapImageUrl : ''
                  }}
                  resizeMode="contain"
                />
              </ReactNativeZoomableView>

              <TouchableOpacity
                onPress={() => this.closeModalSeatMap()}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 12
                }}
              >
                <FontAwesomeIcon name="close" color={colors.themeColor} size={32} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    ) : null
  }

  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } })
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onChange)
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props, prevProps)) {
      this.checkSeat()
    }
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.onChange)

    this.checkSeat()

    if (this.event.Id) {
      axiosInstance
        .post(apiUrls.postSeatMapById(this.event.Id))
        .then(({ data }) => {
          const validSectors = data.Sectors.filter(sector => sector.Title)

          this.setState({
            sectors: this.mapSectors(validSectors)
          })
        })
        .catch(err => console.log(err))
    }
  }

  selectSector = (sectorId, dropdown) => {
    const requests = [
      axiosInstance.post(apiUrls.postCart),
      axiosInstance(apiUrls.getSectorWithPricing(this.event.Id, sectorId))
    ]

    Promise.all(requests).then(([cart, sector]) =>
      this.setState(
        {
          selectedSector: {
            ...sector.data.Sector,
            Seats: this.mapRowsInSector(sector.data.Sector.Seats, cart.data.Cart)
          }
        },
        () => {
          // console.log('selectedSector', this.state.selectedSector)
          if (!dropdown) {
            this.dropdownRef.current.toggleDropdown()
          }
        }
      )
    )
  }

  mapSectors = sectors => {
    return sectors.map(({ Id, Uuid, Title, Color, SeatMapId }) => ({
      id: Id,
      uuid: Uuid,
      title: Title,
      color: Color,
      seatMapId: SeatMapId
    }))
  }

  mapRowsInSector = (seats, cart) => {
    // console.log('seats', seats);

    const rowsWithSeats = seats.reduce((prev, next) => {
      const prevCopy = { ...prev }

      if (next.AvailableQuantity > 0) {
        const nextCopy = {
          ...next,
          isReserved: cart.Items.some(item => item.OriginalId === next.TicketCode)
        }

        if (prev[nextCopy.Row]) {
          prevCopy[nextCopy.Row].push(nextCopy)
        } else {
          prevCopy[nextCopy.Row] = [nextCopy]
        }
      }

      return prevCopy
    }, {})

    return Object.entries(rowsWithSeats)
  }

  checkSeat(cb) {
    const { tags, selectedSector } = this.state
    const { navigation } = this.props

    const eventItem = navigation.getParam('event', {})

    axiosInstance
      .get(apiUrls.getFullCart)
      .then(({ data }) => {
        this.setState(
          {
            tags: data.filter(item => {
              return item.EventId == eventItem.Id
            })
          },
          () => {
            // console.log('tags', this.state.tags)
            Boolean(cb) && cb()
          }
        )
      })
      .catch(err => console.log(err))
  }

  removeTag(OriginalId) {
    Alert.alert(
      i18n.t('alerts.cancel_seat_selection'),
      false,
      [
        {
          text: i18n.t('alerts.cancel_seat_yes'),
          onPress: () => {
            const { selectedSector, tags } = this.state

            let seatsTags = tags

            this.setState(
              {
                tags: seatsTags.filter(item => {
                  return item.OriginalId !== OriginalId
                })
              },
              () => {
                const params = {
                  TicketId: OriginalId
                }
                axiosInstance.post(apiUrls.postDeleteSeat, params).then(res => {
                  if (!res.isError) {
                    this.checkSeat(() => {
                      //selectedSector && selectedSector.Id && this.selectSector(selectedSector.Id, true)
                    })
                  }
                })
              }
            )
          }
        },
        {
          text: i18n.t('alerts.cancel_seat_no'),
          style: 'cancel'
        }
      ],
      {
        cancelable: false
      }
    )
  }

  renderTags() {
    const { tags } = this.state

    return (
      <View
        style={{
          marginBottom: 16
        }}
      >
        {tags.map((item, key) => {
          return (
            <View
              key={key}
              style={{
                borderWidth: 1,
                borderColor: colors.themeColor,
                borderRadius: 16,
                height: 32,
                alignItems: 'center',
                justifyContent: 'space-between',
                // flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                flexDirection: 'row',
                marginBottom: 8,
                // paddingLeft: i18n.locale.toLowerCase() == 'en' ? 16 : 8,
                paddingLeft: 16,
                // paddingRight: i18n.locale.toLowerCase() == 'en' ? 8 : 16,
                paddingRight: 8
              }}
            >
              <View
                style={{
                  // borderWidth: 1,
                  // borderColor: colors.themeColor,
                  // flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    // borderWidth: 1,
                    // borderColor: colors.themeColor,
                    fontFamily: fontFamily.gothamRegular,
                    color: colors.themeColor,
                    fontSize: fontSize.regular,
                    lineHeight: fontSize.regular + 10,
                    height: fontSize.regular + 10
                  }}
                >
                  Sector {item.Sector}
                  {', '}Row {item.Row}
                  {', '}Seat {item.Seat}
                  {', '}
                </Text>

                <Text
                  style={{
                    // borderWidth: 1,
                    // borderColor: colors.themeColor,
                    fontFamily: fontFamily.gothamBold,
                    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
                    color: colors.themeColor,
                    fontSize: fontSize.regular,
                    lineHeight: fontSize.regular + 10,
                    height: fontSize.regular + 10
                  }}
                >
                  {item.Currency} {item.Price}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    padding: 2
                  }}
                  onPress={() => {
                    this.removeTag(item.OriginalId)
                  }}
                >
                  <FontAwesomeIcon name="close" color={'#C30907'} size={24} />
                </TouchableOpacity>
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  render() {
    const { selectedSector, sectors, tags } = this.state
    const { navigation } = this.props

    // console.log('selectedSector', selectedSector)
    // console.log('sectors', sectors)

    const eventItem = navigation.getParam('event', {})

    return (
      <>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.innerContainer}>
            <Text style={styles.title}>{this.event.Title}</Text>

            {Boolean(eventItem.SeatMapImageUrl) && (
              <TouchableOpacity
                onPress={() => {
                  this.openModalSeatMap()
                }}
                style={{
                  backgroundColor: '#000066',
                  borderRadius: 4,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 32
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.gothamMedium,
                    color: '#ffffff',
                    fontSize: 20
                  }}
                >
                  {i18n.t('events.view_seatmap')}
                </Text>
              </TouchableOpacity>
            )}

            {this.renderTags()}

            <Dropdown
              ref={this.dropdownRef}
              title="Select a sector"
              selectedItem={selectedSector ? selectedSector.Title : ''}
            >
              {sectors.map((sector, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    this.selectSector(sector.id)
                  }}
                >
                  <Text>{sector.title}</Text>
                </TouchableOpacity>
              ))}
            </Dropdown>
            {selectedSector && (
              <SeatRows selectedSector={selectedSector} checkSeat={() => this.checkSeat()} tags={tags} />
            )}
          </ScrollView>
          <ConfirmButtons
            confirmLabel={i18n.t('generic.buttons.next')}
            cancelLabel={i18n.t('generic.buttons.clear')}
            handleSave={() => navigation.navigate('Payment')}
            closeOnApply={false}
          />
        </View>
        {this.modalSeatMap()}
      </>
    )
  }
}

SeatReservationScreen.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired,
    getParam: propTypes.func.isRequired
  })
}

export default SeatReservationScreen
