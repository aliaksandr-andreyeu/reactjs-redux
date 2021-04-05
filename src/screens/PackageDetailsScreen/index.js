import moment from 'moment';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Image, ScrollView, View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import propTypes from 'prop-types';
import styles from './styles';
import SectionTitle from '../../components/Details/SectionTitle';
import ActionButton from '../../components/Details/ActionButton';
import VenueLine from '../../components/Details/VenueLine';
import Counter from '../../components/UI/Counter';
import * as actions from './actions';
import ModalComponent from '../../components/UI/ModalComponent';
import Loading from '../../components/Loading';
import TimeScreen from '../PackageOptionScreens/TimeScreen';

import HTML from 'react-native-render-html';
import { htmlStyles } from '../../constants/htmlRendering';

import { NavHeaderUser } from '../../components/NavHeaderUser';

import { externalLinks, axiosInstance, apiUrls } from '../../constants/api';
import openExternalLink from '../../helpers/openExternalLink';

import { formatISODate } from '../../helpers/miscHelpers';
import SsaOption from '../SsaMainScreen/components/SsaOption';
import i18n from '../../../i18n';
import Global from '../../components/global';

import isEqual from 'lodash.isequal';

import colors from '../../constants/colors';
import { fontFamily, fontSize } from '../../constants/fonts';

import getLocaleDate from '../../helpers/getLocaleDate';

class PackageDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: i18n.t('activities.title'),
      headerRight: <NavHeaderUser {...navigation} />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      numberOfParticipants: 1,
      modalIsVisible: false,

      availableDates: [],
      activityData: {},
      isLoading: true,

      isPristine: true,
      isBookmarked: false,
      screenWidth: Math.round(Dimensions.get('window').width),
    };
  }

  windowDimensions() {
    this.setState({
      screenWidth: Math.round(Dimensions.get('window').width),
    });
  }

  getActivityData() {
    const { navigation } = this.props;

    const id = navigation.getParam('id') ? navigation.getParam('id') : false;

    // const id = 95;
    // console.log('id', id, typeof id);
    // console.log('Global.isBookmarked package', Global.isBookmarked(id, 'package'));

    if (id !== undefined) {
      this.setState(
        {
          isBookmarked: Global.isBookmarked(id, 'package'),
        },
        () => {
          axiosInstance(
            `${apiUrls.getSsaTimeslotsById(id)}?languageCode=${i18n.locale.toUpperCase()}`
          )
            .then(({ data }) => {
              // console.log(`${apiUrls.getSsaTimeslotsById(id)}?languageCode=${i18n.locale.toUpperCase()}`);
              // console.log(apiUrls.getSsaTimeslotsById(id), data.Days);
              // console.log('data.PackageDetails: ', data.PackageDetails);

              this.setState({
                availableDates: data.Days,
                activityData: data.PackageDetails,
                isLoading: false,
              });

              // console.log('Fetch Activity Data', data.Days );
            })
            .catch(err => console.log(err));
        }
      );
    }
  }

  componentDidMount() {
    Dimensions.addEventListener('change', () => this.windowDimensions());

    const { clearForm } = this.props;

    clearForm();
    this.getActivityData();
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', () => this.windowDimensions());
  }

  componentDidUpdate(prevProps) {
    const { navigation, clearForm } = this.props;

    if (!isEqual(navigation, prevProps.navigation)) {
      clearForm();
      this.getActivityData();
    }
  }

  setNumberOfParticipants = value => {
    const { activityData } = this.state;

    const { MaxParticipants, IsExclusive } = activityData ? activityData : {};

    if (MaxParticipants !== undefined && MaxParticipants >= +value && +value > 0) {
      this.setState({
        numberOfParticipants: IsExclusive ? 1 : +value,
      });
    }
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

    // console.log('timeSlot.SubFacilities', timeSlot.SubFacilities || [])

    return [];
  };

  getSubFacilityValue = defaultTitle => {
    const { subFacilityId } = this.props;

    if (subFacilityId < 0) {
      return defaultTitle;
    }

    const subFacilities = this.getSubFacilities();

    if (subFacilities && subFacilities.length) {
      let subId = subFacilities.find(item => item.Id === subFacilityId);
      return subId && subId.Title ? subId.Title : '';
    }

    return defaultTitle;
  };

  bookPackage = () => {
    if (Boolean(Global.user && Global.user.token && Global.user.token.length > 5)) {
      const { date, startTime, timeSlotId, subFacilityId, navigation } = this.props;
      const { numberOfParticipants } = this.state;

      const packageId = navigation.getParam('id') ? navigation.getParam('id') : false;

      const validatedFields = this.validateOnSubmit();

      if (!validatedFields.hasErrors) {
        const params = {
          PackageId: packageId,
          ActivityDate: formatISODate(date, startTime),
          TimeSlotId: timeSlotId,
          SubFacilityId: subFacilityId,
          ParticipantsNumber: numberOfParticipants,
        };
        axiosInstance
          .post(apiUrls.postBookPackage, params)
          .then(res => {
            navigation.navigate('Cart');
          })
          .catch(err => {
            console.log(err);
          });
      }
    } else {
      Alert.alert(
        i18n.t('alerts.unauth_proceed_checkout'),
        false,
        [
          {
            text: i18n.t('alerts.login'),
            onPress: () => this.props.navigation.navigate('SignIn', {}),
          },
          {
            text: i18n.t('alerts.cancel'),
            style: 'cancel',
          },
        ],
        {
          cancelable: false,
        }
      );
    }
  };

  /*
  changePackage = item => {
    if (item == undefined) return '';

    const { navigation, clearForm } = this.props;
    const allPackages = navigation.getParam('list', []);

    navigation.navigate({
      routeName: 'PackageDetails',
      params: { id: item.Id, item, list: allPackages },
      key: `PackageDetails${Math.random()}`,
    });

    this.setState(
      {
        numberOfParticipants: 0,
        modalIsVisible: false,
        availableDates: [],
        isLoading: true,
      },
      () => clearForm()
    );
  };
  */

  getValidatedFields = () => {
    const { date, startTime, endTime, timeSlotId, subFacilityId } = this.props;

    // const { numberOfParticipants } = this.state;

    const validatedFields = {
      // numberOfParticipants: numberOfParticipants <= 0,
      date: !date,
      // time: !startTime || endTime == undefined || timeSlotId < 0,
      time: !startTime || timeSlotId < 0,
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

  toggleBookmark = () => {
    const { navigation } = this.props;
    const { isBookmarked } = this.state;

    const id = navigation.getParam('id') ? navigation.getParam('id') : false;

    const params = {
      Id: id,
      Entity: 'package',
    };

    // console.log(params);

    if (isBookmarked) {
      axiosInstance.post(apiUrls.postRemoveBookmark, params).then(() => {
        Global.loadFavorites();

        this.setState(() => ({
          isBookmarked: false,
        }));

        Boolean(navigation.state.params.getBookmarks()) && navigation.state.params.getBookmarks();
      });
    } else {
      axiosInstance.post(apiUrls.postAddBookmark, params).then(data => {
        Global.loadFavorites();

        this.setState(() => ({
          isBookmarked: true,
        }));

        Boolean(navigation.state.params.getBookmarks()) && navigation.state.params.getBookmarks();
      });
    }
  };

  getLocation = () => {
    const { activityData } = this.state;

    const url = externalLinks.getGoogleMapsUrl(activityData.GeoLatitude, activityData.GeoLongitude);

    openExternalLink(url);
  };

  render() {
    const { navigation, date, startTime, endTime, timeSlotId } = this.props;

    const {
      numberOfParticipants,
      availableDates,
      activityData,
      modalIsVisible,
      isLoading,
      isPristine,
      screenWidth,
    } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    const {
      ImageUrl,
      Description,
      VenueTitle,
      Title,
      PackagedId,
      Price,
      IsExclusive,
      MaxParticipants,
      IsPricePerPackage,
    } = activityData ? activityData : {};

    const messageToShare = externalLinks.getPackagesUrl(PackagedId);

    const availableTimeslots = availableDates[date] || [];

    const errors = this.getValidatedFields();

    // console.log('AdditionalInfo', Boolean(activityData && activityData.AdditionalInfo));

    let timeValue = '';
    timeValue += startTime ? `${startTime}` : '';
    timeValue += startTime && endTime ? ` - ${endTime}` : '';

    return (
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 24,
        }}
        style={{
          paddingTop: 8,
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: colors.backgroundLightGrey,
        }}
      >
        <View
          style={{
            backgroundColor: colors.backgroundLight,
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              overflow: 'hidden',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              width: '100%',
              height: screenWidth * 0.65,
            }}
          >
            <Image
              source={{ uri: ImageUrl }}
              style={{
                flex: 1,
              }}
              resizeMode="cover"
            />
          </View>
          <View
            style={{
              paddingTop: 16,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <SectionTitle
              text={Title}
              messageToShare={messageToShare}
              isBookmarked={this.state.isBookmarked}
              isActivity={true}
              toggleBookmark={this.toggleBookmark}
            />

            <TouchableOpacity
              style={{
                marginTop: 8,
                marginBottom: 8,
              }}
              onPress={this.getLocation}
            >
              <VenueLine text={VenueTitle} withoutPadding />
            </TouchableOpacity>

            <Text
              style={{
                ...styles.eventDescription,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
              }}
            >
              {Description}
            </Text>

            {Boolean(activityData && activityData.AdditionalInfo) && (
              <View
                style={{
                  marginTop: 6,
                  marginBottom: 0,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.regular,
                    color: colors.headingBasic,
                    fontFamily: fontFamily.gothamMedium,
                    textTransform: 'uppercase',
                    marginBottom: 12,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                  }}
                >
                  {i18n.t('more.additional_info')}
                </Text>
                <View>
                  <HTML
                    html={activityData.AdditionalInfo}
                    renderers={{
                      a: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                        if (htmlAttribs.href) {
                          return (
                            <Text
                              key={Date.now() + '-' + Math.random(htmlAttribs.href.length)}
                              onPress={() => Linking.openURL(htmlAttribs.href)}
                            >
                              {children}
                            </Text>
                          );
                        }
                      },
                    }}
                    baseFontStyle={{
                      textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                    }}
                    tagsStyles={{
                      ...htmlStyles,
                      img: {
                        maxWidth: '100%',
                        marginTop: 4,
                        marginBottom: 4,
                      },
                    }}
                  />
                </View>
              </View>
            )}

            {IsExclusive ? null : (
              <View
                style={{
                  ...styles.sectionContainer,
                  alignItems: i18n.locale.toLowerCase() == 'en' ? 'flex-start' : 'flex-end',
                }}
              >
                <Text style={[styles.sectionTitle]}>{i18n.t('package.participants')}</Text>
                <Counter
                  setCounter={this.setNumberOfParticipants}
                  counterValue={+numberOfParticipants}
                />
                {!isPristine && errors.numberOfParticipants && <Text>The field is required</Text>}
              </View>
            )}

            {/* TODO: move SSAOption to a common component */}
            <SsaOption
              label={i18n.t('package.date')}
              value={moment(date).isValid() ? getLocaleDate(date) : ''}
              onPress={() =>
                navigation.navigate('PackagesDateScreen', { dates: Object.keys(availableDates) })
              }
              iconName="calendar"
              error={!isPristine && errors.date}
              errorMessage={i18n.t('generic.errors.field_is_required')}
            />
            <SsaOption
              label={i18n.t('package.time')}
              value={timeValue}
              onPress={() => {
                !date ? Alert.alert(i18n.t('alerts.select_date_first')) : this.toggleTimeModal();
              }}
              iconName="clock-o"
              error={!isPristine && errors.time}
              errorMessage={i18n.t('generic.errors.field_is_required')}
              isDisabled={!date}
              isDisabledActive={true}
            />
            <SsaOption
              label={i18n.t('package.subfacility')}
              value={this.getSubFacilityValue()}
              onPress={() => {
                timeSlotId < 0
                  ? Alert.alert(i18n.t('alerts.select_time_first'))
                  : navigation.navigate('PackagesSubFacilitiesScreen', {
                      data: this.getSubFacilities(),
                    });
              }}
              iconName="star"
              error={!isPristine && errors.subFacility}
              errorMessage={i18n.t('generic.errors.field_is_required')}
              isDisabled={timeSlotId < 0}
              isDisabledActive={true}
            />

            {Price ? (
              <View
                style={{
                  flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                  justifyContent: 'space-between',
                  // borderWidth: 1,
                  // borderColor: "#ff0000",
                  marginTop: 8,
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.gothamBold,
                    fontSize: 15,
                    color: colors.basicText,
                    // textAlign: i18n.locale.toLowerCase() == 'en' ? 'right' : 'left',
                  }}
                >
                  {i18n.t('activities.total')}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.gothamBold,
                    fontSize: 15,
                    color: colors.basicText,
                    // textAlign: i18n.locale.toLowerCase() == 'en' ? 'right' : 'left',
                  }}
                >
                  AED{' '}
                  {IsPricePerPackage
                    ? Price
                    : Price * (numberOfParticipants > 0 ? numberOfParticipants : 1)}
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  fontFamily: fontFamily.gothamBold,
                  fontSize: 15,
                  color: colors.basicText,
                  marginBottom: 16,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'right' : 'left',
                }}
              >
                FREE
              </Text>
            )}

            <ActionButton
              disabled={!isPristine && errors.hasErrors}
              label={i18n.t('package.add_to_cart')}
              onPress={this.bookPackage}
            />

            {/* <View style={styles.otherSsaSection}>
              <Text style={[styles.sectionTitle]}>More packages nearby</Text>
              <FlatList
                style={styles.slider}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={packageList}
                keyExtractor={item => item.Id.toString()}
                renderItem={({ item }) => (
                  <ListItem item={item} onPress={() => this.changePackage(item)} />
                )}
              />
            </View> */}
            <ModalComponent visible={modalIsVisible} closeModal={this.toggleTimeModal}>
              <TimeScreen timeslots={availableTimeslots} closeModal={this.toggleTimeModal} />
            </ModalComponent>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  date: state.packageDetails.date,
  subFacilityId: state.packageDetails.subFacilityId,
  startTime: state.packageDetails.startTime,
  endTime: state.packageDetails.endTime,
  timeSlotId: state.packageDetails.timeSlotId,
});

PackageDetailsScreen.propTypes = {
  navigation: propTypes.shape({
    getParam: propTypes.func.isRequired,
    navigate: propTypes.func.isRequired,
  }).isRequired,
  //date: propTypes.string.isRequired,
  date: propTypes.string,
  subFacilityId: propTypes.number.isRequired,
  // startTime: propTypes.string.isRequired,
  startTime: propTypes.string,
  // endTime: propTypes.string.isRequired,
  endTime: propTypes.string,
  timeSlotId: propTypes.number.isRequired,
};

export default connect(mapStateToProps, {
  updateStore: actions.setData,
  clearForm: actions.clearForm,
})(PackageDetailsScreen);
