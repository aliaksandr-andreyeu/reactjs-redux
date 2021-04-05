import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  FlatList,
  Dimensions,
} from 'react-native';

import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';

import AsyncStorage from '@react-native-community/async-storage';

import moment from 'moment';

import { axiosInstance, apiUrls } from '../../constants/api';
import { NavHeaderUser } from '../../components/NavHeaderUser';
import FilterAndSearchBar from '../../components/FilterAndSearchBar';
import Loading from '../../components/Loading';

import i18n from '../../../i18n';
import { fontFamily, fontSize } from '../../constants/fonts';
import colors from '../../constants/colors';

import styles from './styles';
import * as actions from './actions';
import Icon from '../../components/Icon';
import { getSortAndFilterModel } from '../../helpers/filters';

import getLocaleDate from '../../helpers/getLocaleDate';

import Global from '../../components/global';

import env from '../../config';

import NewsItem from './components/NewsItem';

class NewsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('news.news'),
    };
  };

  state = {
    isListView: true,
    searchText: '',
    user: {},
    dataSource: {
      isLoading: true,
      news: [],
    },
    isFilterMode: false,
    sortOrder: false, // false - desc, true - asc
    results: [],
  };

  async componentDidMount() {
    const { clearFiltersAndSorting } = this.props;
    clearFiltersAndSorting();

    const storedValue = await AsyncStorage.getItem('app:user');

    if (storedValue) {
      this.setState({
        user: JSON.parse(storedValue),
      });
    }

    this._getHomeItems();
    this._getCategories();
  }

  componentDidUpdate(prevProps) {
    const { sortOptions, filterOptions } = this.props;

    if (
      !isEqual(sortOptions, prevProps.sortOptions) ||
      !isEqual(filterOptions, prevProps.filterOptions)
    ) {
      this.fetchItemsWithParams(sortOptions, filterOptions);
    }
  }

  fetchItemsWithParams = (sortParams, filterParams) => {
    let model = getSortAndFilterModel(sortParams, filterParams);

    model.languageCode = i18n.locale.toUpperCase();
    model.langCode = i18n.locale.toUpperCase();

    axiosInstance
      .post(apiUrls.postNews, model)
      .then(({ data }) => {
        if (data.Items) {
          this.setState({
            dataSource: { news: data.Items, isLoading: false },
          });
        }
      })
      .catch(err => console.log(err));
  };

  _getHomeItems(categories = '') {
    this.setState({
      dataSource: { news: [], isLoading: true },
    });

    headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (this.state.user.token && this.state.user.token.length > 4) {
      headers['auth-token'] = this.state.user.token;
    }

    sortDirection = 'ASC';
    if (!this.state.sortOrder) {
      sortDirection = 'DESC';
    }

    requestURL = `${env.api}api/news?sortDirection=${sortDirection}`;
    if (categories.length > 0) {
      requestURL += `&srCat=${categories}`;
    }

    let model = {};
    model.languageCode = i18n.locale.toUpperCase();
    model.langCode = i18n.locale.toUpperCase();

    axiosInstance.post(apiUrls.postNews, model).then(({ data }) => {
      if (data.Items) {
        this.setState({
          dataSource: { news: data.Items, isLoading: false },
        });
      }
    });
  }

  _getCategories = () => {
    this.setState({
      results: [],
    });

    headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (this.state.user.token && this.state.user.token.length > 4) {
      headers['auth-token'] = this.state.user.token;
    }

    fetch(`${env.api}api/sportcategories?langCode=` + i18n.locale.toUpperCase(), {
      method: 'GET',
      headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          this.setState({
            results: responseJson,
          });
        }
      });
  };

  _renderItemRecommended = ({ item, index }) => {
    const width = Dimensions.get('window').width - 15 * 2 - 13 * 2;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          this.props.navigation.navigate(`${item.EntityName}Detail`, { id: item.Id, object: item });
        }}
      >
        <View style={styles.boxShadow} elevation={5}>
          <Image
            source={{ uri: item.ImageSquareThumbURL }}
            style={{ width: width / 2, height: 127 }}
          />

          <View style={{ height: 53 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                maxWidth: width / 2 - 12,
                marginTop: 11,
                marginLeft: 11,
                color: '#6D6E71',
                fontSize: 12,
                fontFamily: fontFamily.gothamBold,
              }}
            >
              {item.Title}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                maxWidth: width / 2 - 12,
                marginTop: 7,
                marginLeft: 11,
                color: '#E4E4E4',
                fontSize: 8,
                fontFamily: fontFamily.gothamMedium,
              }}
            >
              {item.Excerpt}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _listDividerRecommended = () => <View style={styles.dividerContainerRecommended} />;

  _handleView = () => {
    this.setState({
      isListView: !this.state.isListView,
    });
  };

  _toggleFilter = () => {
    console.log('toggle filter');

    this.setState({
      isFilterMode: !this.state.isFilterMode,
    });
  };

  _handleSort = () => {
    this.setState(
      {
        sortOrder: !this.state.sortOrder,
      },
      () => {
        this._getHomeItems();
      }
    );
  };

  _listDividerEvent = () => <View style={styles.dividerContainerEvent} />;

  _handleCategoryPress(key) {
    this.setState(state => {
      const results = state.results.map((item, j) => {
        if (j === key) {
          item.isCategorySelected = !item.isCategorySelected;
          return item;
        }
        return item;
      });

      return {
        results,
      };
    });
  }

  _clearCategoryFilter() {
    this.setState(state => {
      const results = state.results.map((item, j) => {
        if (true) {
          item.isCategorySelected = false;
          return item;
        }
        return item;
      });

      return {
        results,
      };
    });
  }

  _applyCategoryFilter() {
    categories = '';

    this.state.results.map((item, j) => {
      if (item.isCategorySelected) {
        if (categories.length > 0) {
          categories += '|';
        }
        categories += item.NameInPrimaryLang;
      }
    });

    this._toggleFilter();
    this._getHomeItems(categories);
  }

  _getDate = item => {
    let date = getLocaleDate(item);
    return date ? (
      <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        style={{
          color: colors.textBasic,
          fontSize: fontSize.regular,
          marginLeft: 8,
          marginTop: 7,
          fontFamily: fontFamily.gothamMedium,
          lineHeight: fontSize.regular + 6,
        }}
      >
        {date}
      </Text>
    ) : null;
  };

  _renderItemEvent = ({ item, index }) => {
    const { isBookmarked } = this.state;
    const { getIcon, iconLibraries } = Icon;
    const { navigation } = this.props;

    const isSignedInUser = Boolean(
      Global.user && Global.user.token && Global.user.token.length > 5
    );

    // console.log('item', item)

    return (
      <NewsItem
        key={index}
        navigation={navigation}
        item={item}
        isBookmarked={isBookmarked}
        isSignedInUser={isSignedInUser}
        getIcon={getIcon}
        iconLibraries={iconLibraries}
      />
    );
  };

  render() {
    const { navigation } = this.props;
    moment.locale('en');

    if (this.state.dataSource.isLoading) {
      return <Loading />;
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              flex: 1,
              paddingBottom: 50,
            }}
          >
            <FilterAndSearchBar
              filterTargetScreen="NewsFilterScreen"
              // sortTargetScreen="NewsSortScreen"
            />

            {!this.state.isListView && (
              <FlatList
                horizontal={false}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                data={this.state.dataSource.news}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this._listDividerRecommended}
                renderItem={this._renderItemRecommended}
                initialNumToRender={15}
              />
            )}

            {this.state.isListView && (
              <FlatList
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.dataSource.news}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this._listDividerEvent}
                renderItem={this._renderItemEvent}
                initialNumToRender={15}
              />
            )}

            {this.state.dataSource.news.length == 0 && (
              <Text
                style={{
                  marginTop: 150,
                  textAlign: 'center',
                  marginBottom: 5,
                  color: '#9E9E9B',
                  fontSize: 24,
                  fontFamily: fontFamily.gothamBold,
                }}
              >
                {i18n.t('news.no_news_in_selected_categories')}
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  filterOptions: state.news.filters,
  sortOptions: state.news.sortOptions,
});

const mapDispatchToProps = {
  updateStore: actions.setSorting,
  clearFiltersAndSorting: actions.clearNewsData,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsScreen);
