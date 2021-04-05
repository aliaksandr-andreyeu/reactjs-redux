import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  Linking,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Moment from 'moment';

import FullWidthImage from 'react-native-fullwidth-image';

import Ionicons from 'react-native-vector-icons/Ionicons';
import HTML from 'react-native-render-html';
import Tweet from '../../components/Tweet';

import i18n from '../../../i18n';

import { NavHeaderUser } from '../../components/NavHeaderUser';
import Loading from '../../components/Loading';

import decodeHtmlEntities from '../../helpers/decodeHtmlEntities';
import { htmlStyles } from '../../constants/htmlRendering';
import { fontFamily, fontSize } from '../../constants/fonts';
import colors from '../../constants/colors';
import { externalLinks, axiosInstance, apiUrls } from '../../constants/api';
import Ads from '../../components/UI/Ads';
import extractTweets from '../../helpers/extractTweets';
import YouTube from '../../components/YouTube';

import ScrollListContainer from '../../components/ScrollListContainer';
import ScrollListItem from '../../components/ScrollListItem';

import Global from '../../components/global';
import SectionTitle from '../../components/Details/SectionTitle';

export default class FeatureDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('feature.feature_details'),
    };
  };

  state = {
    searchText: '',
    user: {},
    dataSource: {
      isLoading: true,
      featuresItem: {},
    },
    isDescriptionVisible: false,
    relatedItems: {
      isLoading: true,
      data: [],
    },
    ads: [],
    webViewHeight: 0,
    isBookmarked: false,
  };

  async componentDidMount() {
    const storedValue = await AsyncStorage.getItem('app:user');

    if (storedValue) {
      this.setState({
        user: JSON.parse(storedValue),
      });
    }

    const id = this.props.navigation.getParam('id', {});

    this._getRelatedEvents();

    let requests = [
      axiosInstance(apiUrls.getFeatureDetails(id) + '?langCode=' + i18n.locale.toUpperCase()),
      axiosInstance(apiUrls.getAds(4, 0, 0) + '?langCode=' + i18n.locale.toUpperCase()),
    ];

    if (Global.user.token && Global.user.token.length > 5) {
      requests.push(axiosInstance(apiUrls.getBookmarks));
    }

    Promise.all(requests).then(([featuresItem, ads, bookmarks]) => {
      // console.log('featuresItem', featuresItem)
      // console.log('*************************************************')
      // console.log('ads', ads)
      // console.log('*************************************************')
      // console.log('bookmarks', bookmarks)
      // console.log('*************************************************')

      this.setState({
        dataSource: {
          featuresItem: featuresItem.data,
          isLoading: false,
        },
        ads: ads.data,
        isBookmarked:
          !!bookmarks &&
          !!bookmarks.data.find(
            item => item.EntityName.toLowerCase() === 'feature' && item.Eid === featuresItem.data.Id
          ),
      });
    });
  }

  // _getItem = () => {

  // axiosInstance(apiUrls.getFeatureDetails(id) + '?langCode=' + i18n.locale.toUpperCase()).then(
  // ({ data }) => {
  // this.setState({
  // dataSource: { featuresItem: data, isLoading: false },
  // });
  // }
  // );
  // };

  _getRelatedEvents = () => {
    const id = this.props.navigation.getParam('id', {});

    axiosInstance(apiUrls.getRelatedFeature(id) + '?langCode=' + i18n.locale.toUpperCase()).then(
      ({ data }) => {
        this.setState({
          relatedItems: { data: data.Items, isLoading: false },
        });
      }
    );
  };

  _getHomeItems = () => {
    const id = this.props.navigation.getParam('id', {});

    let model = {};
    model.languageCode = i18n.locale.toUpperCase();
    model.langCode = i18n.locale.toUpperCase();

    axiosInstance(apiUrls.postFeatures, model).then(({ data }) => {
      this.setState({
        dataSource: { features: data, isLoading: false },
      });
    });
  };

  _toggleDescription = () => {
    console.log(this.state.isDescriptionVisible);
    this.setState({
      isDescriptionVisible: !this.state.isDescriptionVisible,
    });
  };

  toggleBookmark = () => {
    const { navigation } = this.props;
    const { isBookmarked, dataSource } = this.state;

    const params = {
      Id: dataSource.featuresItem.Id,
      Entity: 'feature',
    };

    // console.log(navigation.state.params)

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

  _renderItemRelatedPosts = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.push(`${item.EntityName}Detail`, { id: item.Id, object: item });
      }}
    >
      <View style={index == 0 ? styles.boxShadowNoLeftMargin : styles.boxShadow} elevation={5}>
        <Image
          source={{ uri: item.ImageLandscapeThumbUrl }}
          style={{ width: 257, height: 127 }}
          resizeMode="cover"
        />

        <View style={{ height: 53 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              maxWidth: 245,
              marginTop: 11,
              marginLeft: 11,
              color: colors.basicText,
              fontSize: fontSize.medium,
              fontFamily: fontFamily.gothamBold,
            }}
          >
            {item.Title}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              maxWidth: 245,
              marginTop: 7,
              marginLeft: 11,
              color: colors.basicText,
              fontSize: 11,
              fontFamily: fontFamily.gothamMedium,
            }}
          >
            {item.Excerpt}
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            left: 15,
            top: 15,
            borderRadius: 60,
            borderColor: '#ffffff',
            borderWidth: 1,
            backgroundColor: '#ffffff',
          }}
        >
          <Text
            style={{
              marginLeft: 0,
              marginTop: 0,
              color: colors.brandColorBright,
              fontSize: 15,
              fontFamily: fontFamily.gothamBold,
              padding: 12,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {item.EntityName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  _listDividerRelatedPosts = () => <View style={styles.dividerContainerRecommended} />;

  render() {
    const { ads, dataSource, isBookmarked } = this.state;

    Moment.locale('en');

    let content = '';

    if (dataSource.featuresItem.ContentInPrimaryLang) {
      content = dataSource.featuresItem.ContentInPrimaryLang;
    }
    if (dataSource.featuresItem.Description) {
      content = dataSource.featuresItem.Description;
    }

    const decodedContent = decodeHtmlEntities(content.replace(/<(?:.|\n)*?>/gm, ''));

    if (this.state.dataSource.isLoading) {
      return <Loading />;
    }

    const htmlWithTweets = extractTweets(content);
    let YouTubeLinks = dataSource.featuresItem.ExternalContent || [];

    // console.log('this.state.dataSource', this.state.dataSource);
    // console.log('*******************************************************************************');

    // console.log(
    // 'dataSource.featuresItem.ContentInPrimaryLang',
    // dataSource.featuresItem.ContentInPrimaryLang
    // );
    // console.log('*******************************************************************************');

    // console.log('decodedContent', decodedContent)
    // console.log('*******************************************************************************');

    // console.log('dataSource.featuresItem.ExternalContent', dataSource.featuresItem.ExternalContent);
    // console.log('*******************************************************************************');

    // console.log('htmlWithTweets', htmlWithTweets)
    // console.log('*******************************************************************************')
    // console.log('content', content)
    // console.log('*******************************************************************************')

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View
            style={{
              marginTop: 8,
              marginHorizontal: 16,
              borderRadius: 10,
              backgroundColor: colors.backgroundLight,
              overflow: 'hidden',
            }}
          >
            <FullWidthImage source={{ uri: dataSource.featuresItem.ImageSquareThumbURL }} />

            <View
              style={{
                marginLeft: 0,
                marginRight: 0,
                flex: 1,
                paddingBottom: 35,
                paddingTop: 15,
              }}
            >
              <View
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  padding: 15,
                  paddingTop: 5,
                  paddingBottom: 5,
                  marginTop: -30,
                  backgroundColor: '#ffffff',
                }}
              >
                <View
                  style={{
                    marginVertical: 15,
                  }}
                >
                  <SectionTitle
                    text={dataSource.featuresItem.TitleInPrimaryLang}
                    messageToShare={externalLinks.getFeaturesUrl(dataSource.featuresItem.Id)}
                    isBookmarked={isBookmarked}
                    toggleBookmark={this.toggleBookmark}
                    isNewsFeatures={true}
                  />
                </View>

                <View>
                  <>
                    <HTML
                      html={htmlWithTweets.html}
                      renderers={{
                        youtube: () => {
                          return (
                            <YouTube
                              link={YouTubeLinks.shift()}
                              //links={dataSource.featuresItem.ExternalContent}
                            />
                          );
                        },
                        tweet: attributes => {
                          if (attributes.tweet) {
                            const tweet = htmlWithTweets.tweets[attributes.tweet];
                            return <Tweet key={Date.now() + '-' + Math.random()} tweet={tweet} />;
                          }
                          return null;
                        },
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
                  </>
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <ScrollListContainer
              headingLabel={i18n.t('events.related')}
              allLabel={i18n.t('home.see_all')}
              targetScreen="News"
            >
              <FlatList
                data={this.state.relatedItems.data}
                renderItem={({ item, index }) => (
                  <ScrollListItem
                    isRelated={true}
                    src={item.ImageLandscapeThumbUrl}
                    description={item.Title}
                    key={index.toString()}
                    navigationModel={{
                      targetScreen: `${item.EntityName}Detail`,
                      data: { id: item.Id, object: item },
                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </ScrollListContainer>
          </View>
          <FlatList
            data={ads}
            extraData={this.state}
            renderItem={({ item }) => <Ads ad={item} />}
            keyExtractor={item => item.CampaignId.toString()}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    shadowRadius: 6,
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
    shadowRadius: 6,
  },
  container: {
    backgroundColor: colors.primaryBgColor,
    flex: 1,
  },
  contentContainer: {
    paddingTop: 0,
  },
  developmentModeText: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 20,
    textAlign: 'center',
  },
  dividerContainer: {
    height: 1,
    width: 25,
  },
  dividerContainerEvent: {
    height: 19,
    width: 1,
  },
  dividerContainerRecommended: {
    height: 1,
    width: 0,
  },
  eventItem: {
    alignSelf: 'stretch',
    backgroundColor: '#c1c1c1',
    height: 40,
    marginTop: 3,
    padding: 10,
    textAlign: 'center',
  },
  input: {
    alignSelf: 'stretch',
    borderColor: '#7a42f4',
    borderWidth: 1,
    height: 40,
    margin: 15,
    textAlign: 'center',
  },
  searchInput: {
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: '#EAEAEA',
    borderRadius: 5,
    color: colors.basicText,
    fontFamily: fontFamily.gothamMedium,
    fontSize: 15,
    marginBottom: 30,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'left',
  },
});
