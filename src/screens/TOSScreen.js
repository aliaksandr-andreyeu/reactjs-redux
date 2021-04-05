import React from 'react';
import {
  Image,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppRegistry,
  TextInput,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { htmlStyles } from '../constants/htmlRendering';

import Prompt from 'rn-prompt';

import { createIconSetFromFontello } from 'react-native-vector-icons';
import HTML from 'react-native-render-html';
import fontelloConfig from '../assets/fonts/customicons-config.json';

import i18n from '../../i18n';

import env from '../config';

FontBreeBold = Platform.OS === 'ios' ? 'bree-bold' : 'BreeBold';
FontBreeRegular = Platform.OS === 'ios' ? 'bree-regular' : 'BreeRegular';

const Icon = createIconSetFromFontello(fontelloConfig);

export default class TOSScreen extends React.Component {
  static navigationOptions = {};

  state = {
    name: '',
    email: '',
    phone: '',
    user: {},
    profilePrompt: {
      isVisible: false,
      value: '',
      field: '',
      title: '',
    },
    content: 'Loading...',
  };

  _getContent() {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.state.user.token && this.state.user.token.length > 4) {
      headers['auth-token'] = this.state.user.token;
    }

    sortDirection = 'ASC';
    if (!this.state.sortOrder) {
      sortDirection = 'DESC';
    }

    requestURL = `${env.api}api/page/terms-of-use?langCode=${i18n.locale.toUpperCase()}`;

    fetch(requestURL, {
      method: 'GET',
      headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.Content) {
          this.setState({
            content: responseJson.Content,
          });
        }
      });
  }

  async componentDidMount() {
    this._getContent();

    let storedValue = await AsyncStorage.getItem('app:user');

    if (storedValue == null) {
      this.setState({
        user: {
          name: 'Name',
          email: 'email@example.com',
          country: 0,
          language: 0,
          phone: '+0 (000) 0000000',
          token: '',
        },
      });
    } else {
      storedValue = JSON.parse(storedValue);

      this.setState({
        user: storedValue,
      });
    }

    this.setState({
      isLoading: false,
    });
  }

  constructor(props) {
    super(props);
  }

  _editField = field => {
    this.setState({
      profilePrompt: {
        isVisible: true,
        field,
        value: this.state.user[field],
        title: `Please input your ${field}`,
      },
    });
  };

  _profilePromptCancelled = () => {
    this.setState({
      profilePrompt: {
        isVisible: false,
        field: '',
        value: '',
        title: 'Please input value',
      },
    });
  };

  _profilePromptOK(value) {
    user = this.state.user;
    user[this.state.profilePrompt.field] = value;

    this.setState({
      user,
    });

    field = this.state.profilePrompt.field.replace('name', 'FullName').replace('email', 'Email');

    this._profilePromptCancelled();

    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.state.user.token && this.state.user.token.length > 4) {
      headers['auth-token'] = this.state.user.token;
    }

    fetch(`${env.api}api/account/modifydata`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        Field: field,
        Value: value,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          //
        } else {
          Alert.alert(responseJson.Message);
        }
      })
      .catch(error => {
        console.log('error', error);
        if (error && error.Message) {
          Alert.alert(error.Message);
        } else {
          Alert.alert(error);
        }
      });
  }

  render() {
    if (this.state.isLoading) {
      return <View />;
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text
            style={{
              color: '#2F8C83',
              fontSize: 20,
              fontFamily: FontBreeBold,
              paddingBottom: 30,
              textAlign: 'center',
            }}
          >
            {i18n.t('tos.title')}
          </Text>

          <HTML
            html={this.state.content}
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
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 30,
    paddingTop: 30,
  },
  greenButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#2F8C83',
    borderRadius: 80,
    borderWidth: 2,
    flex: 1,
    padding: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  greenButtonRegister: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#c1c1c1',
    borderRadius: 80,
    borderWidth: 2,
    flex: 1,
    marginLeft: 5,
    padding: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  horizontalLine: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 24,
    marginTop: 24,
    opacity: 0.1,
  },
  profileTextItem: {
    color: '#949494',
    fontFamily: FontBreeBold,
    fontSize: 15,
  },
});
