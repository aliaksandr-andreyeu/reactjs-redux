import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppRegistry,
  TextInput,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Moment from 'moment';
import FullWidthImage from 'react-native-fullwidth-image';
import { NavHeaderUser } from '../components/NavHeaderUser';
import Loading from '../components/Loading';
import i18n from '../../i18n';

import env from '../config';

FontBreeBold = Platform.OS === 'ios' ? 'bree-bold' : 'BreeBold';
FontBreeRegular = Platform.OS === 'ios' ? 'bree-regular' : 'BreeRegular';

export default class CategoryDetailScreen extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      // title: params ? params.otherParam : 'A Nested Details Screen',
      headerTitle: null,
      headerRight: <NavHeaderUser {...navigation} />,
    };
  };

  state = {
    category: {},
    user: {},
    dataSource: {
      isLoading: true,
      results: [],
    },
  };

  async componentDidMount() {
    const storedValue = await AsyncStorage.getItem('app:user');

    if (storedValue) {
      this.setState({
        user: JSON.parse(storedValue),
      });
    }
  }

  async componentWillMount() {
    this.setState({
      category: this.props.navigation.getParam('object', {}),
    });

    this._getSearchResults();
  }

  _getSearchResults = () => {
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (this.state.user.token && this.state.user.token.length > 4) {
      headers['auth-token'] = this.state.user.token;
    }

    fetch(
      `${env.api}api/search?langCode=` +
        i18n.locale.toUpperCase() +
        `&srCat=${this.props.navigation.getParam('id', {})}`,
      {
        method: 'GET',
        headers,
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.Message) {
          Alert.alert(responseJson.Message);
          return;
        }

        if (responseJson) {
          this.setState({
            dataSource: {
              results: responseJson,
              isLoading: false,
            },
          });
        }
      })
      .catch(error => {
        this.setState({
          dataSource: {
            results: [],
            isLoading: false,
          },
        });
      });
  };

  _renderItemSearch = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate(`${item.EntityName}Detail`, { id: item.Eid, object: item });
      }}
      style={{ marginBottom: 15 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1 }}>
        <View style={{ flex: 2 }}>
          <FullWidthImage source={{ uri: item.ImageSquareThumbURL }} />
        </View>
        <View style={{ flex: 4, paddingLeft: 10 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: '#707070',
              fontSize: 20,
              fontFamily: FontBreeBold,
              padding: 4,
              paddingTop: 0,
              marginBottom: 0,
            }}
          >
            {item.Title}
          </Text>
          <Text
            numberOfLines={4}
            ellipsizeMode="tail"
            style={{
              color: '#9E9E9B',
              fontSize: 12,
              fontFamily: FontBreeRegular,
              padding: 4,
              marginBottom: 0,
            }}
          >
            {item.Description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  _listDividerSearch = () => <View style={styles.dividerContainer} />;

  render() {
    Moment.locale('en');

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
              paddingBottom: 30,
            }}
          >
            <TouchableOpacity style={{ marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1 }}>
                <View style={{ flex: 2 }}>
                  <FullWidthImage source={{ uri: this.state.category.ImageSquareThumbURL }} />
                </View>
                <View style={{ flex: 4, paddingLeft: 10 }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      color: '#9E9E9B',
                      fontSize: 20,
                      fontFamily: FontBreeBold,
                      padding: 4,
                      paddingTop: 15,
                      marginBottom: 0,
                    }}
                  >
                    {this.state.category.NameInPrimaryLang}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.horizontalLine} />

            {this.state.dataSource.results.length > 0 && (
              <FlatList
                style={{ marginTop: 15 }}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.dataSource.results}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this._listDividerSearch}
                renderItem={this._renderItemSearch}
              />
            )}

            {this.state.dataSource.results.length == 0 && (
              <Text
                style={{
                  marginTop: 50,
                  textAlign: 'center',
                  marginBottom: 5,
                  color: '#9E9E9B',
                  fontSize: 24,
                  fontFamily: '',
                }}
              >
                {i18n.t('category.sorry_no_content')}
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  contentContainer: {
    paddingTop: 30,
  },
  developmentModeText: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 20,
    textAlign: 'center',
  },
  eventItem: {
    alignSelf: 'stretch',
    backgroundColor: '#c1c1c1',
    height: 40,
    marginTop: 3,
    padding: 10,
    textAlign: 'center',
  },
  horizontalLine: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 5,
    marginTop: 5,
    opacity: 0.1,
  },
  input: {
    alignSelf: 'stretch',
    borderColor: '#7a42f4',
    borderWidth: 1,
    height: 40,
    margin: 15,
    textAlign: 'center',
  },
});
