import React, { PureComponent } from 'react';

import {
  Dimensions,
  Alert,
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { apiUrls, axiosInstance } from '../../constants/api';
import ScrollListContainer from '../../components/ScrollListContainer';
import ScrollListItem from '../../components/ScrollListItem';
import Loading from '../../components/Loading';
import Slider from './components/Slider';
import colors from '../../constants/colors';
import EventCategoriesList from './components/EventCategoriesList';

import { NavHeaderUser } from '../../components/NavHeaderUser';
import { NavLang } from '../../components/NavLang';

import styles from './styles';
import { EventType } from '../FilterScreens/EventsFilter/models';
import { sportActivityTypes } from '../../constants/socialSportsActivity';
import i18n from '../../../i18n';
import moment from 'moment';
import isEqual from 'lodash.isequal';

import Global from '../../components/global';

class HomeScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <NavLang {...navigation} />,
      headerRight: <NavHeaderUser {...navigation} />,
      title: 'Home',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      cache: Date.now(),
      recommendedContent: [],
      upcomingEvents: [],
      newsAndFeatures: [],
      slides: [],
      eventCategories: [],
      isLoading: true,
    };
  }

  getHomeItems() {
    axiosInstance(apiUrls.getHome + '?langCode=' + i18n.locale.toUpperCase())
      .then(({ data }) => {
        // console.log('data.EventCategories', data.EventCategories);

        this.setState({
          recommendedContent: data.RecommendedContent,
          upcomingEvents: data.UpcomingEvents,
          newsAndFeatures: data.Features,
          slides: data.DynamicSlides,
          eventCategories: data.EventCategories
            ? data.EventCategories.sort((a, b) => {
                return !a.NameInPrimaryLang || !b.NameInPrimaryLang
                  ? 0
                  : a.NameInPrimaryLang.toLowerCase() < b.NameInPrimaryLang.toLowerCase()
                  ? -1
                  : a.NameInPrimaryLang.toLowerCase() > b.NameInPrimaryLang.toLowerCase()
                  ? 1
                  : 0;
              })
            : [],
          isLoading: false,
        });
      })
      .catch(err => console.log(err));

    if (Global.user.token && Global.user.token.length > 5 && !Global.isFavoritesLoaded) {
      Global.loadFavorites();
    }
  }

  componentDidMount() {
    // IT'S WORKED !!!
    // throw new Error(' ************************************************************* Testing error boundary');

    this.getHomeItems();
  }

  componentDidUpdate(prevProps) {
    const { navigation } = this.props;
    if (!isEqual(navigation, prevProps.navigation)) {
      this.setState(
        {
          cache: Date.now(),
        },
        () => {
          this.getHomeItems();
        }
      );
    }
  }

  onPressBookings(type) {
    const { navigation } = this.props;

    let activityType = [];

    if (type === 1) {
      activityType.push(
        new EventType(sportActivityTypes.TicketedEvents, i18n.t('more.free_spectating_events')).id
      );
    }

    if (type === 2) {
      activityType.push(1);
      activityType.push(8);
      activityType.push(16);
      activityType.push(32);
      activityType.push(64);
    }

    // console.log('activityType', activityType)

    navigation.popToTop();
    navigation.navigate('BookingsList', {
      cache: Date.now(),
      form: {
        activityType: activityType,
        isBookingsHomeForm: true,
      },
    });
  }

  render() {
    const {
      recommendedContent,
      upcomingEvents,
      newsAndFeatures,
      isLoading,
      slides,
      eventCategories,
    } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    // console.log(moment().format('DD MMM'));
    // console.log('slides', slides);

    return (
      <SafeAreaView style={{ backgroundColor: colors.primaryBgColor }}>
        <ScrollView>
          <Slider slides={slides} />
          <EventCategoriesList eventCategories={eventCategories} />
          {upcomingEvents.length > 0 && (
            <ScrollListContainer
              headingLabel={i18n.t('home.upcoming_events').toUpperCase()}
              allLabel={i18n.t('home.see_all')}
              targetScreen="Events"
            >
              <FlatList
                data={upcomingEvents}
                renderItem={({ item, index }) => (
                  <ScrollListItem
                    isUpcomingEvents={true}
                    src={item.ImageSquareThumbURL}
                    description={item.Title}
                    date={item.Date}
                    key={index.toString()}
                    navigationModel={{
                      targetScreen: 'EventDetail',
                      data: { id: item.Id, object: item },
                    }}
                  />
                )}
                keyExtractor={item => `item-${item.Id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </ScrollListContainer>
          )}
          <View
            style={{
              ...styles.bookAndPlaySection,
              marginBottom: 16,
            }}
          >
            <Text style={styles.bookPlaySectionTitle}>{i18n.t('bookingsLanding.title')}</Text>
            <Text style={styles.bookPlaySectionSubtitle}>
              {i18n.t('bookingsLanding.promo_subtitle')}
            </Text>
            <View style={styles.bookAndPlaySectionButtons}>
              <TouchableOpacity
                style={[styles.bookPlaySectionButton, styles.bookPlaySectionButtonLeft]}
                onPress={() => {
                  this.onPressBookings(0);
                }}
              >
                <Text style={[styles.blueText, styles.bookPlaySectionButtonText]}>
                  {i18n.t('bookingsLanding.all')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bookPlaySectionButton, styles.bookPlaySectionButtonCenter]}
                onPress={() => {
                  this.onPressBookings(1);
                }}
              >
                <Text style={[styles.whiteText, styles.bookPlaySectionButtonText]}>
                  {i18n.t('bookingsLanding.events')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bookPlaySectionButton, styles.bookPlaySectionButtonRight]}
                onPress={() => {
                  this.onPressBookings(2);
                }}
              >
                <Text style={[styles.whiteText, styles.bookPlaySectionButtonText]}>
                  {i18n.t('bookingsLanding.venues')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {recommendedContent.length > 0 && (
            <ScrollListContainer headingLabel={i18n.t('home.recommended_for_you').toUpperCase()}>
              <FlatList
                data={recommendedContent}
                renderItem={({ item, index }) => (
                  <ScrollListItem
                    isRecommendedContent={true}
                    src={item.ImageSquareURL}
                    description={item.Title}
                    key={index.toString()}
                    date={item.Date}
                    navigationModel={{
                      targetScreen: `${item.EntityName}Detail`,
                      data: { id: item.Id, object: item },
                    }}
                  />
                )}
                keyExtractor={item => `item-${item.Id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </ScrollListContainer>
          )}
          {newsAndFeatures.length > 0 && (
            <ScrollListContainer
              headingLabel={i18n.t('home.news_&_features').toUpperCase()}
              allLabel={i18n.t('home.see_all')}
              targetScreen="News"
            >
              <FlatList
                data={newsAndFeatures}
                renderItem={({ item, index }) => (
                  <ScrollListItem
                    isNewsFeatures={true}
                    src={item.ImageSquareThumbURL}
                    description={item.TitleInPrimaryLang}
                    key={index.toString()}
                    navigationModel={{
                      targetScreen: `${item.EntityName}Detail`,
                      data: { id: item.Id, object: item },
                    }}
                  />
                )}
                keyExtractor={item => `item-${item.Id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </ScrollListContainer>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default HomeScreen;
