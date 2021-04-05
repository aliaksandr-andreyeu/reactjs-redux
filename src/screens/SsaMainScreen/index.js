import React, { PureComponent } from 'react';
import { Platform, View, ScrollView, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { apiUrls, axiosInstance } from '../../constants/api';
import SsaOption from './components/SsaOption';
import SsaSectionTitle from './components/SsaSectionTitle';
import ActivityType from './components/ActivityType';
import Terms from './components/Terms';
import styles from './styles';
import { playerLevels } from '../SsaOptionScreens/PlayerLevelScreen/constants';
import { paymentOptions } from '../SsaOptionScreens/PaymentScreen/constants';
import { getValueById } from '../../helpers/getValueById';
import ConfirmButtons from '../../components/UI/ConfirmButtons';
import { clearForm, setData } from './actions';
import { formatISODate } from '../../helpers/miscHelpers';
import ModalComponent from '../../components/UI/ModalComponent';
import TimeScreen from '../SsaOptionScreens/TimeScreen';
import Loading from '../../components/Loading';
import { ssaPlayerLevel, ssaEventActivityType } from '../../constants/socialSportsActivity';
import { defaultState } from './reducers';
import { ssaMainScreenModes } from './constants';
import { ScreenConfig } from './models';
import i18n from '../../../i18n';
import { NavHeaderUser } from '../../components/NavHeaderUser';
import ErrorMessage from '../../components/ErrorMessage';

import colors from '../../constants/colors';
import { fontFamily, fontSize } from '../../constants/fonts';

import { getCart } from '../Cart/actions';

import getLocaleDate from '../../helpers/getLocaleDate';

class SsaMainScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('socialSportsActivity.create_event'),
    };
  };

  constructor(props) {
    super(props);
    const { navigation } = props;

    const navigationProps = navigation.getParam('data');

    this.state = {
      venues: {},
      packages: [],
      sportCategories: [],
      availableDates: [],
      selectedPaymentMethodIndex: -1,
      isPristine: true,
      isLoading: true,
      modalIsVisible: false,
      isPaymentMethodsShown: false,
      screenMode: navigationProps ? navigationProps.screenMode : ssaMainScreenModes.normal,
      isUpdateRun: false,
    };
  }

  componentDidMount() {
    const { clearOptions } = this.props;
    const { screenMode } = this.state;

    clearOptions();
    const isEditMode = screenMode === ssaMainScreenModes.edit;

    const requests = [
      axiosInstance(
        `${
          apiUrls.getSportCategories
        }?onlyInFfrInventory=true&langCode=${i18n.locale.toUpperCase()}`
      ),
    ];

    if (!isEditMode) {
      requests.push(axiosInstance(apiUrls.getUserPaymentMethods));
    }

    Promise.all(requests).then(([sportCategories, paymentMethods]) => {
      this.setState(() => ({
        sportCategories: sportCategories.data,
        selectedPaymentMethodIndex: paymentMethods ? 0 : -1,
        isLoading: screenMode !== ssaMainScreenModes.normal,
      }));
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { sportCategoryId, packageId } = this.props;
    const { sportCategories } = this.state;

    // console.log('sportCategoryId componentDidUpdate', sportCategoryId, typeof sportCategoryId)

    if (prevState.sportCategories.length !== sportCategories.length) {
      this.updateStoreWithInitialParams();
    }

    if (prevProps.sportCategoryId !== sportCategoryId) {
      this.getPackages(sportCategoryId);
    }

    if (packageId && prevProps.packageId !== packageId) {
      this.getAvailableDates(packageId);
    }
  }

  updateStoreWithInitialParams = () => {
    const { navigation, updateStore } = this.props;
    const passedData = navigation.getParam('data');

    if (passedData) {
      updateStore({
        ...defaultState,
        ...passedData,
      });
    }
  };

  getPackages = sportCategoryId => {
    // console.log('sportCategoryId getPackages', sportCategoryId, typeof sportCategoryId)

    const params = {
      sp: sportCategoryId,
      from: moment().format('YYYY-MM-DD'),
      to: moment().add(2, 'months').format('YYYY-MM-DD'),
      sat: 1,
    };

    axiosInstance
      .get(apiUrls.getBookAndPlay, { params })
      .then(({ data }) => {
        const { screenMode } = this.state;
        const venues = this.reduceVenues(data.Items);

        const isEditMode = screenMode === ssaMainScreenModes.edit;

        this.setState(prevState => ({
          packages: data.Items,
          venues,
          isLoading: isEditMode && prevState.isLoading,
        }));
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  getAvailableDates = packageId => {
    axiosInstance(
      `${apiUrls.getSsaTimeslotsById(packageId)}?languageCode=${i18n.locale.toUpperCase()}`
    )
      .then(({ data }) => {
        this.setState({
          availableDates: data.Days,
          isLoading: false,
        });
      })
      .catch(err => console.log(err));
  };

  reduceVenues = venues =>
    venues.reduce((prev, item) => {
      const { VenueId, VenueTitle, FacilityId, FacilityTitle } = item;
      const reducedVenues = { ...prev };

      reducedVenues[VenueId] = reducedVenues[VenueId]
        ? {
            ...reducedVenues[VenueId],
            facilities: {
              ...reducedVenues[VenueId].facilities,
              [FacilityId]: {
                facilityId: FacilityId,
                facilityTitle: FacilityTitle,
              },
            },
          }
        : {
            venueId: VenueId,
            venueTitle: VenueTitle,
            facilities: {
              [FacilityId]: {
                facilityId: FacilityId,
                facilityTitle: FacilityTitle,
              },
            },
          };

      return reducedVenues;
    }, {});

  submitCreateSsaForm = () => {
    const {
      packageId,
      date,
      startTime,
      numberOfParticipants,
      timeSlotId,
      subFacilityId,
      getCart,
    } = this.props;
    const params = this.getCreateSsaParams();

    const validatedFields = this.validateOnSubmit();

    console.log('params', params);

    if (!validatedFields.hasErrors) {
      this.setState(
        {
          isUpdateRun: true,
        },
        () => {
          axiosInstance({
            method: 'POST',
            url: apiUrls.createSsa,
            data: params,
          })
            .then(createEventRes => {
              console.log('createEventRes.data', createEventRes.data);

              this.setState(
                {
                  isUpdateRun: false,
                },
                () => {
                  getCart();

                  this.proceedToPayment();

                  // axiosInstance
                  // .post(apiUrls.postBookPackage, {
                  // PackageId: packageId,
                  // ActivityDate: formatISODate(date, startTime),
                  // TimeSlotId: timeSlotId,
                  // ParticipantsNumber: numberOfParticipants,
                  // SubFacilityId: subFacilityId,
                  // SsaEventId: createEventRes.data.Id,
                  // })
                  // .then(packageRes => {

                  // console.log('packageRes.data', packageRes.data);

                  // this.updateSsaEvent(this.proceedToPayment, {
                  // BookedPackageId: packageRes.data.BookableEntityId,
                  // Id: createEventRes.data.Id,
                  // });
                  // });
                }
              );
            })
            .catch(err => {
              console.log(err);

              this.setState({
                isUpdateRun: false,
              });
            });
        }
      );
    }
  };

  proceedToPayment = () => {
    const { navigation } = this.props;

    navigation.navigate('Payment');
  };

  updateSsaEvent = (cb, options = {}) => {
    const { navigation } = this.props;
    const eventId = navigation.getParam('id') || options.Id;

    console.log('eventId updateSsaEvent', eventId);

    if (eventId) {
      const params = this.getCreateSsaParams();
      params.Id = eventId;

      console.log('DATA updateSsaEvent', { ...params, ...options });

      this.setState(
        {
          isUpdateRun: true,
        },
        () => {
          axiosInstance({
            method: 'PUT',
            url: apiUrls.putUpdateSsa,
            data: { ...params, ...options },
          })
            .then(() => {
              this.setState(
                {
                  isUpdateRun: false,
                },
                () => {
                  cb();
                }
              );
            })
            .catch(err => {
              console.log(err);

              this.setState({
                isUpdateRun: false,
              });
            });
        }
      );
    }
  };

  getCreateSsaParams = () => {
    const {
      sportCategoryId,
      venueId,
      facilityId,
      numberOfParticipants,
      playerLevel,
      activityType,
      date,
      startTime,
      endTime,
      payment,
      packageId,
      subFacilityId,
      timeSlotId,
      title,
      desc,
    } = this.props;

    // console.log('timeSlotId', timeSlotId)
    // console.log('activityType', activityType)
    // console.log('playerLevel', playerLevel)
    // console.log('************************ subFacilityId', subFacilityId)
    // console.log('payment', payment)
    // console.log('paymentOptions()[payment]', paymentOptions()[payment])

    const params = {
      Title: title,
      Description: desc,
      NumberOfParticipants: +numberOfParticipants,
      PlayerLevel: +playerLevel,
      Payment: +payment,
      ActivityType: +activityType,
      SportCategoryId: +sportCategoryId,
      VenueId: +venueId,
      StartDateTime: formatISODate(date, startTime),
      EndDateTime: formatISODate(date, endTime),
      PackageId: +packageId,
      FacilityId: +facilityId,
      ActivityDate: formatISODate(date, startTime),
      SubfacilityId: +subFacilityId,
      TimeSlotId: +timeSlotId,
      BookedPackageId: null,
    };

    return params;
  };

  getValidatedFields = () => {
    const {
      sportCategoryId,
      venueId,
      date,
      startTime,
      endTime,
      numberOfParticipants,
      packageId,
      timeSlotId,
      subFacilityId,
      title,
      desc,
    } = this.props;

    const { selectedPaymentMethodIndex } = this.state;

    const validatedFields = {
      title: !title,
      desc: !desc,
      sportsCategory: !sportCategoryId,
      numberOfParticipants: numberOfParticipants <= 0,
      venue: !venueId,
      date: !date,
      // time: !startTime || endTime == undefined || timeSlotId < 0,
      time: !startTime || timeSlotId < 0,
      package: !packageId,
      paymentMethod: selectedPaymentMethodIndex < 0,
      subFacility: subFacilityId < 0,
    };

    validatedFields.hasErrors = Object.values(validatedFields).some(field => field);

    return validatedFields;
  };

  validateOnSubmit = () => {
    this.setState({
      isPristine: false,
    });

    return this.getValidatedFields();
  };

  toggleTimeModal = time => {
    const { updateStore } = this.props;
    const { startTime, endTime, timeSlotId } = time || {};

    this.setState(
      prevState => ({
        modalIsVisible: !prevState.modalIsVisible,
      }),
      startTime && endTime !== undefined && timeSlotId >= 0
        ? () => updateStore({ startTime, endTime, timeSlotId })
        : () => false
    );
  };

  getVenueName = () => {
    const { packages } = this.state;
    const { venueId, facilityId } = this.props;

    if (!venueId || !facilityId) {
      return '';
    }

    const foundPackage = packages.find(
      item => item.VenueId === +venueId && item.FacilityId === +facilityId
    );

    // console.log('foundPackage facilityId', foundPackage)

    return foundPackage ? [foundPackage.VenueTitle, foundPackage.FacilityTitle].join(' - ') : '';
  };

  getPackageName = () => {
    const { packages } = this.state;
    const { packageId } = this.props;

    if (!packageId) {
      return '';
    }

    const foundPackage = packages.find(item => item.OfferId === +packageId);

    // console.log('foundPackage packageId', foundPackage)

    return foundPackage ? foundPackage.OfferTitle : '';
  };

  getScreenConfig = () => {
    const { screenMode } = this.state;
    const { navigation } = this.props;

    switch (screenMode) {
      case ssaMainScreenModes.edit: {
        return new ScreenConfig(i18n.t('socialSportsActivity.edit_event'), 'Save', () =>
          this.updateSsaEvent(navigation.goBack)
        );
      }
      case ssaMainScreenModes.clone: {
        return new ScreenConfig(
          i18n.t('socialSportsActivity.clone_event'),
          'Create',
          this.submitCreateSsaForm
        );
      }
      default:
        return new ScreenConfig(
          i18n.t('socialSportsActivity.create_event'),
          'Create',
          this.submitCreateSsaForm
        );
    }
  };

  togglePaymentMethods = () => {
    this.setState(prevState => ({
      isPaymentMethodsShown: !prevState.isPaymentMethodsShown,
    }));
  };

  changePaymentMethod = index => {
    this.setState({
      selectedPaymentMethodIndex: index,
      isPaymentMethodsShown: false,
    });
  };

  getSubFacilities = () => {
    const { date, timeSlotId } = this.props;
    const { availableDates } = this.state;

    if (timeSlotId < 0) {
      return [];
    }

    // console.log('availableDates', Object.keys(availableDates).length > 0);
    // const timeSlot = availableDates[date].find(item => item.Id === timeSlotId);
    const timeSlot =
      availableDates && Object.keys(availableDates).length > 0 && availableDates[date]
        ? availableDates[date].find(item => item.Id === timeSlotId)
        : false;

    if (timeSlot) {
      return timeSlot.SubFacilities || [];
    }

    return [];
  };

  getSubFacilityValue = () => {
    const { subFacilityId } = this.props;

    if (subFacilityId < 0) {
      return '';
    }

    const subFacilities = this.getSubFacilities();

    // console.log(subFacilities)

    if (subFacilities && subFacilities.length) {
      let subId = subFacilities.find(item => item.Id === subFacilityId);
      return subId && subId.Title ? subId.Title : '';
    }

    return '';
  };

  playersPriceDesc() {
    const { numberOfParticipants, packagePrice } = this.props;

    const playersPrice =
      Math.round(
        (packagePrice / (numberOfParticipants ? numberOfParticipants : 1) + Number.EPSILON) * 100
      ) / 100;
    const playersPriceDesc =
      playersPrice && numberOfParticipants
        ? i18n.t('socialSportsActivity.players_pay_desc').replace('{price}', playersPrice)
        : false;

    return playersPriceDesc ? (
      <Text
        style={{
          marginTop: 4,
          marginBottom: 16,
          fontFamily: fontFamily.gothamRegular,
          fontSize: fontSize.small,
          color: colors.themeColor,
          lineHeight: fontSize.small * 1.6,
          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
        }}
      >
        {i18n.t('socialSportsActivity.players_pay_desc').replace('{price}', playersPrice)}
      </Text>
    ) : null;
  }

  hostPriceDesc() {
    const { packagePrice } = this.props;

    const hostPrice = Math.round((packagePrice + Number.EPSILON) * 100) / 100;
    const hostPriceDesc = hostPrice
      ? i18n.t('socialSportsActivity.host_pays_desc').replace('{price}', hostPrice)
      : false;

    return hostPriceDesc ? (
      <Text
        style={{
          marginTop: 4,
          marginBottom: 16,
          fontFamily: fontFamily.gothamRegular,
          fontSize: fontSize.small,
          color: colors.themeColor,
          lineHeight: fontSize.small * 1.6,
          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
        }}
      >
        {i18n.t('socialSportsActivity.host_pays_desc').replace('{price}', hostPrice)}
      </Text>
    ) : null;
  }

  render() {
    const {
      navigation,
      sportCategoryId,
      numberOfParticipants,
      playerLevel,
      date,
      startTime,
      endTime,
      payment,
      venueId,
      facilityId,
      packageId,
      packagePrice,
      activityType,
      subFacilityId,
      timeSlotId,
      title,
      desc,
      updateStore,
    } = this.props;

    // console.log('playerLevel', playerLevel)
    // console.log('payment', payment)
    // console.log('paymentOptions()[payment]', paymentOptions()[payment])
    // console.log('activityType', activityType)
    // console.log('playerLevel', playerLevel)
    // console.log('************************ subFacilityId', subFacilityId)
    // console.log('payment', payment)
    // console.log('paymentOptions()[payment]', paymentOptions()[payment])
    // console.log('navigation', navigation);

    // console.log('title', title);
    // console.log('desc', desc);

    // console.log('venueId', venueId);
    // console.log('facilityId', facilityId);
    // console.log('packageId', packageId);
    // console.log( 'packagePrice: ', packagePrice )
    // console.log( 'numberOfParticipants: ', numberOfParticipants )

    const {
      isUpdateRun,
      sportCategories,
      venues,
      modalIsVisible,
      availableDates,
      packages,
      screenMode,
      isLoading,
      isPristine,
    } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    // console.log('Object.keys availableDates', Object.keys(availableDates));
    // console.log('availableDates', availableDates );

    const filteredPackages = venueId
      ? packages.filter(item => item.VenueId === +venueId && item.FacilityId === +facilityId)
      : [];

    // console.log('state', this.state );
    // console.log('props', this.props );
    // console.log('filteredPackages', filteredPackages );

    const availableTimeslots = availableDates[date] || [];

    const isEditMode = screenMode === ssaMainScreenModes.edit;

    const screenConfig = this.getScreenConfig();

    const errors = isEditMode ? {} : this.getValidatedFields();

    const subFacilitiesData = this.getSubFacilities();

    let timeValue = '';
    timeValue += startTime ? `${startTime}` : '';
    timeValue += startTime && endTime ? ` - ${endTime}` : '';

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionWrapper}>
          <View style={styles.titleDesc}>
            <View
              style={{
                ...styles.inputBox,
                ...(!isPristine && errors.title && { borderColor: colors.errorMain }),
              }}
            >
              <TextInput
                placeholder={i18n.t('socialSportsActivity.title')}
                // placeholderTextColor="#8C9091"
                placeholderTextColor="#000000"
                returnKeyType="go"
                style={{
                  ...styles.inputValue,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                }}
                onChange={e => {
                  updateStore({
                    title: e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : '',
                  });
                }}
                value={title}
              />
            </View>
            {!isPristine && errors.title && (
              <ErrorMessage errorMessage={i18n.t('generic.errors.field_is_required')} />
            )}
            <View
              style={{
                ...styles.inputBox,
                ...(!isPristine && errors.desc && { borderColor: colors.errorMain }),
              }}
            >
              <TextInput
                placeholder={i18n.t('socialSportsActivity.desc')}
                // placeholderTextColor="#8C9091"
                placeholderTextColor="#000000"
                returnKeyType="go"
                style={{
                  ...styles.inputValue,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                }}
                onChange={e => {
                  updateStore({
                    desc: e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : '',
                  });
                }}
                value={desc}
              />
            </View>
            {!isPristine && errors.desc && (
              <ErrorMessage errorMessage={i18n.t('generic.errors.field_is_required')} />
            )}
          </View>

          <SsaSectionTitle text={i18n.t('socialSportsActivity.category_of_sports')} />
          <View>
            <SsaOption
              label={i18n.t('socialSportsActivity.sports')}
              value={getValueById(sportCategories, +sportCategoryId, 'NameInPrimaryLang')}
              onPress={() => navigation.navigate('CreateSsaSports', { sportCategories })}
              iconName="medal"
              error={!isPristine && errors.sportsCategory}
              errorMessage={i18n.t('generic.errors.field_is_required')}
              isDisabled={isEditMode}
            />
            <SsaOption
              label={i18n.t('socialSportsActivity.players_number')}
              value={numberOfParticipants ? numberOfParticipants.toString() : ''}
              onPress={() => navigation.navigate('CreateSsaParticipantsNumber')}
              iconName="group"
              error={!isPristine && errors.numberOfParticipants}
              errorMessage={i18n.t('generic.errors.field_is_required')}
              isDisabled={isEditMode}
            />
            <SsaOption
              label={i18n.t('socialSportsActivity.player_level')}
              value={playerLevels()[playerLevel]}
              onPress={() => navigation.navigate('CreateSsaPlayerLevel')}
              iconName="level-up"
              isDisabled={isEditMode}
            />
          </View>
        </View>
        <View style={styles.sectionWrapper}>
          <SsaSectionTitle text={i18n.t('socialSportsActivity.event_information')} />
          <View>
            <SsaOption
              label={i18n.t('socialSportsActivity.venue')}
              value={this.getVenueName()}
              onPress={() => navigation.navigate('CreateSsaVenue', { venues })}
              iconName="map-marker"
              error={!isPristine && errors.venue}
              errorMessage={i18n.t('generic.errors.field_is_required')}
              isDisabled={isEditMode || !sportCategoryId || !packages.length}
            />
            <SsaOption
              label={i18n.t('socialSportsActivity.facility_rental')}
              value={this.getPackageName()}
              onPress={() =>
                navigation.navigate('CreateSsaPackages', { packages: filteredPackages })
              }
              iconName="ticket"
              error={!isPristine && errors.package}
              errorMessage={i18n.t('generic.errors.field_is_required')}
              isDisabled={isEditMode || !venueId}
            />
            <SsaOption
              label={i18n.t('socialSportsActivity.date')}
              value={moment(date).isValid() ? getLocaleDate(date) : ''}
              onPress={() =>
                navigation.navigate('CreateSsaDate', { dates: Object.keys(availableDates) })
              }
              iconName="calendar"
              error={!isPristine && errors.date}
              errorMessage={i18n.t('generic.errors.field_is_required')}
              isDisabled={isEditMode || !packageId || Object.keys(availableDates).length == 0}
            />
            <SsaOption
              label={i18n.t('socialSportsActivity.time')}
              value={timeValue}
              onPress={this.toggleTimeModal}
              iconName="clock-o"
              error={!isPristine && errors.time}
              errorMessage={i18n.t('generic.errors.field_is_required')}
              isDisabled={isEditMode || !date}
            />
            <SsaOption
              label={i18n.t('socialSportsActivity.subfacility')}
              value={this.getSubFacilityValue()}
              onPress={() =>
                navigation.navigate('SubFacilitiesScreen', { data: subFacilitiesData })
              }
              iconName="star"
              error={!isPristine && errors.subFacility}
              errorMessage={i18n.t('generic.errors.field_is_required')}
              isDisabled={isEditMode || timeSlotId < 0 || !subFacilitiesData.length}
            />
            <ModalComponent visible={modalIsVisible} closeModal={this.toggleTimeModal}>
              <TimeScreen timeslots={availableTimeslots} closeModal={this.toggleTimeModal} />
            </ModalComponent>
          </View>
        </View>
        <View style={styles.sectionWrapper}>
          <SsaSectionTitle text={i18n.t('socialSportsActivity.terms')} />
          <Terms isDisabled={isEditMode} />
          {payment ? this.playersPriceDesc() : this.hostPriceDesc()}
          {/*
          <View>
            <SsaOption
              label={i18n.t('socialSportsActivity.payment')}
              value={paymentOptions()[payment]}
              onPress={() => navigation.navigate('CreateSsaPayment')}
              iconName="money-bill-wave"
              isDisabled
            />
          </View>
          */}
        </View>
        <View style={styles.sectionWrapper}>
          <SsaSectionTitle text={i18n.t('socialSportsActivity.activity_type')} />
          <ActivityType isDisabled={isEditMode} />
        </View>
        <ConfirmButtons
          disabled={(!isPristine && errors.hasErrors) || isUpdateRun}
          containerStyle={styles.buttonsContainer}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          confirmLabel={i18n.t('generic.buttons.create')}
          cancelLabel={i18n.t('generic.buttons.cancel')}
          handleSave={screenConfig.applyAction}
          closeOnApply={false}
        />
      </ScrollView>
    );
  }
}

SsaMainScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
  sportCategoryId: PropTypes.string.isRequired,
  venueId: PropTypes.string.isRequired,
  packageId: PropTypes.string.isRequired,
  packagePrice: PropTypes.number.isRequired,
  facilityId: PropTypes.string.isRequired,
  numberOfParticipants: PropTypes.number.isRequired,
  playerLevel: PropTypes.number.isRequired,
  payment: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  activityType: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string,
  updateStore: PropTypes.func.isRequired,
  clearOptions: PropTypes.func.isRequired,
  timeSlotId: PropTypes.number.isRequired,
  subFacilityId: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  sportCategoryId: state.socialSportActivity.sportCategoryId,
  venueId: state.socialSportActivity.venueId,
  packageId: state.socialSportActivity.packageId,
  packagePrice: state.socialSportActivity.packagePrice,
  facilityId: state.socialSportActivity.facilityId,
  numberOfParticipants: state.socialSportActivity.numberOfParticipants,
  playerLevel: state.socialSportActivity.playerLevel,
  payment: state.socialSportActivity.payment,
  title: state.socialSportActivity.title,
  desc: state.socialSportActivity.desc,
  activityType: state.socialSportActivity.activityType,
  date: state.socialSportActivity.date,
  startTime: state.socialSportActivity.startTime,
  endTime: state.socialSportActivity.endTime,
  isActive: state.socialSportActivity.isActive,
  timeSlotId: state.socialSportActivity.timeSlotId,
  subFacilityId: state.socialSportActivity.subFacilityId,
});

export default connect(mapStateToProps, {
  clearOptions: clearForm,
  updateStore: setData,
  getCart: getCart,
})(SsaMainScreen);
