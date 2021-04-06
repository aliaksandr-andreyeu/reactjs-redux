import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StatusBar,
  FlatList,
  ImageBackground
} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'

import Moment from 'moment'

import FullWidthImage from 'react-native-fullwidth-image'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

import { LinearGradient } from 'expo-linear-gradient'
import DeviceInfo from 'react-native-device-info'
import SkewedContainer from '../components/SkewedContainer'
import SwipeGesture from '../components/SwipeGesture'

import i18n from '../../i18n'

import env from '../config'

import { NavHeaderUser } from '../components/NavHeaderUser'

const FontBreeBold = Platform.OS === 'ios' ? 'bree-bold' : 'BreeBold'
const FontBreeRegular = Platform.OS === 'ios' ? 'bree-regular' : 'BreeRegular'

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state

    return {
      // title: params ? params.otherParam : 'A Nested Details Screen',
      headerRight: <NavHeaderUser {...navigation} />
    }
  }

  state = {
    isTopSliderLoaded: false,
    isSwiped: false,
    dslides: [],
    searchText: '',
    user: {},
    EventCategories: [],
    EventCategoriesOriginal: [],
    homeItems: {
      isLoading: true,
      Features: [{ Id: 0 }, { Id: 1 }, { Id: 2 }, { Id: 3 }, { Id: 4 }, { Id: 5 }],
      UpcomingEvents: [{ Id: 0 }, { Id: 1 }, { Id: 2 }, { Id: 3 }, { Id: 4 }, { Id: 5 }],
      RecommendedEvents: [{ Id: 0 }, { Id: 1 }, { Id: 2 }, { Id: 3 }, { Id: 4 }, { Id: 5 }],
      SliderEvents: [],
      DynamicSlides: [{ Id: 0 }, { Id: 1 }, { Id: 2 }]
    },
    topSliderIndex: 0
  }

  onSwipePerformed = action => {
    switch (action) {
      case 'left': {
        this._scrollSlider('left')
        break
      }
      case 'right': {
        this._scrollSlider('right')
        break
      }
      case 'down': {
        this.props.navigation.push(`${this.state.homeItems.DynamicSlides[this.state.topSliderIndex].LinkEnity}Detail`, {
          id: this.state.homeItems.DynamicSlides[this.state.topSliderIndex].LinkEnityId,
          object: this.state.homeItems.DynamicSlides[this.state.topSliderIndex]
        })
        break
      }
    }
  }

  _scrollSlider(direction) {
    const slideIndex = this.state.topSliderIndex
    let newIndex = ''

    if (direction == 'right' && this.state.homeItems.DynamicSlides[slideIndex + 1]) {
      newIndex = slideIndex + 1
    }
    if (direction == 'right' && !this.state.homeItems.DynamicSlides[slideIndex + 1]) {
      newIndex = 0
    }

    if (direction == 'left' && this.state.homeItems.DynamicSlides[slideIndex - 1]) {
      newIndex = slideIndex - 1
    }
    if (direction == 'left' && !this.state.homeItems.DynamicSlides[slideIndex - 1]) {
      newIndex = this.state.homeItems.DynamicSlides.length - 1
    }

    this.setState(
      {
        isTopSliderLoaded: true,
        isSwiped: true
      },
      () => {
        this.setState({
          topSliderIndex: newIndex
        })
      }
    )
  }

  async componentDidMount() {
    const storedValue = await AsyncStorage.getItem('app:user')

    if (storedValue) {
      this.setState({
        user: JSON.parse(storedValue)
      })
    }
  }

  async componentWillMount() {
    this._getHomeItems()

    // this._getCache();
  }

  _getCache() {
    AsyncStorage.getItem('app:home').then(value => {
      if (value) {
        this.setState({
          homeItems: JSON.parse(value)
        })
      } else {
        this._getCache()
      }
    })
  }

  _getHomeItems = () => {
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
    if (this.state.user.token && this.state.user.token.length > 4) {
      headers['auth-token'] = this.state.user.token
    }

    fetch(`${env.api}api/home`, {
      method: 'GET',
      headers
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.EventCategories) {
          responseJson.isLoading = false

          if (responseJson.DynamicSlides.length > 10) {
            responseJson.DynamicSlides = responseJson.DynamicSlides.slice(0, 10)
          }
          if (responseJson.SliderEvents.length > 25) {
            responseJson.SliderEvents = responseJson.SliderEvents.slice(0, 25)
          }
          if (responseJson.RecommendedEvents.length > 25) {
            responseJson.RecommendedEvents = responseJson.RecommendedEvents.slice(0, 25)
          }
          if (responseJson.UpcomingEvents.length > 25) {
            responseJson.UpcomingEvents = responseJson.UpcomingEvents.slice(0, 25)
          }
          if (responseJson.Features.length > 25) {
            responseJson.Features = responseJson.Features.slice(0, 25)
          }
          if (responseJson.EventCategories.length > 6) {
            responseJson.EventCategoriesOriginal = responseJson.EventCategories
            responseJson.EventCategories = responseJson.EventCategories.slice(0, 6)
          }

          const dslides = []

          for (let i = 0; i < responseJson.DynamicSlides.length; i++) {
            responseJson.DynamicSlides[i].ImageSquareThumbURL = responseJson.DynamicSlides[
              i
            ].ImageSquareThumbURL.replace('q_auto:eco', 'q_auto:low')
            dslides.push(responseJson.DynamicSlides[i].ImageSquareThumbURL)
          }

          this.setState({
            dslides,
            homeItems: responseJson,
            EventCategories: responseJson.EventCategories,
            EventCategoriesOriginal: responseJson.EventCategoriesOriginal
          })
        }
      })
  }

  _renderItemCategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate('CategoryDetail', {
          id: item.NameInPrimaryLang,
          object: item
        })
      }}
    >
      <View
        style={{
          width: 200,
          height: 90,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <FullWidthImage
          source={{ uri: item.ImageLandscapeURL }}
          style={{ borderWidth: 1, borderRadius: 30, borderColor: '#ffffff' }}
        />
        <Text style={styles.itemCategoryName}>{item.NameInPrimaryLang}</Text>
      </View>
    </TouchableOpacity>
  )

  _listDividerCategory = () => <View style={styles.dividerContainer} />

  _renderItemRecommended = ({ item, index }) => {
    let title = item.Title
    if (item.TitleInPrimaryLang && item.TitleInPrimaryLang.length > 0) {
      title = item.TitleInPrimaryLang
    }

    let entityType = 'EventDetail'
    if (item.TitleInPrimaryLang && item.TitleInPrimaryLang.length > 0) {
      entityType = 'FeatureDetail'
    }
    if (item.EntityName) {
      entityType = `${item.EntityName}Detail`
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate(entityType, { id: item.Id, object: item })
        }}
        style={{}}
      >
        <View style={index == 0 ? styles.boxShadowNoLeftMargin : styles.boxShadow} elevation={5}>
          <LinearGradient
            colors={['#6b6b6b', '#ffffff']}
            style={{ flex: 1 }}
            start={[0, 1]}
            end={[0, 0]}
            style={{ flex: 1, zIndex: 1 }}
          >
            <Image
              source={{ uri: item.ImageLandscapeThumbURL }}
              style={{ width: 257, height: 127, zIndex: 3 }}
              resizeMode="cover"
            />

            <View style={{ height: 53, zIndex: 3, backgroundColor: '#ffffff' }}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemRecommendTitle}>
                {title}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  maxWidth: 245,
                  marginTop: 7,
                  marginLeft: 11,
                  color: '#6D6E71',
                  fontSize: 11,
                  fontFamily: FontBreeRegular
                }}
              >
                {item.Excerpt}
              </Text>
            </View>

            {item.EventDateTime && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 3
                }}
              >
                <Image source={require('../assets/images/date-bg.png')} />
                <Text
                  style={{
                    marginLeft: 8,
                    marginTop: 5,
                    color: '#6D6E71',
                    fontSize: 12,
                    fontFamily: FontBreeBold,
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                >
                  {Moment(item.EventDateTime).format('D[\n]MMM[\n]YYYY')}
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>
      </TouchableOpacity>
    )
  }

  _listDividerRecommended = () => <View style={styles.dividerContainerRecommended} />

  _renderItem = ({ item, index }) => {
    item.illustration = item.ImageSquareThumbURL
    item.title = item.Title

    even = (index + 1) % 2 === 0

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={stylesSliderEntry.slideInnerContainer}
        onPress={() => {
          this.props.navigation.navigate(`${item.LinkEnity}Detail`, {
            id: item.LinkEnityId,
            object: item
          })
        }}
      >
        <View style={stylesSliderEntry.shadow} />
        <View style={[stylesSliderEntry.imageContainer, even ? stylesSliderEntry.imageContainerEven : {}]}>
          <Image source={{ uri: item.ImageSquareThumbURL }} style={stylesSliderEntry.image} />
          <View style={[stylesSliderEntry.radiusMask, even ? stylesSliderEntry.radiusMaskEven : {}]} />
        </View>
        <Text numberOfLines={3} ellipsizeMode="tail" style={styles.renderItemTitle}>
          {item.Title}
        </Text>

        {Platform.OS === 'ios' && (
          <View style={{ position: 'absolute', left: 0, top: 0 }}>
            <Image source={require('../assets/images/date-bg.png')} />
            <Text
              style={{
                marginLeft: 8,
                marginTop: 6,
                color: '#6D6E71',
                fontSize: 12,
                fontFamily: FontBreeBold,
                position: 'absolute',
                top: 0,
                left: 10
              }}
            >
              {Moment(item.EventDateTime).format('D[\n]MMM[\n]YYYY')}
            </Text>
          </View>
        )}
        {Platform.OS === 'android' && (
          <View
            style={{
              position: 'absolute',
              right: 8,
              top: 0,
              marginTop: -1
            }}
          >
            <Image
              source={require('../assets/images/date-bg.png')}
              style={{ transform: [{ rotate: '180deg' }], marginRight: -1 }}
            />
            <Text
              style={{
                marginRight: 8,
                marginTop: 6,
                color: '#6D6E71',
                fontSize: 12,
                fontFamily: FontBreeBold,
                position: 'absolute',
                top: 0,
                right: 0
              }}
            >
              {Moment(item.EventDateTime).format('D[\n]MMM[\n]YYYY')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  render() {
    Moment.locale('en')

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" noShadow />

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View
            style={{
              backgroundColor: '#2f5e84',
              paddingTop: 0,
              marginTop: 0,
              paddingBottom: 10,
              elevation: 0
            }}
          >
            <View
              style={{
                marginLeft: 15,
                marginRight: 15,
                flex: 1,
                paddingBottom: 0,
                paddingTop: 0,
                marginTop: 0
              }}
            >
              <View style={{ marginTop: 5, flex: 1 }}>
                <TextInput
                  placeholder={i18n.t('home.search')}
                  style={styles.searchInput}
                  onChangeText={text => this.setState({ searchText: text })}
                  onSubmitEditing={() => {
                    this.props.navigation.navigate('Search', {
                      searchText: this.state.searchText
                    })
                  }}
                />
              </View>
            </View>
          </View>

          {this.state.homeItems.DynamicSlides && this.state.homeItems.DynamicSlides.length > 0 && (
            <SwipeGesture gestureStyle={styles.swipesGestureContainer} onSwipePerformed={this.onSwipePerformed}>
              <View>
                <ImageBackground
                  source={require('../assets/images/event-slider.png')}
                  imageStyle={[this.state.isTopSliderLoaded ? styles.background_slide : styles.background_slide_empty]}
                  style={[DeviceInfo.isTablet() ? styles.tablet_slide : styles.phone_slide]}
                >
                  <View style={{ flex: 1, marginBottom: 10, minHeight: 310 }}>
                    {this.state.dslides[this.state.topSliderIndex] &&
                      this.state.dslides[this.state.topSliderIndex].length > 0 && (
                        <Image
                          onLoadEnd={() =>
                            this.setState({
                              isTopSliderLoaded: true
                            })
                          }
                          source={{
                            uri: this.state.dslides[this.state.topSliderIndex]
                          }}
                          style={[DeviceInfo.isTablet() ? styles.tablet_slide : styles.phone_slide]}
                        />
                      )}

                    <View
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        zIndex: 4
                      }}
                    >
                      <Image source={require('../assets/images/date-bg.png')} />
                      <Text
                        style={{
                          marginLeft: 8,
                          marginTop: 5,
                          color: '#6D6E71',
                          fontSize: 12,
                          fontFamily: FontBreeBold,
                          position: 'absolute',
                          top: 0,
                          left: 0
                        }}
                      >
                        {Moment(this.state.homeItems.DynamicSlides[this.state.topSliderIndex].EventDateTime).format(
                          'D[\n]MMM[\n]YYYY'
                        )}
                      </Text>
                    </View>

                    <View
                      style={{
                        position: 'absolute',
                        bottom: 1,
                        width: '100%',
                        zIndex: 4
                      }}
                    >
                      <View
                        style={{
                          alignSelf: 'flex-start',
                          marginLeft: 25,
                          borderRadius: 60,
                          borderColor: '#ffffff',
                          borderWidth: 1,
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <Text
                          style={{
                            marginTop: 0,
                            color: '#2F8C83',
                            fontSize: 15,
                            fontFamily: FontBreeBold,
                            padding: 12,
                            paddingTop: 3,
                            paddingBottom: 3
                          }}
                        >
                          {this.state.homeItems.DynamicSlides[this.state.topSliderIndex].LinkEnity}
                        </Text>
                      </View>

                      <Text
                        numberOfLines={2}
                        adjustsFontSizeToFit
                        style={{
                          marginLeft: 25,
                          fontFamily: FontBreeBold,
                          fontSize: 25,
                          color: '#ffffff',
                          paddingBottom: 6,
                          paddingTop: 5,
                          zIndex: 4
                        }}
                      >
                        {this.state.homeItems.DynamicSlides[this.state.topSliderIndex].Title}
                      </Text>

                      <View
                        style={{
                          marginTop: 0,
                          marginLeft: 25,
                          flex: 1,
                          flexDirection: 'row',
                          zIndex: 4
                        }}
                      >
                        <EvilIcons name="location" size={18} color="#ffffff" style={{ marginTop: 3 }} />
                        <View style={{ flex: 1 }}>
                          <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={{
                              fontFamily: FontBreeBold,
                              fontSize: 14,
                              color: '#ffffff',
                              marginLeft: 3
                            }}
                          >
                            {this.state.homeItems.DynamicSlides[this.state.topSliderIndex].Venue}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: 6,
                          marginBottom: 15,
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {this.state.homeItems.DynamicSlides.map((slide, i) => (
                          <FontAwesome
                            key={slide.Id}
                            name="circle"
                            size={12}
                            color={i == this.state.topSliderIndex ? '#ffffff' : '#aeadab'}
                            style={{ marginRight: 10 }}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </SwipeGesture>
          )}
          <SkewedContainer leftSkewType="full" rightSkewType="full" backgroundColor="red" width={20}>
            <View style={{ flex: 1, height: 150, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ alignItems: 'center', justifyContent: 'center' }}> Awesome textAwesome </Text>
            </View>
          </SkewedContainer>

          <View
            style={{
              marginLeft: 15,
              marginRight: 0,
              flex: 1,
              paddingBottom: 0
            }}
          >
            <Text
              style={{
                marginTop: 0,
                marginBottom: 5,
                color: '#707070',
                fontSize: 18,
                fontFamily: FontBreeBold
              }}
            >
              {i18n.t('home.recommended_for_you')}
            </Text>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.homeItems.RecommendedEvents}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this._listDividerRecommended}
              renderItem={(item, index) => this._renderItemRecommended(item, index)}
            />

            <Text
              style={{
                marginTop: 22,
                marginBottom: 5,
                color: '#707070',
                fontSize: 18,
                fontFamily: FontBreeBold
              }}
            >
              {i18n.t('home.upcoming_events')}
            </Text>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.homeItems.UpcomingEvents}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this._listDividerRecommended}
              renderItem={(item, index) => this._renderItemRecommended(item, index)}
            />

            <Text
              style={{
                marginTop: 22,
                marginBottom: 5,
                color: '#707070',
                fontSize: 18,
                fontFamily: FontBreeBold
              }}
            >
              {i18n.t('home.features_news')}
            </Text>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.homeItems.Features}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this._listDividerRecommended}
              renderItem={(item, index) => this._renderItemRecommended(item, index)}
            />

            {/*
            <Text style={{marginTop: 22, marginBottom: 8, color: '#707070', fontSize: 18, fontFamily: FontBreeBold,}}>{i18n.t('home.sports_category')}</Text>
            */}

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.EventCategories}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this._listDividerCategory}
              renderItem={this._renderItemCategory}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (this.state.isCategoryFullyLoaded) {
                  return
                }
                this.setState({
                  EventCategories: this.state.homeItems.EventCategoriesOriginal
                })
              }}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  background_slide: {
    opacity: 0
  },
  boxShadow: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    marginLeft: 7,
    marginRight: 3,
    marginTop: 5,
    minHeight: 140,
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 6
  },
  boxShadowNoLeftMargin: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    marginLeft: 0,
    marginRight: 3,
    marginTop: 5,
    minHeight: 140,
    paddingLeft: 0,
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 6
  },
  container: {
    backgroundColor: '#fff',
    elevation: 0,
    flex: 1
  },
  contentContainer: {
    paddingTop: 0
  },
  dividerContainer: {
    height: 1,
    width: 15
  },
  dividerContainerRecommended: {
    height: 1,
    width: 0
  },
  eventItem: {
    alignSelf: 'stretch',
    backgroundColor: '#c1c1c1',
    height: 40,
    marginTop: 3,
    padding: 10,
    textAlign: 'center'
  },
  hidden_slide: {
    opacity: 0
  },
  input: {
    alignSelf: 'stretch',
    borderColor: '#7a42f4',
    borderWidth: 1,
    height: 40,
    margin: 15,
    textAlign: 'center'
  },
  itemCategoryName: {
    color: '#FFFFFF',
    fontFamily: FontBreeBold,
    fontSize: 18,
    position: 'absolute'
  },
  itemRecommendTitle: {
    color: '#6D6E71',
    fontFamily: FontBreeBold,
    fontSize: 12,
    marginLeft: 11,
    marginTop: 11,
    maxWidth: 245
  },
  phone_slide: {
    flex: 1,
    height: undefined,
    width: undefined,
    zIndex: 3
  },
  renderItemTitle: {
    bottom: 24,
    color: '#FFFFFF',
    fontFamily: FontBreeBold,
    fontSize: 22,
    left: 30,
    position: 'absolute'
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    color: '#b5b5b5',
    fontFamily: FontBreeRegular,
    fontSize: 15,
    marginBottom: 10,
    padding: Platform.OS === 'ios' ? 7 : 5,
    paddingLeft: 20,
    paddingRight: 20
  },
  sliderAndroid: {
    // marginTop: 15,
    marginTop: 0,
    overflow: 'visible', // for custom animations
    marginRight: -80
  },
  swipesGestureContainer: {
    width: '100%'
  },
  tablet_slide: {
    flex: 1,
    minHeight: 600,
    width: undefined,
    zIndex: 3
  }
})
